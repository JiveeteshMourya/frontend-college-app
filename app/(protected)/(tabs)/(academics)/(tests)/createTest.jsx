import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Colors, FontSizes, FontWeights } from '../../../../../constants/theme';
import { AuthContext } from '../../../../../utils/authContext';
import api from '../../../../../utils/axios';
import Button from '../../../../../components/Button';
import { useRouter, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateTestScreen() {
  const { userType } = useContext(AuthContext);
  const router = useRouter();
  const params = useLocalSearchParams(); // may contain mode='edit', id, and test data

  const isEditMode = params.mode === 'edit';
  const testId = params.id;

  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState('');
  const [type, setType] = useState('');
  const [number, setNumber] = useState('');
  const [syllabus, setSyllabus] = useState('');
  const [date, setDate] = useState(new Date());
  const [totalMarks, setTotalMarks] = useState('');
  const [remarks, setRemarks] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const TEST_TYPES = ['THEORY', 'PRACTICAL', 'QUIZ', 'PRESENTATION'];
  const TEST_NUMBERS = [1, 2, 3];

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (isEditMode && params.test) {
      const t = JSON.parse(params.test);
      setClassId(t.classId?._id || '');
      setType(t.type || '');
      setNumber(String(t.number || ''));
      setSyllabus(t.syllabus || '');
      setDate(new Date(t.date));
      setTotalMarks(String(t.totalMarks || ''));
      setRemarks(t.remarks || '');
    }
  }, [params]);

  const fetchClasses = async () => {
    try {
      const res = await api.get(`/class/my-classes/${userType}`);
      if (res.status === 200) setClasses(res.data.data || []);
    } catch (err) {
      console.log('Error fetching classes:', err);
    }
  };

  const handleSubmit = async () => {
    if (!classId || !type || !number || !totalMarks) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        classId,
        number: Number(number),
        type,
        syllabus,
        date,
        totalMarks: Number(totalMarks),
        remarks,
      };

      let res;
      if (isEditMode) {
        // 🔹 Edit test
        res = await api.put(`/test/${testId}`, payload);
      } else {
        // 🔹 Create new test
        res = await api.post('/test', payload);
      }

      if (res.status === 200 || res.status === 201) {
        Alert.alert('Success', res.data.message || 'Test saved successfully.');
        router.back();
      } else {
        Alert.alert('Error', res.data?.message || 'Something went wrong.');
      }
    } catch (err) {
      console.log('Error submitting test:', err);
      Alert.alert('Error', 'Failed to save test.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <Text style={styles.mainHeading}>{isEditMode ? 'Edit Test' : 'Create Test'}</Text>

        {/* Class */}
        <Text style={styles.label}>Class *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={classId}
            onValueChange={val => setClassId(val)}
            style={styles.picker}
          >
            <Picker.Item label="Select Class" value="" />
            {classes.map(cls => (
              <Picker.Item
                key={cls._id}
                label={`${cls.stream} ${cls.semester} - ${cls.subject} (${cls.courseType})`}
                value={cls._id}
              />
            ))}
          </Picker>
        </View>

        {/* Type */}
        <Text style={styles.label}>Test Type *</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={type} onValueChange={val => setType(val)} style={styles.picker}>
            <Picker.Item label="Select Test Type" value="" />
            {TEST_TYPES.map(t => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>
        </View>

        {/* Number */}
        <Text style={styles.label}>Test Number *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={number}
            onValueChange={val => setNumber(val)}
            style={styles.picker}
          >
            <Picker.Item label="Select Test Number" value="" />
            {TEST_NUMBERS.map(n => (
              <Picker.Item key={n} label={`${n}`} value={n} />
            ))}
          </Picker>
        </View>

        {/* Date */}
        <Text style={styles.label}>Date *</Text>
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

        {/* Total Marks */}
        <Text style={styles.label}>Total Marks *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter total marks"
          keyboardType="numeric"
          value={totalMarks}
          onChangeText={setTotalMarks}
        />

        {/* Syllabus */}
        <Text style={styles.label}>Syllabus</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter syllabus (optional)"
          value={syllabus}
          onChangeText={setSyllabus}
        />

        {/* Remarks */}
        <Text style={styles.label}>Remarks</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter remarks (optional)"
          value={remarks}
          onChangeText={setRemarks}
        />

        <Button title={isEditMode ? 'Update Test' : 'Create Test'} onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 50 },
  container: { flexGrow: 1, backgroundColor: Colors.light.background, padding: 24 },
  mainHeading: {
    fontSize: FontSizes.mainHeading,
    fontWeight: FontWeights.bold,
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    color: Colors.light.text,
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 10,
    marginBottom: 16,
    overflow: 'hidden',
  },
  picker: { color: Colors.light.text },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    fontSize: FontSizes.body,
    color: Colors.light.text,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  dateText: { color: Colors.light.text, fontSize: FontSizes.body },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
