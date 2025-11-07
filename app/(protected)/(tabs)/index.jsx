import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../../constants/theme';
import ImageCarousel from '../../../components/ImageCarousel';
import NewsList from '../../../components/NewzList';
import { Ionicons } from '@expo/vector-icons';

const sampleImages = [
  'https://www.iehe.ac.in/NivoSlider/nivoImages/arybhattbhavan.jpg',
  'https://www.iehe.ac.in/NivoSlider/nivoImages/15aug25.jpg',
  'https://www.iehe.ac.in/NivoSlider/nivoImages/bhartiya_gyan_p_slider.jpg',
  'https://www.iehe.ac.in/NivoSlider/nivoImages/Tarang_2025_1.jpg',
  'https://www.iehe.ac.in/NivoSlider/nivoImages/pm_ncc_award.jpg',
];

const usefulLinks = [
  'Seminar/Webinar',
  'ePay Dashboard',
  'MoU',
  'Swayam NPTEL',
  'Alumni Association',
  'Admission',
  'Online Quiz Test',
  'Scholarship',
  'Tender',
  'Internship Program',
  'Vocational Courses Cell',
  'NEP Vocational',
  'NIRF',
  'Institutional Club',
];

export default function HomeScreen() {
  // renderSection renders each section as a static item in FlatList
  const sections = [
    { id: 'carousel', content: <ImageCarousel images={sampleImages} height={160} /> },
    { id: 'news', content: <AnnouncementsSection /> },
    { id: 'links', content: <UsefulLinks /> },
    { id: 'director', content: <DirectorNote /> },
    { id: 'motto', content: <MottoVision /> },
    { id: 'strength', content: <StudentStrength /> },
    { id: 'thought', content: <ThoughtOfDay /> },
  ];

  return (
    <FlatList
      data={sections}
      keyExtractor={item => item.id}
      renderItem={({ item }) => <View style={{ marginBottom: 20 }}>{item.content}</View>}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
}

/* ------------ INDIVIDUAL SECTIONS ------------- */

const Section = ({ title, children, center }) => (
  <View style={[styles.section, center && { alignItems: 'center' }]}>
    <Text style={[styles.sectionHeading, center && { textAlign: 'center' }]}>{title}</Text>
    {children}
  </View>
);

const AnnouncementsSection = () => (
  <Section title="📢 Latest Announcements" center>
    <View style={styles.announcementContainer}>
      <NewsList />
    </View>
  </Section>
);

const UsefulLinks = () => (
  <Section title="🔗 Useful Links">
    <View style={styles.linksGrid}>
      {usefulLinks.map((link, i) => (
        <TouchableOpacity key={i} style={styles.linkButton}>
          <Text style={styles.linkText}>{link}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </Section>
);

const DirectorNote = () => (
  <Section title="🏛️ Director’s Note">
    <View style={styles.directorContainer}>
      <Image
        source={{
          uri: 'https://www.iehe.ac.in/Img/Dir/dir_dr_PrageshAgrawal.jpeg',
        }}
        style={styles.directorImage}
      />
      <Text style={[styles.bodyText, { flex: 1 }]}>
        The Institute for Excellence in Higher Education has been envisaged as a unique
        establishment of learning in Madhya Pradesh. It reflects the State’s endeavor to establish
        national linkages and foster bilateral relationships with institutions nationwide to promote
        academic excellence.
      </Text>
    </View>
  </Section>
);

const MottoVision = () => (
  <Section title="🌟 Motto, Vision & Objective">
    <View style={styles.infoBox}>
      <Text style={styles.subHeading}>Motto</Text>
      <Text style={styles.bodyText}>
        “विद्यया विन्दते अमृतम्” — Learning bestows the nectar of life.
      </Text>
      <Text style={[styles.subHeading, { marginTop: 10 }]}>Vision</Text>
      <Text style={styles.bodyText}>
        To accelerate quality and excellence in Higher Education at the global level.
      </Text>
    </View>
  </Section>
);

const StudentStrength = () => (
  <Section title="👩‍🎓 Student Strength (July 2025)">
    {[
      { label: 'Total Students', value: 4488 },
      { label: 'Total UG', value: 3986 },
      { label: 'Total PG', value: 501 },
      { label: 'Total Boys', value: 1706 },
      { label: 'Total Girls', value: 2782 },
    ].map((item, i) => (
      <View key={i} style={styles.strengthRow}>
        <Text style={styles.strengthLabel}>{item.label}</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${(item.value / 4500) * 100}%` }]} />
        </View>
        <Text style={styles.strengthValue}>{item.value}</Text>
      </View>
    ))}
  </Section>
);

const ThoughtOfDay = () => (
  <View style={styles.thoughtBox}>
    <Ionicons name="globe-outline" size={20} color="purple" />
    <Text style={styles.thoughtText}>
      &ldquo;मनुष्य को उसके क्रोध की सजा नहीं मिलेगी, पर उसका क्रोध ही उसे सजा देगा।&rdquo; —
      महात्मा बुद्ध
    </Text>
  </View>
);

/* ------------ STYLES ------------- */
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
    paddingVertical: 10,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 10,
  },
  announcementContainer: {
    width: '95%',
    alignItems: 'center',
  },
  linksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  linkButton: {
    backgroundColor: '#0a3d91',
    paddingVertical: 10,
    borderRadius: 20,
    marginVertical: 5,
    width: '48%',
    alignItems: 'center',
  },
  linkText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  infoBox: {
    borderWidth: 1,
    borderColor: Colors.light.border || '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: Colors.light.card,
  },
  subHeading: {
    fontWeight: '700',
    fontSize: 15,
    color: Colors.light.text,
  },
  bodyText: {
    fontSize: 14,
    color: Colors.light.textSecondary || '#444',
    lineHeight: 20,
    marginTop: 4,
  },
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  strengthLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
  },
  progressBarContainer: {
    flex: 2,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'teal',
    borderRadius: 6,
  },
  strengthValue: {
    width: 50,
    textAlign: 'right',
    color: Colors.light.text,
    fontWeight: '600',
  },
  thoughtBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: Colors.light.border || '#ccc',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.card,
  },
  thoughtText: {
    marginLeft: 10,
    fontSize: 14,
    color: 'purple',
    fontStyle: 'italic',
    flexShrink: 1,
  },
  directorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.light.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.light.border || '#ccc',
    padding: 10,
  },
  directorImage: {
    width: 60, // reduced size for balance
    height: 60,
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.light.border || '#bbb',
  },
});
