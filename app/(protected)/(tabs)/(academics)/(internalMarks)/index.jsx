import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Colors } from '../../../../../constants/theme';

export default function InternalMarksScreen() {
  // --- Maximum Marks Slab ---
  const maxMarks = [
    {
      id: 1,
      paper: 'Major',
      title: 'Operating System (Theory)',
      max: 40,
      test: 10,
      quiz: 8,
      attendance: 4,
    },
    {
      id: 2,
      paper: 'DSE',
      title: 'Computer Networks (Theory)',
      max: 40,
      test: 10,
      quiz: 8,
      attendance: 4,
    },
    {
      id: 3,
      paper: 'SEC/Vocational',
      title: 'PHP Programming (Theory)',
      max: 40,
      test: 10,
      quiz: 8,
      attendance: 4,
    },
    {
      id: 4,
      paper: 'Major',
      title: 'Operating System (Practical)',
      max: 40,
      test: 10,
      quiz: 8,
      attendance: 4,
    },
    {
      id: 5,
      paper: 'DSE',
      title: 'Computer Networks (Practical)',
      max: 40,
      test: 10,
      quiz: 8,
      attendance: 4,
    },
    {
      id: 6,
      paper: 'SEC/Vocational',
      title: 'PHP Programming (Practical)',
      max: 40,
      test: 10,
      quiz: 8,
      attendance: 4,
    },
  ];

  // --- Obtained Marks ---
  const obtainedMarks = [
    {
      id: 1,
      title: 'Operating System (Theory)',
      sec: 'A',
      t1: 7.5,
      t2: 8,
      t3: 6,
      best: 8,
      assg: 7,
      atn: 3,
      total: 18,
    },
    {
      id: 2,
      title: 'Computer Networks (Theory)',
      sec: 'A',
      t1: 6,
      t2: 7,
      t3: 6.5,
      best: 7,
      assg: 6,
      atn: 3,
      total: 16,
    },
    {
      id: 3,
      title: 'PHP Programming (Theory)',
      sec: 'A',
      t1: 8,
      t2: 7.5,
      t3: 8,
      best: 8,
      assg: 7,
      atn: 4,
      total: 19,
    },
    {
      id: 4,
      title: 'Operating System (Practical)',
      sec: 'A',
      t1: 9,
      t2: 8.5,
      t3: 9,
      best: 9,
      assg: 8,
      atn: 3,
      total: 20,
    },
    {
      id: 5,
      title: 'Computer Networks (Practical)',
      sec: 'A',
      t1: 8,
      t2: 7.5,
      t3: 8,
      best: 8,
      assg: 7,
      atn: 4,
      total: 19,
    },
    {
      id: 6,
      title: 'PHP Programming (Practical)',
      sec: 'A',
      t1: 9,
      t2: 9.5,
      t3: 8.5,
      best: 9.5,
      assg: 8,
      atn: 4,
      total: 21,
    },
  ];

  // --- Attendance Details ---
  const attendance = [
    {
      id: 1,
      title: 'Operating System (Theory)',
      sec: 'A',
      a1: 19,
      a2: 18,
      a3: 20,
      total: 57,
      out: 60,
      percent: 95,
      marks: 4,
    },
    {
      id: 2,
      title: 'Computer Networks (Theory)',
      sec: 'A',
      a1: 18,
      a2: 17,
      a3: 19,
      total: 54,
      out: 60,
      percent: 90,
      marks: 4,
    },
    {
      id: 3,
      title: 'PHP Programming (Theory)',
      sec: 'A',
      a1: 16,
      a2: 15,
      a3: 17,
      total: 48,
      out: 60,
      percent: 80,
      marks: 3,
    },
    {
      id: 4,
      title: 'Operating System (Practical)',
      sec: 'A',
      a1: 9,
      a2: 10,
      a3: 10,
      total: 29,
      out: 30,
      percent: 97,
      marks: 4,
    },
    {
      id: 5,
      title: 'Computer Networks (Practical)',
      sec: 'A',
      a1: 8,
      a2: 9,
      a3: 9,
      total: 26,
      out: 30,
      percent: 87,
      marks: 3,
    },
    {
      id: 6,
      title: 'PHP Programming (Practical)',
      sec: 'A',
      a1: 9,
      a2: 10,
      a3: 10,
      total: 29,
      out: 30,
      percent: 97,
      marks: 4,
    },
  ];

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.container}>
      {/* --- Maximum Marks Table --- */}
      <View style={styles.tableSection}>
        <Text style={styles.subHeading}>Maximum Marks Slab</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.headerCell, { width: 60 }]}>S.No</Text>
              <Text style={[styles.headerCell, { width: 110 }]}>Paper</Text>
              <Text style={[styles.headerCell, { width: 200 }]}>Paper Title</Text>
              <Text style={[styles.headerCell, { width: 80 }]}>Max</Text>
              <Text style={[styles.headerCell, { width: 80 }]}>Test</Text>
              <Text style={[styles.headerCell, { width: 80 }]}>Quiz</Text>
              <Text style={[styles.headerCell, { width: 100 }]}>Attendance</Text>
            </View>
            {maxMarks.map(item => (
              <View key={item.id} style={styles.row}>
                <Text style={[styles.cell, { width: 60 }]}>{item.id}</Text>
                <Text style={[styles.cell, { width: 110 }]}>{item.paper}</Text>
                <Text style={[styles.cell, { width: 200 }]}>{item.title}</Text>
                <Text style={[styles.cell, { width: 80 }]}>{item.max}</Text>
                <Text style={[styles.cell, { width: 80 }]}>{item.test}</Text>
                <Text style={[styles.cell, { width: 80 }]}>{item.quiz}</Text>
                <Text style={[styles.cell, { width: 100 }]}>{item.attendance}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* --- Obtained Marks Table --- */}
      <View style={styles.tableSection}>
        <Text style={styles.subHeading}>Obtained Marks Details</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.headerCell, { width: 60 }]}>S.No</Text>
              <Text style={[styles.headerCell, { width: 200 }]}>Paper Title</Text>
              <Text style={[styles.headerCell, { width: 60 }]}>Sec</Text>
              <Text style={[styles.headerCell, { width: 70 }]}>T1</Text>
              <Text style={[styles.headerCell, { width: 70 }]}>T2</Text>
              <Text style={[styles.headerCell, { width: 70 }]}>T3</Text>
              <Text style={[styles.headerCell, { width: 80 }]}>Best</Text>
              <Text style={[styles.headerCell, { width: 80 }]}>Assg</Text>
              <Text style={[styles.headerCell, { width: 80 }]}>Atn</Text>
              <Text style={[styles.headerCell, { width: 80 }]}>Total</Text>
            </View>
            {obtainedMarks.map(item => (
              <View key={item.id} style={styles.row}>
                <Text style={[styles.cell, { width: 60 }]}>{item.id}</Text>
                <Text style={[styles.cell, { width: 200 }]}>{item.title}</Text>
                <Text style={[styles.cell, { width: 60 }]}>{item.sec}</Text>
                <Text style={[styles.cell, { width: 70 }]}>{item.t1}</Text>
                <Text style={[styles.cell, { width: 70 }]}>{item.t2}</Text>
                <Text style={[styles.cell, { width: 70 }]}>{item.t3}</Text>
                <Text style={[styles.cell, { width: 80 }]}>{item.best}</Text>
                <Text style={[styles.cell, { width: 80 }]}>{item.assg}</Text>
                <Text style={[styles.cell, { width: 80 }]}>{item.atn}</Text>
                <Text style={[styles.cell, { width: 80 }]}>{item.total}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* --- Attendance Table --- */}
      <View style={styles.tableSection}>
        <Text style={styles.subHeading}>Attendance Details</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.headerCell, { width: 60 }]}>S.No</Text>
              <Text style={[styles.headerCell, { width: 200 }]}>Paper Title</Text>
              <Text style={[styles.headerCell, { width: 60 }]}>Sec</Text>
              <Text style={[styles.headerCell, { width: 70 }]}>Atn1</Text>
              <Text style={[styles.headerCell, { width: 70 }]}>Atn2</Text>
              <Text style={[styles.headerCell, { width: 70 }]}>Atn3</Text>
              <Text style={[styles.headerCell, { width: 80 }]}>Total</Text>
              <Text style={[styles.headerCell, { width: 80 }]}>Out of</Text>
              <Text style={[styles.headerCell, { width: 80 }]}>%</Text>
              <Text style={[styles.headerCell, { width: 80 }]}>Marks</Text>
            </View>
            {attendance.map(item => (
              <View key={item.id} style={styles.row}>
                <Text style={[styles.cell, { width: 60 }]}>{item.id}</Text>
                <Text style={[styles.cell, { width: 200 }]}>{item.title}</Text>
                <Text style={[styles.cell, { width: 60 }]}>{item.sec}</Text>
                <Text style={[styles.cell, { width: 70 }]}>{item.a1}</Text>
                <Text style={[styles.cell, { width: 70 }]}>{item.a2}</Text>
                <Text style={[styles.cell, { width: 70 }]}>{item.a3}</Text>
                <Text style={[styles.cell, { width: 80 }]}>{item.total}</Text>
                <Text style={[styles.cell, { width: 80 }]}>{item.out}</Text>
                <Text style={[styles.cell, { width: 80 }]}>{item.percent}</Text>
                <Text style={[styles.cell, { width: 80 }]}>{item.marks}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.light.background,
  },
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  tableSection: {
    marginBottom: 24,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.light.border || 'rgba(0,0,0,0.1)',
  },
  headerRow: {
    backgroundColor: Colors.light.card,
    borderTopWidth: 1,
    borderColor: Colors.light.border || 'rgba(0,0,0,0.1)',
  },
  cell: {
    fontSize: 13,
    color: Colors.light.text,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: 'center',
  },
  headerCell: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
    paddingVertical: 8,
    paddingHorizontal: 6,
    textAlign: 'center',
  },
});
