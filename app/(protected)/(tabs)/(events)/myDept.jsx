import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function MyDepartmentScreen() {
  const deptEvents = [
    { id: 1, title: 'Tech Fest Prize Distribution', date: 'Nov 22, 2025', location: 'CS Lab 1' },
    {
      id: 2,
      title: 'Student Interaction Session',
      date: 'Nov 28, 2025',
      location: 'Seminar Hall - CS Dept',
    },
    {
      id: 3,
      title: 'Seminar on Artificial Intelligence',
      date: 'Dec 5, 2025',
      location: 'CS Lecture Hall',
    },
    {
      id: 4,
      title: 'Seminar on App Development',
      date: 'Dec 15, 2025',
      location: 'Innovation Lab',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.mainHeading}>💻 My Department Events</Text>

      {deptEvents.map(event => (
        <View key={event.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.headerRow}>
              <Ionicons name="briefcase-outline" size={22} color="teal" />
              <Text style={styles.eventTitle}>{event.title}</Text>
            </View>
            <TouchableOpacity style={styles.bellButton} onPress={() => {}}>
              <Ionicons name="notifications-outline" size={22} color="#777" />
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={18} color="#777" />
            <Text style={styles.eventDetail}>{event.date}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={18} color="#777" />
            <Text style={styles.eventDetail}>{event.location}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: Colors.light.background,
  },
  mainHeading: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.light.card,
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Colors.light.border || 'rgba(0,0,0,0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    paddingRight: 12,
  },
  bellButton: {
    padding: 4,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.light.text,
    marginLeft: 8,
    flexShrink: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  eventDetail: {
    fontSize: 14,
    color: Colors.light.textSecondary || '#555',
    marginLeft: 6,
  },
});
