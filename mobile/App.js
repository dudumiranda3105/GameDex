import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from './src/context/AuthContext'
import HomeScreen from './src/screens/HomeScreen'
import LibraryScreen from './src/screens/LibraryScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import SearchScreen from './src/screens/SearchScreen'
import GameDetailsScreen from './src/screens/GameDetailsScreen'
import { colors } from './src/theme'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

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
  function MainTabs() {
    const insets = useSafeAreaInsets()
    const bottomInset = Math.max(insets.bottom, 10)

    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: colors.bg },
          headerTintColor: colors.textMain,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          tabBarStyle: {
            backgroundColor: colors.bg,
            borderTopColor: colors.border,
            borderTopWidth: 1,
            height: 56 + bottomInset,
            paddingBottom: bottomInset,
            paddingTop: 6,
          },
          tabBarActiveTintColor: colors.primaryLight,
          tabBarInactiveTintColor: colors.textFaint,
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
    )
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="light" backgroundColor={colors.bg} />
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: colors.bg },
                headerTintColor: colors.textMain,
                headerTitleStyle: { fontWeight: '700' },
                headerShadowVisible: false,
                contentStyle: { backgroundColor: colors.bg },
              }}
            >
              <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
              <Stack.Screen name="GameDetails" component={GameDetailsScreen} options={{ title: 'Detalhes do jogo' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}
