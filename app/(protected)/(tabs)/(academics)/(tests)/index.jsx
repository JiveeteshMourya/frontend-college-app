import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors, FontSizes, FontWeights } from '../../../../../constants/theme';
import { AuthContext } from '../../../../../utils/authContext';
import api from '../../../../../utils/axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function TestScreen() {
  const { userType } = useContext(AuthContext);
  const [tests, setTests] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const statusOptions = [
    { label: 'All', value: '' },
    { label: 'Scheduled', value: 'SCHEDULED' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    fetchTests();
  }, [selectedStatus, selectedClass]);

  const fetchClasses = async () => {
    try {
      const res = await api.get(`/class/my-classes/${userType}`);
      if (res.status === 200) setClasses(res.data.data || []);
    } catch (err) {
      console.log('Error fetching classes:', err);
    }
  };

  const fetchTests = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      if (userType === 0 || userType === 2) {
        const params = [];
        if (selectedStatus) params.push(`status=${selectedStatus}`);
        if (selectedClass) params.push(`class=${selectedClass}`);
        endpoint = params.length > 0 ? `/test/my-tests?${params.join('&')}` : '/test/my-tests';

        const res = await api.post(endpoint);
        if (res.status === 200) setTests(res.data.data || []);
      } else if (userType === 1) {
        const res = await api.get('/parent/upcoming-tests');
        if (res.status === 200) setTests(res.data.data || []);
      }
    } catch (err) {
      console.log('Error fetching tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderTestCard = ({ item }) => {
    const { classId } = item;
    const classLabel = classId
      ? `${classId.stream} ${classId.semester} - ${classId.subject} (${classId.courseType})`
      : 'Unknown Class';
    const date = new Date(item.date).toDateString();

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => router.push({ pathname: 'testDetails', params: { id: item._id } })}
      >
        <View style={styles.cardHeader}>
          <Ionicons name="document-text-outline" size={22} color="teal" />
          <Text style={styles.testTitle}>
            {item.type} Test {item.number}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="school-outline" size={16} color="#777" />
          <Text style={styles.testInfo}>{classLabel}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#777" />
          <Text style={styles.testInfo}>Date: {date}</Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name={
              item.status === 'SCHEDULED'
                ? 'time-outline'
                : item.status === 'COMPLETED'
                  ? 'checkmark-circle-outline'
                  : 'close-circle-outline'
            }
            size={16}
            color={
              item.status === 'SCHEDULED'
                ? '#0077b6'
                : item.status === 'COMPLETED'
                  ? 'green'
                  : 'red'
            }
          />
          <Text style={[styles.testInfo, styles.statusText]}>{item.status}</Text>
        </View>

        {item.teacherId && (
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#777" />
            <Text style={styles.testInfo}>
              {/* {item.teacherId.firstName} {item.teacherId.lastName} */}
              Test Teacher
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={{ color: Colors.light.text, marginTop: 10 }}>Loading Tests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filters */}
      {userType !== 1 && (
        <View style={styles.filterContainer}>
          <View style={styles.filterHeader}>
            <Ionicons name="funnel-outline" size={18} color="teal" />
            <Text style={styles.filterTitle}>Filters</Text>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={val => setSelectedStatus(val)}
              style={styles.picker}
            >
              {statusOptions.map(s => (
                <Picker.Item key={s.value} label={s.label} value={s.value} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedClass}
              onValueChange={val => setSelectedClass(val)}
              style={styles.picker}
            >
              <Picker.Item label="All Classes" value="" />
              {classes.map(cls => (
                <Picker.Item
                  key={cls._id}
                  label={`${cls.stream} ${cls.semester} - ${cls.subject}`}
                  value={cls._id}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {/* Tests List */}
      {tests.length > 0 ? (
        <FlatList
          data={tests}
          renderItem={renderTestCard}
          keyExtractor={item => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Ionicons name="alert-circle-outline" size={40} color="#999" />
          <Text style={styles.noDataText}>No tests found.</Text>
        </View>
      )}

      {/* Floating Add Button */}
      {userType === 2 && (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('createTest')}>
          <Ionicons name="add" size={32} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  filterContainer: {
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.light.border || 'rgba(0,0,0,0.1)',
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  filterTitle: {
    fontWeight: '600',
    fontSize: 15,
    color: Colors.light.text,
    marginLeft: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    color: Colors.light.text,
  },
  listContainer: {
    paddingBottom: 90,
  },
  card: {
    backgroundColor: Colors.light.card,
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.light.border || 'rgba(0,0,0,0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  testTitle: {
    fontSize: 17,
    fontWeight: FontWeights.bold,
    color: Colors.light.text,
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  testInfo: {
    fontSize: 14,
    color: Colors.light.text,
    marginLeft: 6,
  },
  statusText: {
    textTransform: 'capitalize',
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  noDataText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 10,
    fontSize: 15,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: 'teal',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
