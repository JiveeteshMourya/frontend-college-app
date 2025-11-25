import { Stack } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '@/utils/authContext';

export default function StackLayout() {
  const { userType } = useContext(AuthContext);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Internal Marks',
        }}
      />

      <Stack.Protected guard={userType === 2}>
        <Stack.Screen
          name="createAttendance"
          options={{
            title: 'Create Attendance',
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
