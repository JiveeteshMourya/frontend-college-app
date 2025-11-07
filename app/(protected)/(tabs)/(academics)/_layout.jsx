import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const { Navigator } = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Navigator);

export default function TabLayout() {
  return (
    <TopTabs
      screenOptions={{
        tabBarActiveTintColor: 'teal',
        headerShown: false,
      }}
    >
      <TopTabs.Screen
        name="(internalMarks)"
        options={{
          title: 'Internal Marks',
          tabBarLabel: 'Internal Marks',
        }}
      />
      <TopTabs.Screen
        name="(tests)"
        options={{
          title: 'Tests',
          tabBarLabel: 'Tests',
        }}
      />
    </TopTabs>
  );
}
