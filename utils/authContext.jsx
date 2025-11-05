import * as SecureStore from 'expo-secure-store';
import { SplashScreen, useRouter } from 'expo-router';
import { createContext, useEffect, useState, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { authStorageKey, backendUrl } from '../constants/constants.js';

// keep splash from auto-hiding until we're ready
SplashScreen.preventAutoHideAsync();

export const AuthContext = createContext({
  isLoggedIn: false,
  userType: 0,
  authToken: null,
  isReady: false, // restored auth state
  appReady: false, // network + server up
  logIn: async () => {},
  logOut: async () => {},
  checkServer: async () => {}, // optional: force a re-check
  setAppReady: () => {},
});

export function AuthProvider({ children }) {
  const [isReady, setIsReady] = useState(false); // restored auth from secure store
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(0);
  const [authToken, setAuthToken] = useState(null);

  // this is true when device has internet AND the backend /health responds 200
  const [upAndConnected, setUpAndConnected] = useState(false);

  const router = useRouter();

  const storeAuthState = async newState => {
    try {
      const jsonValue = JSON.stringify(newState);
      await SecureStore.setItemAsync(authStorageKey, jsonValue);
    } catch (error) {
      console.log('Error saving to SecureStore', error);
    }
  };

  const logIn = async (userType, accessToken, refreshToken) => {
    setIsLoggedIn(true);
    setUserType(userType);
    setAuthToken(accessToken);

    await storeAuthState({
      isLoggedIn: true,
      userType,
      authToken: accessToken,
      refreshToken,
    });

    router.replace('/');
  };

  const logOut = async () => {
    setIsLoggedIn(false);
    setUserType(0);
    setAuthToken(null);

    await storeAuthState({
      isLoggedIn: false,
      userType: 0,
      authToken: null,
      refreshToken: null,
    });

    // Delete tokens from SecureStore
    await SecureStore.deleteItemAsync(authStorageKey);

    router.replace('/login');
  };

  // check network + backend health. callable from Splash screen if you prefer.
  const checkServer = useCallback(async () => {
    try {
      // 1) quick internet check
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        setUpAndConnected(false);
        return false;
      }

      // 2) backend health check
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000); // 7s timeout

      const res = await fetch(`${backendUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res && res.status === 200) {
        setUpAndConnected(true);
        return true;
      } else {
        setUpAndConnected(false);
        return false;
      }
    } catch (err) {
      console.log('checkServer error:', err?.message || err);
      setUpAndConnected(false);
      return false;
    }
  }, []);

  // restore auth from secure store on mount
  useEffect(() => {
    const getAuthFromSecureStore = async () => {
      try {
        // optional small delay so splash shows a bit
        await new Promise(res => setTimeout(res, 600));

        const value = await SecureStore.getItemAsync(authStorageKey);
        if (value) {
          const auth = JSON.parse(value);
          setIsLoggedIn(!!auth.isLoggedIn);
          setUserType(auth.userType || 0);
          setAuthToken(auth.authToken || null);

          if (auth.isLoggedIn) {
            // If you want auto-redirect after restore:
            router.replace('/');
          }
        }
      } catch (error) {
        console.log('Error fetching from SecureStore', error);
      } finally {
        setIsReady(true);
      }
    };

    getAuthFromSecureStore();
  }, [router]);

  // run server check on mount (you can also call checkServer from splash UI to show progress)
  useEffect(() => {
    (async () => {
      await checkServer();
    })();
  }, [checkServer]);

  // Hide splash only when BOTH auth restore (isReady) and server+network check (upAndConnected) are true.
  // This ensures the app shows the splash until everything required is ready.
  useEffect(() => {
    const tryHide = async () => {
      if (isReady && upAndConnected) {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.log('Error hiding splash:', e);
        }
      }
    };
    tryHide();
  }, [isReady, upAndConnected]);

  // computed appReady exposed to consumers
  const appReady = !!(isReady && upAndConnected);

  return (
    <AuthContext.Provider
      value={{
        isReady,
        isLoggedIn,
        userType,
        authToken,
        logIn,
        logOut,
        appReady,
        checkServer,
        setAppReady: setUpAndConnected, // allowed if you want to set from UI, but prefer checkServer()
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
