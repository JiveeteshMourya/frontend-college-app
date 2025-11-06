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
        name="index"
        options={{
          title: 'All',
          tabBarLabel: 'All',
        }}
      />
      <TopTabs.Screen
        name="myDept"
        options={{
          title: 'My Department',
          tabBarLabel: 'My Department',
        }}
      />
    </TopTabs>
  );
}
