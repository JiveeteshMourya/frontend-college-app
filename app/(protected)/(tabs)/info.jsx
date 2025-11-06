import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '../../../constants/theme';
import { AuthContext } from '../../../utils/authContext';
import { backendUrl } from '../../../constants/constants';
import api from '../../../utils/axios.js';
import Button from '../../../components/Button';

export default function InfoScreen() {
  const { userType, userId, authToken, logOut } = useContext(AuthContext);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get(`${backendUrl}/auth/info/${userType}/${userId}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setInfo(res.data?.data?.user);
      } catch (err) {
        console.error('Failed to fetch info:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, [userType, userId, authToken]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  if (!info) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to load user info.</Text>
      </View>
    );
  }

  const renderDetails = () => {
    switch (userType) {
      case 0: // Student
        return (
          <>
            <Text style={styles.value}>Roll No: {info.rollNum}</Text>
            <Text style={styles.value}>Stream: {info.stream}</Text>
            <Text style={styles.value}>Major: {info.majorSub}</Text>
            <Text style={styles.value}>Minor: {info.minorSub}</Text>
            <Text style={styles.value}>Generic: {info.genericSub}</Text>
            <Text style={styles.value}>Vocational: {info.vocSub}</Text>
            <Text style={styles.value}>Education: {info.currentEducation}</Text>
            <Text style={styles.value}>Semester: {info.semester}</Text>
            <Text style={styles.value}>DOB: {new Date(info.dob).toDateString()}</Text>
            <Text style={styles.value}>Validity: {new Date(info.validity).toDateString()}</Text>
            <Text style={styles.value}>Address: {info.address}</Text>
          </>
        );

      case 1: // Parent
        return (
          <>
            <Text style={styles.value}>Occupation: {info.occupation}</Text>
            <Text style={styles.value}>Children Linked: {info.children?.length || 0}</Text>
            <Text style={styles.value}>Address: {info.address}</Text>
          </>
        );

      case 2: // Teacher
        return (
          <>
            <Text style={styles.value}>Employee ID: {info.empId}</Text>
            <Text style={styles.value}>Stream: {info.stream}</Text>
            <Text style={styles.value}>
              Subjects Handled: {info.subjectsHandled?.join(', ') || 'N/A'}
            </Text>
            <Text style={styles.value}>Address: {info.address}</Text>
          </>
        );

      default:
        return <Text style={styles.value}>Unknown user type</Text>;
    }
  };

  const handleLogout = async () => {
    await logOut();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileSection}>
          {info.imageId ? (
            <Image source={{ uri: `${backendUrl}/image/${info.imageId}` }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>
                {info.firstName?.charAt(0)}
                {info.lastName?.charAt(0) || ''}
              </Text>
            </View>
          )}
          <Text style={styles.mainHeading}>
            {info.firstName} {info.lastName || ''}
          </Text>
          <Text style={styles.subText}>{info.email}</Text>
          <Text style={styles.subText}>{info.contactNumber}</Text>
          <Text style={styles.subText}>Gender: {info.gender || 'N/A'}</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.divider} />
          {renderDetails()}
        </View>
      </ScrollView>

      <View style={styles.logoutWrapper}>
        <Button title="Logout" onPress={handleLogout} style={styles.logoutButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingBottom: 100,
  },
  mainHeading: {
    color: Colors.light.text,
    fontSize: 22,
    fontWeight: '600',
    marginTop: 10,
  },
  subText: {
    color: Colors.light.textSecondary || '#555',
    marginVertical: 2,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 20,
  },
  value: {
    color: Colors.light.text,
    fontSize: 16,
    marginVertical: 4,
  },
  divider: {
    height: 1,
    width: '80%',
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  logoutText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  infoCard: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.primary,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  placeholderText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#666',
  },
  logoutWrapper: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  logoutButton: {
    width: '60%',
    backgroundColor: 'red',
  },
});
