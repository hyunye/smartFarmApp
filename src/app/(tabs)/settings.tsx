import { Colors } from '@/constants/Colors';
import { ServerConfig, useServerAddress } from '@/hooks/useServerAddress';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TextInput, useWindowDimensions, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

// ─── Setting Selector Row ─────────────────────────────────────────────────────

function SettingRow({
    icon, label, sub, value, onToggle, wide, isDark
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    sub?: string;
    value: boolean;
    onToggle: () => void;
    wide: number;
    isDark: boolean;
}) {
    const c = isDark ? Colors.dark : Colors.light;
    const opacity = useSharedValue(0);
    useEffect(() => {
        opacity.value = withTiming(1, { duration: 250 });
    }, []);
    const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <Animated.View style={[animStyle, {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: c.main.cover,
            borderRadius: wide * 4,
            padding: wide * 4,
            marginBottom: wide * 3,
            borderWidth: 1,
            borderColor: c.main.outline,
        }]}>
            <View style={{
                width: wide * 10,
                height: wide * 10,
                borderRadius: wide * 2.5,
                backgroundColor: isDark ? 'rgba(74,222,128,0.1)' : 'rgba(34,197,94,0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: wide * 3.5,
            }}>
                <Ionicons name={icon} size={wide * 5} color={c.accent} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Pretendard-SemiBold', fontSize: wide * 3.5, color: c.main.text }}>{label}</Text>
                {sub && <Text style={{ fontFamily: 'Pretendard-Regular', fontSize: wide * 2.8, color: c.subText, marginTop: wide * 0.5 }}>{sub}</Text>}
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: isDark ? '#1E293B' : '#E2E8F0', true: c.accent }}
                thumbColor={'#FFFFFF'}
            />
        </Animated.View>
    );
}

function InfoRow({ label, value, wide, c }: { label: string; value: string; wide: number; c: typeof Colors.dark }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: wide * 3, borderBottomWidth: 1, borderBottomColor: c.main.outline }}>
            <Text style={{ fontFamily: 'Pretendard-Regular', fontSize: wide * 3.2, color: c.subText }}>{label}</Text>
            <Text style={{ fontFamily: 'Pretendard-Medium', fontSize: wide * 3.2, color: c.main.text }}>{value}</Text>
        </View>
    );
}

// ─── Individual Server Configuration Form ──────────────────────────────────────

function ServerConfigFormItem({
    server,
    onSave,
    wide,
    c
}: {
    server: ServerConfig;
    onSave: (id: string, name: string, description: string, address: string) => void;
    wide: number;
    c: typeof Colors.dark;
}) {
    const [name, setName] = useState(server.name);
    const [desc, setDesc] = useState(server.description);
    const [addr, setAddr] = useState(server.address);

    useEffect(() => {
        setName(server.name);
        setDesc(server.description);
        setAddr(server.address);
    }, [server]);

    const handleSave = () => {
        onSave(server.id, name.trim(), desc.trim(), addr.trim());
    };

    return (
        <View style={{
            paddingVertical: wide * 4,
            borderBottomWidth: 1,
            borderBottomColor: c.main.outline,
            gap: wide * 2.5
        }}>
            <Text style={{ fontFamily: 'Pretendard-Bold', fontSize: wide * 3.5, color: c.accent }}>
                {server.id} 정보 설정
            </Text>

            {/* Server Name Input */}
            <View style={styles.inputRow}>
                <Text style={[styles.inputLabel, { color: c.subText, fontSize: wide * 3.2 }]}>서버 이름</Text>
                <TextInput
                    style={[styles.textInput, { color: c.main.text, borderColor: c.main.outline, fontSize: wide * 3.2 }]}
                    value={name}
                    onChangeText={setName}
                    onBlur={handleSave}
                    onSubmitEditing={handleSave}
                    placeholder="이름 입력"
                    placeholderTextColor={c.subText}
                />
            </View>

            {/* Description/Location Input */}
            <View style={styles.inputRow}>
                <Text style={[styles.inputLabel, { color: c.subText, fontSize: wide * 3.2 }]}>설명/위치</Text>
                <TextInput
                    style={[styles.textInput, { color: c.main.text, borderColor: c.main.outline, fontSize: wide * 3.2 }]}
                    value={desc}
                    onChangeText={setDesc}
                    onBlur={handleSave}
                    onSubmitEditing={handleSave}
                    placeholder="설명 입력"
                    placeholderTextColor={c.subText}
                />
            </View>

            {/* IP/Address Input */}
            <View style={styles.inputRow}>
                <Text style={[styles.inputLabel, { color: c.subText, fontSize: wide * 3.2 }]}>IP 주소/링크</Text>
                <TextInput
                    style={[styles.textInput, { color: c.main.text, borderColor: c.main.outline, fontSize: wide * 3.2 }]}
                    value={addr}
                    onChangeText={setAddr}
                    onBlur={handleSave}
                    onSubmitEditing={handleSave}
                    placeholder="http://192.168.0.10"
                    placeholderTextColor={c.subText}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                />
            </View>
        </View>
    );
}

// ─── Main Settings View ───────────────────────────────────────────────────────

