import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from './src/context/AuthContext'
import HomeScreen from './src/screens/HomeScreen'
import LibraryScreen from './src/screens/LibraryScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import SearchScreen from './src/screens/SearchScreen'

const Tab = createBottomTabNavigator()

function tabIcon(routeName, focused) {
  const icons = {
    Home: focused ? 'home' : 'home-outline',
    Busca: focused ? 'search' : 'search-outline',
    Biblioteca: focused ? 'bookmark' : 'bookmark-outline',
    Perfil: focused ? 'person' : 'person-outline',
  }

  return icons[routeName] || 'ellipse-outline'
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Tab.Navigator
              screenOptions={({ route }) => ({
                headerStyle: { backgroundColor: '#080b12' },
                headerTintColor: '#f3f6fd',
                tabBarStyle: { backgroundColor: '#080b12', borderTopColor: '#1a2030' },
                tabBarActiveTintColor: '#7c9cff',
                tabBarInactiveTintColor: '#8a96b2',
                tabBarIcon: ({ focused, color, size }) => (
                  <Ionicons name={tabIcon(route.name, focused)} size={size} color={color} />
                ),
              })}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Busca" component={SearchScreen} />
              <Tab.Screen name="Biblioteca" component={LibraryScreen} />
              <Tab.Screen name="Perfil" component={ProfileScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
