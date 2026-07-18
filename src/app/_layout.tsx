import { Colors } from '@/constants/Colors';
import { ThemeProvider, useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, View } from 'react-native';

SplashScreen.preventAutoHideAsync();

function TabsLayout() {
    const { isDark } = useTheme();
    const c = isDark ? Colors.dark : Colors.light;

    return (
        <Tabs
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: Platform.OS === 'ios' ? 24 : 16,
                    left: 24,
                    right: 24,
                    borderRadius: 28,
                    height: 68,
                    backgroundColor: c.tab.bg,
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowColor: isDark ? '#4ADE80' : '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isDark ? 0.2 : 0.1,
                    shadowRadius: 20,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: c.tab.active,
                tabBarInactiveTintColor: c.tab.inactive,
                tabBarLabelStyle: {
                    fontFamily: 'Pretendard-Medium',
                    fontSize: 11,
                    marginTop: 2,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';
                    if (route.name === 'index') {
                        iconName = focused ? 'leaf' : 'leaf-outline';
                    } else if (route.name === 'notifications') {
                        iconName = focused ? 'notifications' : 'notifications-outline';
                    } else if (route.name === 'settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }
                    return (
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 32,
                            borderRadius: 16,
                            backgroundColor: focused
                                ? (isDark ? 'rgba(74,222,128,0.15)' : 'rgba(34,197,94,0.12)')
                                : 'transparent',
                        }}>
                            <Ionicons name={iconName} size={22} color={color} />
                        </View>
                    );
                },
            })}
        >
            <Tabs.Screen name="index" options={{ title: '모니터링' }} />
            <Tabs.Screen name="notifications" options={{ title: '알림' }} />
            <Tabs.Screen name="settings" options={{ title: '설정' }} />
        </Tabs>
    );
}

export default function RootLayout() {
    const [loaded, error] = useFonts({
        'Pretendard-Thin': require('../../assets/fonts/Pretendard/Thin.otf'),
        'Pretendard-ExtraLight': require('../../assets/fonts/Pretendard/ExtraLight.otf'),
        'Pretendard-Light': require('../../assets/fonts/Pretendard/Light.otf'),
        'Pretendard-Regular': require('../../assets/fonts/Pretendard/Regular.otf'),
        'Pretendard-Medium': require('../../assets/fonts/Pretendard/Medium.otf'),
        'Pretendard-SemiBold': require('../../assets/fonts/Pretendard/SemiBold.otf'),
        'Pretendard-Bold': require('../../assets/fonts/Pretendard/Bold.otf'),
        'Pretendard-ExtraBold': require('../../assets/fonts/Pretendard/ExtraBold.otf'),
        'Pretendard-Black': require('../../assets/fonts/Pretendard/Black.otf'),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <ThemeProvider>
            <TabsLayout />
        </ThemeProvider>
    );
}
