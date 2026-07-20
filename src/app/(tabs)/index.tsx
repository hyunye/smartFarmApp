import { ServerPanel } from '@/components/serverPanel';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

function StatCard({
    icon, label, value, unit, colorKey, wide, isDark
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    unit: string;
    colorKey: 'green' | 'blue' | 'orange' | 'red';
    wide: number;
    isDark: boolean;
}) {
    const c = isDark ? Colors.dark : Colors.light;
    const cc = c[colorKey];

    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = withTiming(1, { duration: 250 });
    }, []);

    const animStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[animStyle, {
            width: wide * 42,
            borderRadius: wide * 4,
            backgroundColor: cc.cover,
            borderWidth: 1,
            borderColor: cc.outline,
            padding: wide * 4,
            shadowColor: cc.shadow,
            shadowOffset: { width: 0, height: wide * 1 },
            shadowOpacity: 1,
            shadowRadius: wide * 3,
            elevation: 6,
            marginBottom: wide * 4,
        }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: wide * 2 }}>
                <View style={{
                    width: wide * 8,
                    height: wide * 8,
                    borderRadius: wide * 2,
                    backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.6)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: wide * 2,
                }}>
                    <Ionicons name={icon} size={wide * 4.5} color={cc.text} />
                </View>
                <Text style={{ fontFamily: 'Pretendard-Medium', fontSize: wide * 3, color: cc.text }}>
                    {label}
                </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: 'Pretendard-Bold', fontSize: wide * 8, color: cc.text, lineHeight: wide * 9 }}>
                    {value}
                </Text>
                <Text style={{ fontFamily: 'Pretendard-Medium', fontSize: wide * 3.5, color: cc.text, marginBottom: wide * 1, marginLeft: wide * 1 }}>
                    {unit}
                </Text>
            </View>
        </Animated.View>
    );
}

export default function Index() {
    const { width, height } = useWindowDimensions();
    const wide = Math.min(width, height) * 0.01;
    const { isDark } = useTheme();
    const c = isDark ? Colors.dark : Colors.light;

    const titleOpacity = useSharedValue(0);

    useEffect(() => {
        titleOpacity.value = withTiming(1, { duration: 300 });
    }, []);

    const titleStyle = useAnimatedStyle(() => ({
        opacity: titleOpacity.value,
    }));

    const stats = [
        { icon: 'thermometer' as const, label: '온도', value: '24', unit: '°C', colorKey: 'orange' as const },
        { icon: 'water' as const, label: '습도', value: '62', unit: '%', colorKey: 'blue' as const },
        { icon: 'leaf' as const, label: '토양 수분', value: '38', unit: '%', colorKey: 'green' as const },
        { icon: 'sunny' as const, label: '조도', value: '780', unit: 'lux', colorKey: 'orange' as const },
    ];

    return (
        <ScrollView
            style={[styles.scroll, { backgroundColor: c.background }]}
            contentContainerStyle={{ paddingBottom: wide * 22, paddingTop: wide * 4 }}
            showsVerticalScrollIndicator={false}
        >
            {/* Header */}
            <Animated.View style={[titleStyle, { paddingHorizontal: wide * 5, marginBottom: wide * 6 }]}>
                <Text style={{ fontFamily: 'Pretendard-ExtraLight', fontSize: wide * 3.5, color: c.subText }}>
                    스마트팜
                </Text>
                <Text style={{ fontFamily: 'Pretendard-Bold', fontSize: wide * 7, color: c.main.text }}>
                    대시보드
                </Text>
                <View style={{ width: wide * 8, height: wide * 0.8, borderRadius: wide, backgroundColor: c.accent, marginTop: wide * 1.5 }} />
            </Animated.View>

            {/* Stat cards */}
            <View style={{ paddingHorizontal: wide * 5, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {stats.map((s) => (
                    <StatCard key={s.label} {...s} wide={wide} isDark={isDark} />
                ))}
            </View>

            {/* Server Panel */}
            <View style={{ alignItems: 'center', marginTop: wide * 2 }}>
                <ServerPanel server={{ name: 'Server 1' }} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
});
