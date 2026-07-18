import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ScrollView, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

type NotificationItem = {
    id: number;
    type: 'warning' | 'info' | 'error' | 'success';
    title: string;
    message: string;
    time: string;
};

const NOTIFICATIONS: NotificationItem[] = [
    { id: 1, type: 'warning', title: '습도 경고', message: 'Pico 1 구역의 습도가 30% 이하로 떨어졌습니다.', time: '방금 전' },
    { id: 2, type: 'success', title: '관수 완료', message: '자동 관수 시스템이 정상적으로 동작했습니다.', time: '23분 전' },
    { id: 3, type: 'info', title: '온도 정상화', message: '온도가 설정 범위(20~28°C)로 돌아왔습니다.', time: '1시간 전' },
    { id: 4, type: 'error', title: '센서 연결 오류', message: 'Pico 3의 토양 수분 센서 연결이 끊어졌습니다.', time: '3시간 전' },
    { id: 5, type: 'success', title: '일일 리포트', message: '오늘의 스마트팜 운영이 완료되었습니다.', time: '어제' },
    { id: 6, type: 'info', title: '시스템 업데이트', message: '펌웨어 v1.2.3 업데이트가 완료되었습니다.', time: '2일 전' },
];

function NotifCard({ item, wide, isDark }: { item: NotificationItem; wide: number; isDark: boolean }) {
    const c = isDark ? Colors.dark : Colors.light;
    const colorKey = item.type === 'warning' ? 'orange' : item.type === 'error' ? 'red' : item.type === 'success' ? 'green' : 'blue';
    const cc = c[colorKey as keyof typeof c] as { cover: string; text: string; outline: string; shadow: string };
    const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
        warning: 'warning-outline',
        error: 'close-circle-outline',
        success: 'checkmark-circle-outline',
        info: 'information-circle-outline',
    };

    const opacity = useSharedValue(0);
    useEffect(() => {
        opacity.value = withTiming(1, { duration: 250 });
    }, []);

    const animStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[animStyle, {
            flexDirection: 'row',
            alignItems: 'flex-start',
            backgroundColor: c.main.cover,
            borderRadius: wide * 4,
            padding: wide * 4,
            marginBottom: wide * 3,
            borderWidth: 1,
            borderColor: c.main.outline,
            shadowColor: isDark ? '#000' : '#000',
            shadowOffset: { width: 0, height: wide * 0.5 },
            shadowOpacity: 0.06,
            shadowRadius: wide * 2,
        }]}>
            <View style={{
                width: wide * 10,
                height: wide * 10,
                borderRadius: wide * 2.5,
                backgroundColor: cc.cover,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: wide * 3.5,
                flexShrink: 0,
            }}>
                <Ionicons name={icons[item.type]} size={wide * 5} color={cc.text} />
            </View>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: wide * 1 }}>
                    <Text style={{ fontFamily: 'Pretendard-SemiBold', fontSize: wide * 3.5, color: c.main.text }}>
                        {item.title}
                    </Text>
                    <Text style={{ fontFamily: 'Pretendard-Regular', fontSize: wide * 2.5, color: c.subText }}>
                        {item.time}
                    </Text>
                </View>
                <Text style={{ fontFamily: 'Pretendard-Regular', fontSize: wide * 3, color: c.subText, lineHeight: wide * 4.5 }}>
                    {item.message}
                </Text>
            </View>
        </Animated.View>
    );
}

export default function Notifications() {
    const { width, height } = useWindowDimensions();
    const wide = Math.min(width, height) * 0.01;
    const { isDark } = useTheme();
    const c = isDark ? Colors.dark : Colors.light;

    const titleOpacity = useSharedValue(0);
    useEffect(() => { titleOpacity.value = withTiming(1, { duration: 500 }); }, []);
    const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: c.background }}
            contentContainerStyle={{ paddingBottom: wide * 22, paddingTop: wide * 4 }}
            showsVerticalScrollIndicator={false}
        >
            <Animated.View style={[titleStyle, { paddingHorizontal: wide * 5, marginBottom: wide * 6 }]}>
                <Text style={{ fontFamily: 'Pretendard-ExtraLight', fontSize: wide * 3.5, color: c.subText }}>스마트팜</Text>
                <Text style={{ fontFamily: 'Pretendard-Bold', fontSize: wide * 7, color: c.main.text }}>알림</Text>
                <View style={{ width: wide * 8, height: wide * 0.8, borderRadius: wide, backgroundColor: c.accent, marginTop: wide * 1.5 }} />
            </Animated.View>

            <View style={{ paddingHorizontal: wide * 5 }}>
                {NOTIFICATIONS.map((item, i) => (
                    <NotifCard key={item.id} item={item} wide={wide} isDark={isDark} />
                ))}
            </View>
        </ScrollView>
    );
}
