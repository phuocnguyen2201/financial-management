import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import Scan from './src/screens/Scan';
import Report from './src/screens/Report';
import Extract from './src/screens/Extract';


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
       <Tab.Navigator screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Extract') {
            iconName = focused ? 'file-tray' : 'file-tray-full-outline';
          } else if (route.name === 'Report') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}>
        <Tab.Screen name="Home" component={Scan} />
        <Tab.Screen name="Extract" component={Extract} />
        <Tab.Screen name="Report" component={Report} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
