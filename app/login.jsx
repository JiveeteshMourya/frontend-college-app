import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Colors, FontSizes, FontWeights } from '../constants/theme';
import { Picker } from '@react-native-picker/picker';
import Button from '../components/Button';
import api from '../utils/axios.js';
import { AuthContext } from '../utils/authContext.jsx';

export default function LoginScreen() {
  const [userType, setUserType] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const { logIn } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/auth/login/${userType}`, { email, password });
      if (res.status === 200) {
        setLoading(false);
        setShowOtpForm(true);
      }
      if (res.status !== 200) {
        setLoading(false);
        Alert.alert('Login Failed', res.data?.message || 'An error occurred during login.');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      setLoading(true);
      const res = await api.post(`/auth/verify-otp/${userType}`, {
        email,
        otpCode: otp,
      });
      if (res.status === 200) {
        setLoading(false);
        await logIn(
          userType,
          res.data.data.accessToken,
          res.data.data.refreshToken,
          res.data.data.user._id
        );
      }
      if (res.status !== 200) {
        setLoading(false);
        Alert.alert(
          'OTP Failed',
          res.data?.message || 'An error occurred during OTP verification.'
        );
      }
    } catch (err) {
      console.log(err);
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
              <Picker.Item label="Select User Type" value={-1} />
              <Picker.Item label="Student" value={0} />
              <Picker.Item label="Parent" value={1} />
              <Picker.Item label="Teacher" value={2} />
              {/* <Picker.Item label="Dept/Club" value={3} />
              <Picker.Item label="Club" value={4} /> */}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
