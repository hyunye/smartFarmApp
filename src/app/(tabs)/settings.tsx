import { Colors } from '@/constants/Colors';
import { ServerConfig, useServerAddress } from '@/hooks/useServerAddress';
import { useTheme } from '@/hooks/useTheme';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, useWindowDimensions, View } from 'react-native';

type RuntimeSettings = { measurementIntervalMinutes: number; retentionMonths: number };

function ServerRuntimeSettings({ server, wide, c }: { server: ServerConfig; wide: number; c: typeof Colors.dark }) {
    const [settings, setSettings] = useState<RuntimeSettings>({ measurementIntervalMinutes: 60, retentionMonths: 6 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const baseUrl = server.address.startsWith('http') ? server.address : `http://${server.address}`;

    useEffect(() => {
        let active = true;
        fetch(`${baseUrl}/settings`, { headers: { Accept: 'application/json' } })
            .then(response => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
            .then(json => { if (active && json.settings) setSettings(json.settings); })
            .catch(() => { if (active) setMessage('서버 설정을 불러올 수 없습니다.'); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [baseUrl]);

    const save = async () => {
        const measurementIntervalMinutes = Number(settings.measurementIntervalMinutes);
        const retentionMonths = Number(settings.retentionMonths);
        if (!Number.isInteger(measurementIntervalMinutes) || measurementIntervalMinutes < 1 || measurementIntervalMinutes > 1440 || !Number.isInteger(retentionMonths) || retentionMonths < 1 || retentionMonths > 60) {
            setMessage('측정 주기는 1~1440분, 보관 기간은 1~60개월로 입력하세요.');
            return;
        }
        setSaving(true); setMessage('');
        try {
            const response = await fetch(`${baseUrl}/settings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-API-Key': process.env.EXPO_PUBLIC_SMARTFARM_API_KEY ?? '' },
                body: JSON.stringify({ measurementIntervalMinutes, retentionMonths }),
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            setMessage('저장되었습니다. 연결된 센서에 새 측정 주기를 전송했습니다.');
        } catch {
            setMessage('저장에 실패했습니다. 서버 주소와 API 키를 확인하세요.');
        } finally { setSaving(false); }
    };

    return <View style={[styles.card, { backgroundColor: c.main.cover, borderColor: c.main.outline, padding: wide * 4, marginBottom: wide * 3 }]}>
        <Text style={{ fontFamily: 'Pretendard-Bold', color: c.main.text, fontSize: wide * 4 }}>{server.name}</Text>
        {loading ? <ActivityIndicator color={c.accent} style={{ marginVertical: wide * 4 }} /> : <>
            <Text style={[styles.label, { color: c.subText, fontSize: wide * 3 }]}>센서 측정 주기 (분)</Text>
            <TextInput style={[styles.input, { color: c.main.text, borderColor: c.main.outline }]} value={String(settings.measurementIntervalMinutes)} keyboardType="number-pad" onChangeText={value => setSettings(current => ({ ...current, measurementIntervalMinutes: Number(value) }))} />
            <Text style={[styles.label, { color: c.subText, fontSize: wide * 3 }]}>측정값 보관 기간 (개월)</Text>
            <TextInput style={[styles.input, { color: c.main.text, borderColor: c.main.outline }]} value={String(settings.retentionMonths)} keyboardType="number-pad" onChangeText={value => setSettings(current => ({ ...current, retentionMonths: Number(value) }))} />
            <Pressable onPress={save} disabled={saving} style={[styles.saveButton, { backgroundColor: c.accent, opacity: saving ? 0.6 : 1 }]}>
                <Text style={styles.saveText}>{saving ? '저장 중...' : '서버 설정 저장'}</Text>
            </Pressable>
            {!!message && <Text style={{ color: c.subText, fontFamily: 'Pretendard-Regular', fontSize: wide * 2.7, marginTop: wide * 2 }}>{message}</Text>}
        </>}
    </View>;
}

function ServerAddressForm({ server, wide, c, onSave }: { server: ServerConfig; wide: number; c: typeof Colors.dark; onSave: (id: string, name: string, description: string, address: string) => void }) {
    const [name, setName] = useState(server.name); const [description, setDescription] = useState(server.description); const [address, setAddress] = useState(server.address);
    useEffect(() => { setName(server.name); setDescription(server.description); setAddress(server.address); }, [server]);
    return <View style={{ marginBottom: wide * 3 }}>
        <Text style={{ color: c.main.text, fontFamily: 'Pretendard-SemiBold', fontSize: wide * 3.5 }}>{server.id}</Text>
        <TextInput style={[styles.input, { color: c.main.text, borderColor: c.main.outline }]} value={name} onChangeText={setName} placeholder="서버 이름" placeholderTextColor={c.subText} />
        <TextInput style={[styles.input, { color: c.main.text, borderColor: c.main.outline }]} value={description} onChangeText={setDescription} placeholder="설명" placeholderTextColor={c.subText} />
        <TextInput style={[styles.input, { color: c.main.text, borderColor: c.main.outline }]} value={address} onChangeText={setAddress} placeholder="http://192.168.0.10:3000" placeholderTextColor={c.subText} autoCapitalize="none" />
        <Pressable style={[styles.saveButton, { backgroundColor: c.accent }]} onPress={() => onSave(server.id, name.trim(), description.trim(), address.trim().replace(/\/$/, ''))}><Text style={styles.saveText}>서버 주소 저장</Text></Pressable>
    </View>;
}

export default function Settings() {
    const { width, height } = useWindowDimensions(); const wide = Math.min(width, height) * 0.01;
    const { isDark, toggleTheme } = useTheme(); const c = isDark ? Colors.dark : Colors.light;
    const { servers, updateServerConfig } = useServerAddress();
    const [notifications, setNotifications] = useState(true);
    return <ScrollView style={{ flex: 1, backgroundColor: c.background }} contentContainerStyle={{ padding: wide * 5, paddingBottom: wide * 22 }}>
        <Text style={{ fontFamily: 'Pretendard-Bold', fontSize: wide * 7, color: c.main.text, marginBottom: wide * 5 }}>설정</Text>
        <View style={[styles.card, { backgroundColor: c.main.cover, borderColor: c.main.outline, padding: wide * 4 }]}>
            <Text style={{ color: c.main.text, fontFamily: 'Pretendard-SemiBold', fontSize: wide * 3.5 }}>다크 모드</Text><Switch value={isDark} onValueChange={toggleTheme} trackColor={{ true: c.accent }} />
            <Text style={{ color: c.main.text, fontFamily: 'Pretendard-SemiBold', fontSize: wide * 3.5, marginTop: wide * 3 }}>알림 표시</Text><Switch value={notifications} onValueChange={setNotifications} trackColor={{ true: c.accent }} />
        </View>
        <Text style={[styles.heading, { color: c.subText, marginTop: wide * 5 }]}>센서 및 데이터 보관</Text>
        {servers.map(server => <ServerRuntimeSettings key={server.id} server={server} wide={wide} c={c} />)}
        <Text style={[styles.heading, { color: c.subText, marginTop: wide * 3 }]}>서버 연결</Text>
        <View style={[styles.card, { backgroundColor: c.main.cover, borderColor: c.main.outline, padding: wide * 4 }]}>{servers.map(server => <ServerAddressForm key={server.id} server={server} wide={wide} c={c} onSave={updateServerConfig} />)}</View>
    </ScrollView>;
}

const styles = StyleSheet.create({
    card: { borderWidth: 1, borderRadius: 16, marginBottom: 12 }, heading: { fontFamily: 'Pretendard-SemiBold', fontSize: 14, marginBottom: 10 },
    label: { fontFamily: 'Pretendard-Regular', marginTop: 12, marginBottom: 5 }, input: { fontFamily: 'Pretendard-Medium', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
    saveButton: { alignItems: 'center', borderRadius: 8, paddingVertical: 10, marginTop: 12 }, saveText: { color: '#FFFFFF', fontFamily: 'Pretendard-Bold' },
});
