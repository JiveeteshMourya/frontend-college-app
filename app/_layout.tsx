import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthContext, AuthProvider } from '../utils/authContext';
import { useContext } from 'react';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { isLoggedIn, appReady } = useContext(AuthContext);

  return (
    <AuthProvider>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Protected guard={!appReady}>
          <Stack.Screen name="splash" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </AuthProvider>
  );
}
