import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../../constants/theme';

export default function InternalMarksScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.mainHeading}>Internal Marks Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  mainHeading: {
    color: Colors.light.text,
  },
});
