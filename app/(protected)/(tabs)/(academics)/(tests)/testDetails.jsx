import { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors, FontSizes, FontWeights } from '../../../../../constants/theme';
import api from '../../../../../utils/axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AuthContext } from '../../../../../utils/authContext';

export default function TestDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { userType } = useContext(AuthContext);
  const router = useRouter();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [status, setStatus] = useState('');

  const STATUS_OPTIONS = ['SCHEDULED', 'COMPLETED', 'CANCELLED'];

  useEffect(() => {
    fetchTestDetails();
  }, [id]);

  const fetchTestDetails = async () => {
    try {
      const res = await api.get(`/test/${id}`);
      if (res.status === 200) {
        setTest(res.data.data);
        setStatus(res.data.data.status);
      }
    } catch (err) {
      console.log('Error fetching test details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async newStatus => {
    if (!test) return;
    Alert.alert(
      'Confirm Status Change',
      `Are you sure you want to mark this test as ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Update',
          onPress: async () => {
            try {
              setUpdatingStatus(true);
              const res = await api.put(`/test/${test._id}`, { status: newStatus });
              if (res.status === 200) {
                Alert.alert('Success', res.data.message);
                setStatus(newStatus);
              }
            } catch (err) {
              console.log('Error updating status:', err);
              Alert.alert('Error', 'Failed to update status.');
            } finally {
              setUpdatingStatus(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!test) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Test not found.</Text>
      </View>
    );
  }

  const { teacherId, classId } = test;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.mainHeading}>🧾 Test Details</Text>

      {/* --- Test Overview --- */}
      <View style={styles.card}>
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{test.type}</Text>

        <Text style={styles.label}>Test Number:</Text>
        <Text style={styles.value}>{test.number}</Text>

        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{new Date(test.date).toDateString()}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, { fontWeight: FontWeights.bold, color: statusColor(status) }]}>
          {status}
        </Text>

        {test.updatedAt && (
          <Text style={styles.infoText}>
            Last updated on {new Date(test.updatedAt).toLocaleString()}
          </Text>
        )}

        {userType === 2 && (
          <View style={styles.statusUpdateBox}>
            <Text style={styles.label}>Change Status:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={status}
                onValueChange={val => {
                  setStatus(val);
                  handleStatusUpdate(val);
                }}
                style={styles.picker}
              >
                {STATUS_OPTIONS.map(s => (
                  <Picker.Item key={s} label={s} value={s} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {test.totalMarks && (
          <>
            <Text style={styles.label}>Total Marks:</Text>
            <Text style={styles.value}>{test.totalMarks}</Text>
          </>
        )}

        {test.syllabus && (
          <>
            <Text style={styles.label}>Syllabus:</Text>
            <Text style={styles.value}>{test.syllabus}</Text>
          </>
        )}

        {test.remarks && (
          <>
            <Text style={styles.label}>Remarks:</Text>
            <Text style={styles.value}>{test.remarks}</Text>
          </>
        )}
      </View>

      {/* --- Class Info --- */}
      <View style={styles.card}>
        <Text style={styles.subHeading}>🏫 Class Information</Text>
        {classId ? (
          <Text style={styles.infoText}>
            {classId.stream} {classId.semester} - {classId.subject} ({classId.courseType})
          </Text>
        ) : (
          <Text style={styles.infoText}>N/A</Text>
        )}
      </View>

      {/* --- Teacher Info --- */}
      <View style={styles.card}>
        <Text style={styles.subHeading}>👩‍🏫 Teacher Information</Text>
        {teacherId ? (
          <>
            <Text style={styles.infoText}>
              {teacherId.firstName} {teacherId.lastName}
            </Text>
            <Text style={styles.infoText}>Emp ID: {teacherId.empId}</Text>
            <Text style={styles.infoText}>Email: {teacherId.email}</Text>
          </>
        ) : (
          <Text style={styles.infoText}>N/A</Text>
        )}
      </View>

      {/* --- Teacher Actions --- */}
      {userType === 2 && (
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: 'teal' }]}
            onPress={() =>
              router.push({
                pathname: 'createTest',
                params: { mode: 'edit', id: test._id, test: JSON.stringify(test) },
              })
            }
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: 'crimson' }]}
            onPress={() => {
              Alert.alert('Confirm Delete', 'Cancel this test?', [
                { text: 'No', style: 'cancel' },
                {
                  text: 'Yes, Cancel',
                  onPress: async () => {
                    try {
                      const res = await api.delete(`/test/${test._id}`);
                      if (res.status === 200) {
                        Alert.alert('Deleted', res.data.message);
                        router.back();
                      }
                    } catch (err) {
                      console.log('Delete failed', err);
                      Alert.alert('Error', 'Failed to delete test.');
                    }
                  },
                },
              ]);
            }}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {updatingStatus && (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={Colors.light.tint} />
          <Text style={styles.infoText}>Updating status...</Text>
        </View>
      )}
    </ScrollView>
  );
}

function statusColor(status) {
  switch (status) {
    case 'COMPLETED':
      return 'green';
    case 'SCHEDULED':
      return '#0077b6';
    case 'CANCELLED':
      return 'crimson';
    default:
      return Colors.light.text;
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.light.background,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 18,
    textAlign: 'center',
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.light.border || 'rgba(0,0,0,0.1)',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.icon,
    marginTop: 6,
  },
  value: {
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 2,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  picker: {
    color: Colors.light.text,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 18,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.light.icon,
    fontSize: 15,
  },
  statusUpdateBox: {
    marginTop: 8,
  },
});
