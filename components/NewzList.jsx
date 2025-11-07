import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const newsData = [
  { id: '1', title: 'Notice for Post Metric Scholarship', isNew: true },
  { id: '2', title: 'PG Exam Final Time Table Nov-Dec-2025', isNew: true },
  { id: '3', title: 'UG Exam Final Time Table Nov-Dec-2025', isNew: true },
  { id: '4', title: 'EX Student Exam Time Table Nov-Dec-2025', isNew: true },
  {
    id: '5',
    title:
      'Reasoning & Logic Test Ans.key (October-2025) Paper-I B.A./B.Com./B.Sc./BBA/BPES/B.Sc.(Agriculture)/B.Com (ROM)',
    isNew: true,
  },
  {
    id: '6',
    title:
      'कृषि पाठ्यक्रम हेतु कृषकों से समझौता ज्ञापन (MoU) करने संबंधी Expression of Interest आमंत्रित करने बाबत ।',
    isNew: true,
  },
  { id: '7', title: 'UG Exam Form Fill-up Notice Nov-Dec-2025', isNew: true },
  { id: '8', title: 'PG Exam Form Fill-up Notice Nov-Dec-2025', isNew: true },
  { id: '9', title: 'EX Student Exam Form Fill-up Notice Nov-Dec-2025', isNew: true },
  { id: '10', title: 'Notice for Scholarship for SC/ST/OBC students', isNew: true },
];

const NewsList = () => {
  const [activeTab, setActiveTab] = useState('all');

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      <View style={styles.iconWrapper}>
        {item.isNew && <Ionicons name="alert-circle" size={20} color="#f97316" />}
      </View>
      <Text numberOfLines={2} style={styles.itemText}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeText]}>All News</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'previous' && styles.activeTab]}
          onPress={() => setActiveTab('previous')}
        >
          <Text style={[styles.tabText, activeTab === 'previous' && styles.activeText]}>
            Previous Year News
          </Text>
        </TouchableOpacity>
      </View>

      {/* News List */}
      <FlatList
        data={newsData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default NewsList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 10,
    overflow: 'hidden',
    elevation: 2,
    height: '80%',
    width: '100%',
    flex: 1,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#e0e7ff',
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#facc15',
  },
  tabText: {
    color: '#1e3a8a',
    fontWeight: '600',
  },
  activeText: {
    color: '#000',
  },
  listContent: {
    paddingVertical: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  iconWrapper: {
    marginRight: 8,
  },
  itemText: {
    flex: 1,
    color: '#111827',
  },
});
