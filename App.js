import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, createStaticNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Scan from './src/screens/Scan';
import Report from './src/screens/Report';
import Extract from './src/screens/Extract';
import styles from './src/styles/Global-Style';

const Tabs = createBottomTabNavigator({
  screens: {
    Home: Scan,
    Extract: Extract,
    Report: Report,

  },
});
const Navigation = createStaticNavigation(Tabs);
export default function App() {
  return (
    <Navigation />
  );
}
