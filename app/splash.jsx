import { StyleSheet, Text, View, Animated, Easing } from 'react-native';
import { Image } from 'expo-image';
import { Colors, FontSizes, FontWeights } from '../constants/theme';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../utils/authContext';
import { useRouter } from 'expo-router';

export default function Splash() {
  const { checkServer, appReady } = useContext(AuthContext);
  const router = useRouter();

  const [status, setStatus] = useState('Initializing...');
  const [progress] = useState(new Animated.Value(0));

  useEffect(() => {
    const animateProgress = (toValue, duration = 700) => {
      Animated.timing(progress, {
        toValue,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    };

    const loadApp = async () => {
      setStatus('Checking internet...');
      animateProgress(0.2);
      await new Promise(res => setTimeout(res, 2000));

      const ok = await checkServer();
      if (!ok) {
        setStatus('Unable to reach server ❌');
        animateProgress(0.4);
        return;
      }
      setStatus('Server connected !!');
      animateProgress(0.6);

      await new Promise(res => setTimeout(res, 2000));
      setStatus('Finalizing setup...');
      animateProgress(0.9);

      // mimic local auth initialization delay
      await new Promise(res => setTimeout(res, 3000));

      animateProgress(1.0);

      // wait a bit for visual polish
      setTimeout(() => {
        if (appReady) router.replace('/');
      }, 500);
    };

    loadApp();
  }, [appReady, checkServer, router, progress]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.topPart}>
        <Text style={styles.mainHeading}>Institute For Excellence In Higher Education, Bhopal</Text>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('@/assets/images/iehe-logo.png')}
            placeholder={'Logo'}
            contentFit="cover"
            transition={1000}
          />
          <Image
            style={styles.image}
            source={require('@/assets/images/iehe-aplus.png')}
            placeholder={'Logo'}
            contentFit="cover"
            transition={1000}
          />
        </View>
      </View>
      <View style={styles.bottomPart}>
        <Text style={styles.subHeading}>
          Build and Maintained by The Department of Computer Science
        </Text>
        <View style={styles.progressSection}>
          <View style={styles.barContainer}>
            <Animated.View style={[styles.progressBar, { width }]} />
          </View>
          <Text style={styles.status}>{status}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
  },
  mainHeading: {
    fontSize: FontSizes.mainHeading,
    fontWeight: FontWeights.bold,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 50,
  },
  imageContainer: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    marginHorizontal: 40,
    borderRadius: 50,
  },
  subHeading: {
    fontSize: FontSizes.subHeading,
    fontWeight: FontWeights.bold,
    color: Colors.light.text,
    width: '90%',
    marginBottom: 40,
    textAlign: 'center',
  },
  barContainer: {
    width: '70%',
    height: 10,
    backgroundColor: Colors.light.textMuted,
    borderRadius: 20,
    overflow: 'hidden',
  },
  progressSection: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.light.progressBar,
  },
  status: {
    color: Colors.light.textMuted,
    marginTop: 20,
    fontSize: 15,
  },
  bottomPart: {
    alignItems: 'center',
    width: '100%',
  },
  topPart: {
    alignItems: 'center',
    width: '100%',
  },
});
