import { ThemeProvider } from "@/hooks/useTheme";
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// 스플래시 화면이 자동으로 숨겨지는 것을 방지합니다.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        'Pretendard-Regular': require('../../assets/fonts/Pretendard-Regular.otf'),
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
            <Stack screenOptions={{ headerShown: false }} />
        </ThemeProvider>
    );
}