export default function Settings() {
    const { width, height } = useWindowDimensions();
    const wide = Math.min(width, height) * 0.01;
    const { isDark, toggleTheme } = useTheme();
    const c = isDark ? Colors.dark : Colors.light;

    const { servers, updateServerConfig } = useServerAddress();

    const [notifications, setNotifications] = useState(true);
    const [autoWater, setAutoWater] = useState(true);
    const [autoLight, setAutoLight] = useState(false);

    const titleOpacity = useSharedValue(0);
    useEffect(() => { titleOpacity.value = withTiming(1, { duration: 500 }); }, []);
    const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));

    const handleServerSave = (id: string, name: string, description: string, address: string) => {
        const cleanedAddress = address.replace(/\/$/, ''); // Remove trailing slash
        updateServerConfig(id, name, description, cleanedAddress);
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: c.background }}
            contentContainerStyle={{ paddingBottom: wide * 22, paddingTop: wide * 4 }}
            showsVerticalScrollIndicator={false}
        >
            <Animated.View style={[titleStyle, { paddingHorizontal: wide * 5, marginBottom: wide * 6 }]}>
                <Text style={{ fontFamily: 'Pretendard-ExtraLight', fontSize: wide * 3.5, color: c.subText }}>스마트팜</Text>
                <Text style={{ fontFamily: 'Pretendard-Bold', fontSize: wide * 7, color: c.main.text }}>설정</Text>
                <View style={{ width: wide * 8, height: wide * 0.8, borderRadius: wide, backgroundColor: c.accent, marginTop: wide * 1.5 }} />
            </Animated.View>

            <View style={{ paddingHorizontal: wide * 5 }}>
                {/* Appearance */}
                <Text style={{ fontFamily: 'Pretendard-SemiBold', fontSize: wide * 3.5, color: c.subText, marginBottom: wide * 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                    화면
                </Text>
                <SettingRow
                    icon="moon-outline"
                    label="다크 모드"
                    sub="눈의 피로를 줄여줍니다"
                    value={isDark}
                    onToggle={toggleTheme}
                    wide={wide}
                    isDark={isDark}
                />

                {/* Automation */}
                <Text style={{ fontFamily: 'Pretendard-SemiBold', fontSize: wide * 3.5, color: c.subText, marginBottom: wide * 3, marginTop: wide * 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                    자동화
                </Text>
                <SettingRow
                    icon="water-outline"
                    label="자동 관수"
                    sub="토양 수분 30% 이하 시 자동 관수"
                    value={autoWater}
                    onToggle={() => setAutoWater(v => !v)}
                    wide={wide}
                    isDark={isDark}
                />
                <SettingRow
                    icon="sunny-outline"
                    label="자동 조명"
                    sub="일조량에 따라 보조 조명 제어"
                    value={autoLight}
                    onToggle={() => setAutoLight(v => !v)}
                    wide={wide}
                    isDark={isDark}
                />

                {/* Notifications */}
                <Text style={{ fontFamily: 'Pretendard-SemiBold', fontSize: wide * 3.5, color: c.subText, marginBottom: wide * 3, marginTop: wide * 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                    알림
                </Text>
                <SettingRow
                    icon="notifications-outline"
                    label="푸시 알림"
                    sub="이상 상황 발생 시 알림 전송"
                    value={notifications}
                    onToggle={() => setNotifications(v => !v)}
                    wide={wide}
                    isDark={isDark}
                />

                {/* Server configurations */}
                <Text style={{ fontFamily: 'Pretendard-SemiBold', fontSize: wide * 3.5, color: c.subText, marginBottom: wide * 3, marginTop: wide * 2, textTransform: 'uppercase', letterSpacing: 1 }}>
                    서버 연결 관리
                </Text>
                <View style={{
                    backgroundColor: c.main.cover,
                    borderRadius: wide * 4,
                    paddingHorizontal: wide * 4,
                    paddingBottom: wide * 2,
                    borderWidth: 1,
                    borderColor: c.main.outline,
                    marginBottom: wide * 6
                }}>
                    {servers.map((srv) => (
                        <ServerConfigFormItem
                            key={srv.id}
                            server={srv}
                            onSave={handleServerSave}
                            wide={wide}
                            c={c}
                        />
                    ))}
                </View>

                {/* About info */}
                <Text style={{ fontFamily: 'Pretendard-SemiBold', fontSize: wide * 3.5, color: c.subText, marginBottom: wide * 3, textTransform: 'uppercase', letterSpacing: 1 }}>
                    앱 정보
                </Text>
                <View style={{ backgroundColor: c.main.cover, borderRadius: wide * 4, padding: wide * 4, borderWidth: 1, borderColor: c.main.outline }}>
                    <InfoRow label="앱 버전" value="1.0.0" wide={wide} c={isDark ? Colors.dark : Colors.light} />
                    <InfoRow label="MQTT 포트" value="1883" wide={wide} c={isDark ? Colors.dark : Colors.light} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: wide * 3 }}>
                        <Text style={{ fontFamily: 'Pretendard-Regular', fontSize: wide * 3.2, color: c.subText }}>개발팀</Text>
                        <Text style={{ fontFamily: 'Pretendard-Medium', fontSize: wide * 3.2, color: c.accent }}>ITEC</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputLabel: {
        fontFamily: 'Pretendard-Regular',
        flexShrink: 0,
        width: 90,
    },
    textInput: {
        flex: 1,
        fontFamily: 'Pretendard-Medium',
        paddingVertical: 5,
        paddingHorizontal: 8,
        borderWidth: 1,
        borderRadius: 8,
        textAlign: 'right',
    },
});
