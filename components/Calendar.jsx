// file: components/AttendanceCalendar/calendar.jsx
// Reference layout image (local path available in project):
// const CALENDAR_LAYOUT_IMAGE = '/mnt/data/WhatsApp Image 2025-11-25 at 08.10.43.jpeg'

import React, { useEffect, useMemo, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSizes, FontWeights } from '@/constants/theme';
import api from '@/utils/axios';
import { AuthContext } from '@/utils/authContext';

const { width } = Dimensions.get('window');
const CELL_SIZE = Math.floor((width - 32) / 7); // responsive

/**
 * Props:
 * - studentId (required) -- id of the student
 * - month (1-12) (optional) -- initial month
 * - year (YYYY) (optional) -- initial year
 * - onMonthChange (month, year) (optional)
 * - showSummary (boolean) default true
 *
 * Behavior:
 * - Fetches /attendance/student/:id?month=&year=
 * - Renders full cell colored squares:
 *    0 -> blank (default background)
 *    1 -> green (present)
 *    2 -> red   (absent)
 * - No onPress on dates (display only)
 */

export default function AttendanceCalendar({
  studentId,
  month: initialMonth,
  year: initialYear,
  onMonthChange,
  showSummary = true,
}) {
  const { userType } = useContext(AuthContext); // in case we need auth headers or logic later
  // default to current month/year
  const now = new Date();
  const [month, setMonth] = useState(initialMonth ? Number(initialMonth) : now.getMonth() + 1);
  const [year, setYear] = useState(initialYear ? Number(initialYear) : now.getFullYear());

  const [loading, setLoading] = useState(true);
  const [attendanceMap, setAttendanceMap] = useState(new Map()); // key: 'YYYY-MM-DD' -> status
  const [error, setError] = useState(null);

  // summary counts
  const summary = useMemo(() => {
    let present = 0;
    let absent = 0;
    for (const v of attendanceMap.values()) {
      if (v === 1) present++;
      if (v === 2) absent++;
    }
    return { present, absent };
  }, [attendanceMap]);

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, month, year]);

  const fetchAttendance = async () => {
    if (!studentId) {
      setError('Missing student id');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/attendance/student/${studentId}?month=${month}&year=${year}`);
      // expected res.data.data.attendance => [{date, status}, ...] or res.data.data.attendance
      const data = (res.data && (res.data.data?.attendance || res.data.data)) || [];
      const map = new Map();
      data.forEach(item => {
        try {
          const d = new Date(item.date);
          // normalize to YYYY-MM-DD key
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
            d.getDate()
          ).padStart(2, '0')}`;
          map.set(key, Number(item.status));
        } catch (err) {
          // ignore invalid date
        }
      });
      setAttendanceMap(map);
    } catch (err) {
      console.log('AttendanceCalendar: fetch error', err);
      setError('Failed to fetch attendance');
    } finally {
      setLoading(false);
    }
  };

  // month navigation helpers
  const goPrevMonth = () => {
    let m = month - 1;
    let y = year;
    if (m < 1) {
      m = 12;
      y = year - 1;
    }
    setMonth(m);
    setYear(y);
    if (onMonthChange) onMonthChange(m, y);
  };

  const goNextMonth = () => {
    let m = month + 1;
    let y = year;
    if (m > 12) {
      m = 1;
      y = year + 1;
    }
    setMonth(m);
    setYear(y);
    if (onMonthChange) onMonthChange(m, y);
  };

  // build calendar matrix for month
  const buildCalendarMatrix = () => {
    const mIndex = month - 1;
    const firstDay = new Date(year, mIndex, 1);
    const startWeekday = firstDay.getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = new Date(year, mIndex + 1, 0).getDate();

    const matrix = [];
    let row = [];
    // fill blanks for first week
    for (let i = 0; i < startWeekday; i++) row.push(null);

    for (let d = 1; d <= daysInMonth; d++) {
      row.push(d);
      if (row.length === 7) {
        matrix.push(row);
        row = [];
      }
    }
    if (row.length > 0) {
      while (row.length < 7) row.push(null);
      matrix.push(row);
    }
    return matrix; // array of weeks, each week is 7 items (number or null)
  };

  const calendarMatrix = useMemo(buildCalendarMatrix, [month, year]);

  const renderCell = day => {
    if (!day) {
      return <View style={[styles.cell, styles.emptyCell]} />;
    }
    const key = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const status = attendanceMap.get(key) || 0;

    const cellStyle = [
      styles.cell,
      status === 1 ? styles.presentCell : status === 2 ? styles.absentCell : styles.noneCell,
    ];

    return (
      <View style={cellStyle}>
        <Text
          style={[styles.dateText, status === 0 ? styles.dateTextDefault : styles.dateTextOnColor]}
        >
          {day}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
        <Text style={{ color: Colors.light.text, marginTop: 10 }}>Loading Attendance...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with month & arrows */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.arrowBtn} onPress={goPrevMonth}>
          <Ionicons name="chevron-back" size={20} color={Colors.light.text} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {new Date(year, month - 1).toLocaleString('default', { month: 'long' })} {year}
        </Text>

        <TouchableOpacity style={styles.arrowBtn} onPress={goNextMonth}>
          <Ionicons name="chevron-forward" size={20} color={Colors.light.text} />
        </TouchableOpacity>
      </View>

      {/* Weekday labels */}
      <View style={styles.weekRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(w => (
          <View key={w} style={[styles.cell, styles.weekdayCell]}>
            <Text style={styles.weekdayText}>{w}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={styles.grid}>
        {calendarMatrix.map((week, i) => (
          <View key={`week-${i}`} style={styles.weekRow}>
            {week.map((day, idx) => (
              <View key={`d-${i}-${idx}`} style={styles.cellWrapper}>
                {renderCell(day)}
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Summary */}
      {showSummary && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <View style={[styles.summaryDot, styles.presentDot]} />
            <Text style={styles.summaryText}>Present</Text>
            <Text style={styles.summaryCount}>{summary.present}</Text>
          </View>

          <View style={styles.summaryItem}>
            <View style={[styles.summaryDot, styles.absentDot]} />
            <Text style={styles.summaryText}>Absent</Text>
            <Text style={styles.summaryCount}>{summary.absent}</Text>
          </View>
        </View>
      )}

      {/* {error && (
        <View style={styles.errorBox}>
          <Text style={{ color: 'white' }}>{error}</Text>
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: Colors.light.card,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.light.border || 'rgba(0,0,0,0.06)',
  },
  center: { justifyContent: 'center', alignItems: 'center', height: 220 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 6,
  },
  arrowBtn: {
    padding: 6,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: FontWeights.bold,
    color: Colors.light.text,
  },

  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  weekdayCell: {
    backgroundColor: 'transparent',
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 12,
    color: Colors.light.text,
    fontWeight: FontWeights.medium,
  },

  grid: {
    // nothing fancy — each week rendered as row
  },

  cellWrapper: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    padding: 2,
  },

  cell: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  emptyCell: {
    backgroundColor: 'transparent',
    borderWidth: 0,
  },

  // full-cell styles for statuses (Option A)
  presentCell: {
    backgroundColor: '#2fbf8f', // green-ish
  },
  absentCell: {
    backgroundColor: '#e25b5b', // red-ish
  },
  noneCell: {
    backgroundColor: 'transparent',
  },

  dateText: {
    fontSize: 13,
    fontWeight: FontWeights.bold,
  },
  dateTextDefault: {
    color: Colors.light.text,
  },
  dateTextOnColor: {
    color: '#fff', // white text for colored cells
  },

  summaryContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 20,
  },

  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  summaryDot: {
    width: 14,
    height: 14,
    borderRadius: 8,
    marginRight: 8,
  },
  presentDot: { backgroundColor: '#2fbf8f' },
  absentDot: { backgroundColor: '#e25b5b' },

  summaryText: {
    color: Colors.light.text,
    marginRight: 6,
    fontSize: 13,
  },
  summaryCount: {
    color: Colors.light.text,
    fontWeight: FontWeights.bold,
    fontSize: 13,
  },

  errorBox: {
    marginTop: 10,
    backgroundColor: '#d9534f',
    padding: 8,
    borderRadius: 8,
  },
});
