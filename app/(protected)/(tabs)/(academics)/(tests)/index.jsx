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
        // Build endpoint dynamically
        if (!selectedStatus && !selectedClass) {
          endpoint = '/test/my-tests'; // No filters applied
        } else {
          const params = [];
          if (selectedStatus) params.push(`status=${selectedStatus}`);
          if (selectedClass) params.push(`class=${selectedClass}`);
          endpoint = `/test/my-tests?${params.join('&')}`;
        }

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

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push({ pathname: 'testDetails', params: { id: item._id } })}
      >
        <Text style={styles.testTitle}>
          {item.type} Test {item.number}
        </Text>
        <Text style={styles.testInfo}>Class: {classLabel}</Text>
        <Text style={styles.testInfo}>Date: {new Date(item.date).toDateString()}</Text>
        <Text style={styles.testInfo}>Status: {item.status}</Text>
        {item.teacherId && (
          <Text style={styles.testInfo}>
            Teacher: {item.teacherId.firstName} {item.teacherId.lastName}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainHeading}>Tests</Text>

      {/* Filters (only for teacher/student) */}
      {userType !== 1 && (
        <View style={styles.filterContainer}>
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
          verticle
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noDataText}>No tests found.</Text>
      )}

      {/* Floating Add Button for Teachers */}
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
  mainHeading: {
    fontSize: FontSizes.mainHeading,
    fontWeight: FontWeights.bold,
    color: Colors.light.text,
    marginBottom: 16,
  },
  filterContainer: {
    marginBottom: 10,
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
    paddingBottom: 20,
    paddingHorizontal: 5,
  },
  card: {
    width: width * 0.9, // 90% of screen width
    height: 180, // rectangular look
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    justifyContent: 'center',
  },
  testTitle: {
    fontSize: FontSizes.subHeading,
    fontWeight: FontWeights.bold,
    color: Colors.light.text,
    marginBottom: 8,
  },
  testInfo: {
    fontSize: FontSizes.body,
    color: Colors.light.text,
    marginBottom: 3,
  },
  noDataText: {
    textAlign: 'center',
    color: Colors.light.icon,
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: Colors.light.tint,
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
