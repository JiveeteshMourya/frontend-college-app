import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import api from '../../../../../utils/axios';
import { Colors, FontSizes, FontWeights } from '../../../../../constants/theme';
import { AuthContext } from '../../../../../utils/authContext';
import Button from '../../../../../components/Button';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateAttendanceScreen() {
  const { userType } = useContext(AuthContext);

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // attendance state: studentId -> 0|1|2
  const [attendance, setAttendance] = useState({});

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) fetchStudents(selectedClass);
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const res = await api.get(`/class/my-classes/${userType}`);
      setClasses(res.data.data || []);
    } catch (err) {
      console.log('Error fetching classes:', err);
    }
  };

  const fetchStudents = async classId => {
    try {
      setLoading(true);
      const res = await api.get(`/class/${classId}`);
      const cls = res.data.data;

      if (!cls || !cls.students) {
        setStudents([]);
        return;
      }

      setStudents(cls.students);

      // default attendance → 0 (not marked)
      const initial = {};
      cls.students.forEach(s => (initial[s._id] = 0));
      setAttendance(initial);
    } catch (err) {
      console.log('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = studentId => {
    setAttendance(prev => {
      const next = { ...prev };
      next[studentId] = (next[studentId] + 1) % 3; // 0 → 1 → 2 → 0
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!selectedClass) {
      return Alert.alert('Error', 'Select a class first.');
    }

    setSubmitting(true);
    try {
      const payload = {
        classId: selectedClass,
        date,
        attendance,
      };

      const res = await api.post('/attendance', payload);

      if (res.status === 201 || res.status === 200) {
        Alert.alert('Success', 'Attendance submitted successfully.');
      } else {
        Alert.alert('Error', res.data?.message || 'Failed to submit attendance.');
      }
    } catch (err) {
      console.log('Submit error:', err);
      Alert.alert('Error', 'Could not submit attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStudentRow = ({ item, index }) => (
    <View style={styles.studentRow}>
      <Text style={styles.studentIndex}>{index + 1}.</Text>

      <Text style={styles.studentName}>
        {item.firstName} {item.lastName}
      </Text>

      <TouchableOpacity
        style={[
          styles.toggleButton,
          attendance[item._id] === 1 && styles.present,
          attendance[item._id] === 2 && styles.absent,
        ]}
        onPress={() => toggleAttendance(item._id)}
      >
        <Text style={styles.toggleText}>
          {attendance[item._id] === 0 ? 'None' : attendance[item._id] === 1 ? 'Present' : 'Absent'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ---------- CLASS SELECTOR ---------- */}
      <Text style={styles.label}>Select Class</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedClass}
          onValueChange={val => setSelectedClass(val)}
          style={styles.picker}
        >
          <Picker.Item label="Select Class" value="" />
          {classes.map(cls => (
            <Picker.Item
              key={cls._id}
              label={`${cls.stream} ${cls.semester} - ${cls.subject}`}
              value={cls._id}
            />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Select Date</Text>

      <TouchableOpacity style={styles.dateBox} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="spinner"
          onChange={(e, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      {/* ---------- STUDENT LIST ---------- */}
      {loading ? (
        <ActivityIndicator size="large" color={Colors.light.primary} />
      ) : (
        <FlatList
          data={students}
          keyExtractor={item => item._id}
          renderItem={renderStudentRow}
          ListEmptyComponent={<Text style={styles.empty}>No students found for this class.</Text>}
          style={{ marginTop: 10 }}
        />
      )}

      {/* ---------- SUBMIT BUTTON ---------- */}
      <View style={{ marginTop: 20 }}>
        <Button title="Submit Attendance" onPress={handleSubmit} loading={submitting} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  label: {
    color: Colors.light.text,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
  },
  picker: {
    color: Colors.light.text,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: Colors.light.border,
  },
  studentIndex: {
    width: 30,
    color: Colors.light.text,
    fontSize: FontSizes.body,
  },
  studentName: {
    flex: 1,
    color: Colors.light.text,
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.icon,
  },
  toggleText: {
    color: Colors.light.text,
    fontSize: 12,
    fontWeight: FontWeights.medium,
  },
  present: {
    backgroundColor: '#2fbf8f',
    borderColor: '#2fbf8f',
  },
  absent: {
    backgroundColor: '#e25b5b',
    borderColor: '#e25b5b',
  },
  empty: {
    marginTop: 40,
    textAlign: 'center',
    color: Colors.light.text,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  dateText: {
    color: Colors.light.text,
    fontSize: FontSizes.body,
  },
});
