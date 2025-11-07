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
          title: 'Test',
        }}
      />
      <Stack.Screen
        name="testDetails"
        options={{
          title: 'Test Details',
        }}
      />
      <Stack.Protected guard={userType === 2}>
        <Stack.Screen
          name="createTest"
          options={{
            title: 'Create Test',
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}
