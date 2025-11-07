import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../constants/theme';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import api from '../utils/axios.js';
import { AuthContext } from '../utils/authContext.jsx';

export default function LoginScreen() {
  const [userType, setUserType] = useState(-1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { logIn } = useContext(AuthContext);

  const handleLogin = async () => {
    if (userType === -1 || !email || !password) {
      return Alert.alert('Please fill all fields');
    }
    setLoading(true);
    try {
      const res = await api.post(`/auth/login/${userType}`, { email, password });
      if (res.status === 200) {
        setShowOtpForm(true);
      } else {
        Alert.alert('Login Failed', res.data?.message || 'Invalid credentials.');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong while logging in.');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp) return Alert.alert('Please enter OTP');
    setLoading(true);
    try {
      const res = await api.post(`/auth/verify-otp/${userType}`, { email, otpCode: otp });
      if (res.status === 200) {
        await logIn(
          userType,
          res.data.data.accessToken,
          res.data.data.refreshToken,
          res.data.data.user._id
        );
      } else {
        Alert.alert('OTP Failed', res.data?.message || 'Invalid OTP.');
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong during OTP verification.');
      console.log(err);
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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {!showOtpForm ? (
          <>
            <Text style={styles.mainHeading}>Welcome Back 👋</Text>
            <Text style={styles.subText}>Login to your account</Text>

            {/* User Type Picker */}
            <Text style={styles.label}>Login As</Text>
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
              </Picker>
            </View>

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            {/* Password with visibility toggle */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Enter your password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={Colors.light.text}
                />
              </TouchableOpacity>
            </View>

            <Button title="Login" onPress={handleLogin} />
          </>
        ) : (
          <>
            <Text style={styles.mainHeading}>🔐 Verify OTP</Text>
            <Text style={styles.subText}>Check your email for the OTP code</Text>

            {/* Email (readonly) */}
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: '#eee', color: '#555' }]}
              value={email}
              editable={false}
            />

            {/* OTP Input */}
            <Text style={styles.label}>Enter OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit OTP"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />

            <Button title="Submit OTP" onPress={handleOtpSubmit} />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  mainHeading: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: Colors.light.textSecondary || '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 18,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 10,
    marginBottom: 20,
  },
  eyeIcon: {
    paddingHorizontal: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
