import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { Colors, FontSizes, FontWeights } from '../constants/theme';
import { Picker } from '@react-native-picker/picker';
import Button from '../components/Button';
import api from '../utils/axios.js';
import { AuthContext } from '../utils/authContext.jsx';

export default function LoginScreen() {
  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const { logIn } = useContext(AuthContext);

  const userTypeMap = {
    student: 0,
    parent: 1,
    teacher: 2,
    department: 3,
    club: 4,
  };

  const handleLogin = async () => {
    try {
      const res = await api.post(`/auth/login/${userTypeMap[userType]}`, { email, password });
      if (res.status === 200) {
        setShowOtpForm(true);
      }

      if (res.status !== 200) {
        Alert.alert('Login Failed', res.data?.message || 'An error occurred during login.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const res = await api.post(`/auth/verify-otp/${userTypeMap[userType]}`, {
        email,
        otpCode: otp,
      });
      if (res.status === 200) {
        await logIn(userType, res.data.accessToken, res.data.refreshToken);
      }

      if (res.status !== 200) {
        Alert.alert(
          'OTP Failed',
          res.data?.message || 'An error occurred during OTP verification.'
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      {!showOtpForm ? (
        <>
          <Text style={styles.mainHeading}>Login</Text>

          {/* Login As */}
          <Text style={styles.label}>Login As:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={userType}
              onValueChange={itemValue => setUserType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select User Type" value="" />
              <Picker.Item label="Parent" value="parent" />
              <Picker.Item label="Student" value="student" />
              <Picker.Item label="Teacher" value="teacher" />
              <Picker.Item label="Dept/Club" value="department" />
              <Picker.Item label="Club" value="club" />
            </Picker>
          </View>

          {/* Email */}
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Password */}
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button title="Login" onPress={handleLogin} />
        </>
      ) : (
        <>
          <Text style={styles.mainHeading}>Verify OTP</Text>

          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#eee' }]}
            value={email}
            editable={false}
          />

          <Text style={styles.label}>Enter OTP:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit OTP"
            keyboardType="numeric"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />

          <Button title="Submit OTP" onPress={handleOtpSubmit} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colors.light.background,
  },
  mainHeading: {
    fontSize: FontSizes.mainHeading,
    fontWeight: FontWeights.bold,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.medium,
    color: Colors.light.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: FontSizes.body,
    color: Colors.light.text,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    color: Colors.light.text,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: Colors.light.background,
    fontSize: FontSizes.subHeading,
    fontWeight: FontWeights.bold,
  },
});
