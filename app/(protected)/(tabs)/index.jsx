import { StyleSheet, View, Text } from 'react-native';
import { Colors } from '../../../constants/theme';
import ImageCarousel from '../../../components/ImageCarousel';
import NewsList from '../../../components/NewzList';

const sampleImages = [
  'https://www.iehe.ac.in/NivoSlider/nivoImages/arybhattbhavan.jpg',
  'https://www.iehe.ac.in/NivoSlider/nivoImages/15aug25.jpg',
  'https://www.iehe.ac.in/NivoSlider/nivoImages/bhartiya_gyan_p_slider.jpg',
  'https://www.iehe.ac.in/NivoSlider/nivoImages/Tarang_2025_1.jpg',
  'https://www.iehe.ac.in/NivoSlider/nivoImages/pm_ncc_award.jpg',
];

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1, paddingTop: 10 }}>
        <ImageCarousel images={sampleImages} />
      </View>
      <View style={{ flex: 1, paddingTop: 10 }}>
        <NewsList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection: 'column',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
});
