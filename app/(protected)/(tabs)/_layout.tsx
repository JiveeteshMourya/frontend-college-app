import { Redirect, Tabs } from 'expo-router';
import React, { useContext } from 'react';
import { AuthContext } from '@/utils/authContext';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function TabLayout() {
  // const colorScheme = useColorScheme();
  const { isLoggedIn } = useContext(AuthContext);
  if (!isLoggedIn) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'teal',
        headerTitle: 'IEHE, Bhopal',
        headerShown: true,
        headerStyle: { backgroundColor: 'teal' },
        headerTitleStyle: { fontWeight: '800' },
        // tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(events)"
        options={{
          title: 'Events',
          tabBarLabel: 'Events',
          tabBarIcon: ({ color }) => <FontAwesome5 name="artstation" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(academics)"
        options={{
          title: 'Academics',
          tabBarLabel: 'Academics',
          tabBarIcon: ({ color }) => <FontAwesome5 name="book-open" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="info"
        options={{
          title: 'Info',
          tabBarLabel: 'Info',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-alt" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
