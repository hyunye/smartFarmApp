import { Colors } from '@/constants/Colors';
import { useServerAddress } from '@/hooks/useServerAddress';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

// ─── Types ────────────────────────────────────────────────────────────────────

type PicoStatus = 'normal' | 'wrong' | 'disconnected';

interface Pico {
    name: string;
    temp?: number;
    humidity?: number;
    activeTime?: string;
    status: PicoStatus;
}

interface Server {
    id: string;
    name: string;
    location: string;
    picos: Pico[];
    loading?: boolean;
    error?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MiniPicoCard({ pico, isServerDark, wide }: { pico: Pico; isServerDark: boolean; wide: number }) {
    let bgColor = '';
    let textColor = '';
    let iconColor = '';

    if (pico.status === 'normal') {
        bgColor = isServerDark ? 'rgba(74, 222, 128, 0.08)' : 'rgba(34, 197, 94, 0.08)';
        textColor = isServerDark ? '#4ADE80' : '#15803D';
        iconColor = isServerDark ? 'rgba(74, 222, 128, 0.6)' : '#166534';
    } else if (pico.status === 'wrong') {
        bgColor = isServerDark ? 'rgba(248, 113, 113, 0.08)' : 'rgba(239, 68, 68, 0.08)';
        textColor = isServerDark ? '#F87171' : '#B91C1C';
        iconColor = isServerDark ? 'rgba(248, 113, 113, 0.6)' : '#991B1B';
    } else {
        bgColor = isServerDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)';
        textColor = isServerDark ? '#64748B' : '#64748B';
        iconColor = isServerDark ? 'rgba(255,255,255,0.2)' : '#94A3B8';
    }

    const dotStyle = {
        width: wide * 1.2,
        height: wide * 1.2,
        borderRadius: wide * 0.6,
        backgroundColor: textColor,
    };

    return (
        <View style={[
            styles.miniPico,
            {
                backgroundColor: bgColor,
                width: '23.5%',
                height: wide * 22,
                padding: wide * 1.5,
                borderRadius: wide * 2.5,
                borderColor: isServerDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                borderWidth: 1,
            }
        ]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: wide * 0.8 }}>
                <Text style={[styles.miniPicoName, { color: textColor, fontSize: wide * 2.8 }]} numberOfLines={1}>
                    {pico.name}
                </Text>
                {pico.status !== 'disconnected' && <View style={dotStyle} />}
            </View>

            {pico.status !== 'disconnected' ? (
                <View style={{ gap: wide * 0.4 }}>
                    <View style={styles.miniValRow}>
                        <Ionicons name="thermometer-outline" size={wide * 2.4} color={iconColor} />
                        <Text style={[styles.miniPicoTxt, { color: textColor, fontSize: wide * 2.2 }]}>{pico.temp}°C</Text>
                    </View>
                    <View style={styles.miniValRow}>
                        <Ionicons name="water-outline" size={wide * 2.4} color={iconColor} />
                        <Text style={[styles.miniPicoTxt, { color: textColor, fontSize: wide * 2.2 }]}>{pico.humidity}%</Text>
                    </View>
                    <View style={styles.miniValRow}>
                        <Ionicons name="sunny-outline" size={wide * 2.4} color={iconColor} />
                        <Text style={[styles.miniPicoTxt, { color: textColor, fontSize: wide * 2.2 }]} numberOfLines={1}>{pico.activeTime}</Text>
                    </View>
                </View>
            ) : (
                <View style={[styles.centerAlign, { flex: 1 }]}>
                    <Ionicons name="alert-circle-outline" size={wide * 4.5} color={iconColor} />
                    <Text style={{ color: textColor, fontSize: wide * 2, fontFamily: 'Pretendard-Regular', marginTop: wide * 0.5 }}>
                        오프라인
                    </Text>
                </View>
            )}
        </View>
    );
}

function ServerCard({ server, wide, isDarkTheme }: { server: Server; wide: number; isDarkTheme: boolean }) {
    const router = useRouter();
    const scale = useSharedValue(1);

    const isDark = isDarkTheme;

    // Premium styling variants
    const cardBg = isDark ? '#111827' : '#FFFFFF';
    const cardBorder = server.error
        ? (isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.15)')
        : (isDark ? 'rgba(74, 222, 128, 0.12)' : 'rgba(0, 0, 0, 0.05)');

    const titleColor = isDark ? '#FFFFFF' : '#1E293B';
    const locationColor = isDark ? 'rgba(255, 255, 255, 0.6)' : '#64748B';
    const plusBg = isDark ? 'rgba(255, 255, 255, 0.04)' : '#F8FAFC';
    const plusColor = isDark ? 'rgba(74, 222, 128, 0.5)' : '#94A3B8';

    const pressHandler = () => {
        scale.value = withSpring(0.98, { damping: 15 }, () => {
            scale.value = withSpring(1, { damping: 15 });
        });
        router.push({ pathname: '/server/[id]', params: { id: server.id } });
    };

    const animStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const statusCounts = server.picos.reduce(
        (acc, p) => {
            if (p.status === 'normal') acc.normal++;
            else if (p.status === 'wrong') acc.wrong++;
            else acc.offline++;
            return acc;
        },
        { normal: 0, wrong: 0, offline: 0 }
    );

    return (
        <Pressable onPress={pressHandler}>
            <Animated.View style={[
                animStyle,
                styles.serverCard,
                {
                    backgroundColor: cardBg,
                    borderColor: cardBorder,
                    borderRadius: wide * 5,
                    padding: wide * 5,
                    shadowColor: server.error ? '#EF4444' : (isDark ? '#4ADE80' : '#000'),
                    shadowOpacity: isDark ? 0.08 : 0.04,
                    shadowRadius: wide * 4,
                    elevation: 4,
                    borderWidth: server.error ? 1.5 : 1,
                }
            ]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wide * 4 }}>
                    <View style={{ flex: 1, marginRight: wide * 2 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.serverTitle, { color: titleColor, fontSize: wide * 5.2 }]} numberOfLines={1}>
                                {server.name}
                            </Text>
                            {server.error && (
                                <View style={styles.errorDotBadge}>
                                    <Text style={{ fontSize: wide * 2, color: '#FFFFFF', fontFamily: 'Pretendard-Bold' }}>OFF</Text>
                                </View>
                            )}
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: wide * 0.8 }}>
                            <Ionicons name="location-outline" size={wide * 3.2} color={locationColor} style={{ marginRight: wide * 1 }} />
                            <Text style={{ fontFamily: 'Pretendard-Medium', fontSize: wide * 2.8, color: locationColor }} numberOfLines={1}>
                                {server.location}
                            </Text>
                        </View>
                    </View>

                    {/* Status pill summary inside server header */}
                    <View style={{ flexDirection: 'row', gap: wide * 1.5 }}>
                        <View style={[styles.statusTag, { backgroundColor: isDark ? 'rgba(74,222,128,0.1)' : '#DCFCE7' }]}>
                            <Text style={{ color: isDark ? '#4ADE80' : '#15803D', fontSize: wide * 2.5, fontFamily: 'Pretendard-Bold' }}>
                                {statusCounts.normal}
                            </Text>
                        </View>
                        {statusCounts.wrong > 0 && (
                            <View style={[styles.statusTag, { backgroundColor: isDark ? 'rgba(248,113,113,0.1)' : '#FEE2E2' }]}>
                                <Text style={{ color: isDark ? '#F87171' : '#B91C1C', fontSize: wide * 2.5, fontFamily: 'Pretendard-Bold' }}>
                                    {statusCounts.wrong}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Grid of mini picos */}
                <View style={styles.grid}>
                    {server.picos.map((pico, idx) => (
                        <MiniPicoCard key={idx} pico={pico} isServerDark={isDark} wide={wide} />
                    ))}
                    {/* Add button inside grid */}
                    <View style={[
                        styles.miniPico,
                        styles.centerAlign,
                        {
                            backgroundColor: plusBg,
                            width: '23.5%',
                            height: wide * 22,
                            borderRadius: wide * 2.5,
                            borderStyle: 'dashed',
                            borderWidth: 1,
                            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0, 0, 0, 0.08)',
                        }
                    ]}>
                        <Ionicons name="add" size={wide * 6} color={plusColor} />
                    </View>
                </View>
            </Animated.View>
        </Pressable>
    );
}

// ─── Main Index Dashboard ─────────────────────────────────────────────────────

export default function Index() {
    const { width, height } = useWindowDimensions();
    const wide = Math.min(width, height) * 0.01;
    const { isDark } = useTheme();
    const c = isDark ? Colors.dark : Colors.light;
    const router = useRouter();

    const { servers } = useServerAddress();
    const [fetchedServers, setFetchedServers] = useState<Server[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        const loaded: Server[] = await Promise.all(
            servers.map(async (srv) => {
                try {
                    const formattedUrl = srv.address.startsWith('http') ? srv.address : `http://${srv.address}`;
                    const res = await fetch(`${formattedUrl}/state`, {
                        headers: { 'Accept': 'application/json' },
                    });
                    if (!res.ok) throw new Error('Network error');
                    const data = await res.json();

                    // Respond: { state: number, pico: PicoType[] }
                    const picosList: Pico[] = (data.pico || []).map((p: any) => {
                        let status: PicoStatus = 'normal';
                        if (!p.connected) {
                            status = 'disconnected';
                        } else if (p.state.temperature > 30 || p.state.temperature < 15 || p.state.moisture < 30) {
                            status = 'wrong';
                        }
                        return {
                            name: p.name || p.id,
                            temp: p.state.temperature,
                            humidity: p.state.moisture,
                            activeTime: `${p.state.light} lx`,
                            status,
                        };
                    });

                    return {
                        id: srv.id,
                        name: srv.name,
                        location: srv.description,
                        picos: picosList,
                        error: false,
                    };
                } catch (e) {
                    // Fallback configuration if request fails
                    const fallbackPicos: Pico[] = srv.id === 'Server1' ? [
                        { name: 'pico1', temp: 22, humidity: 48, activeTime: '450 lx', status: 'normal' },
                        { name: 'pico2', temp: 29, humidity: 32, activeTime: '200 lx', status: 'wrong' },
                        { name: 'pico3', temp: 21, humidity: 55, activeTime: '420 lx', status: 'normal' },
                        { name: 'pico4', temp: 31, humidity: 28, activeTime: '600 lx', status: 'wrong' },
                        { name: 'pico5', temp: 30, humidity: 29, activeTime: '290 lx', status: 'wrong' },
                        { name: 'pico6', temp: 23, humidity: 50, activeTime: '440 lx', status: 'normal' },
                        { name: 'pico7', status: 'disconnected' },
                    ] : [
                        { name: 'pico1', temp: 19, humidity: 62, activeTime: '410 lx', status: 'normal' },
                        { name: 'pico2', temp: 28, humidity: 40, activeTime: '380 lx', status: 'wrong' },
                        { name: 'pico3', temp: 18, humidity: 65, activeTime: '400 lx', status: 'normal' },
                        { name: 'pico4', temp: 19, humidity: 61, activeTime: '420 lx', status: 'normal' },
                        { name: 'pico5', temp: 29, humidity: 38, activeTime: '390 lx', status: 'wrong' },
                        { name: 'pico6', temp: 20, humidity: 63, activeTime: '430 lx', status: 'normal' },
                        { name: 'pico7', status: 'disconnected' },
                    ];
                    return {
                        id: srv.id,
                        name: srv.name,
                        location: srv.description,
                        picos: fallbackPicos,
                        error: true,
                    };
                }
            })
        );
        setFetchedServers(loaded);
        setLoading(false);
        setRefreshing(false);
    }, [servers]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    // Summary calculation
    const totalPicos = fetchedServers.reduce((acc, s) => acc + s.picos.length, 0);
    const wrongPicos = fetchedServers.reduce((acc, s) => acc + s.picos.filter(p => p.status === 'wrong').length, 0);
    const offlineServers = fetchedServers.filter(s => s.error).length;

    return (
        <ScrollView
            style={[styles.scroll, { backgroundColor: c.background }]}
            contentContainerStyle={{ paddingBottom: wide * 26, paddingTop: wide * 6 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={c.accent} colors={[c.accent]} />
            }
        >
            {/* Custom Premium Header */}
            <View style={[styles.header, { paddingHorizontal: wide * 6, marginBottom: wide * 3 }]}>
                <View style={[styles.headerIconContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF' }]}>
                    <Ionicons name="leaf" size={wide * 5} color={c.accent} />
                </View>
                <View style={{ flex: 1 }} />
                <Pressable
                    onPress={() => router.push('/settings')}
                    style={[styles.headerIconContainer, { backgroundColor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#FFFFFF' }]}
                >
                    <Ionicons name="settings-sharp" size={wide * 5} color={c.main.text} />
                </Pressable>
            </View>

            {/* Dashboard greeting title */}
            <View style={{ paddingHorizontal: wide * 6, marginBottom: wide * 5 }}>
                <Text style={{ fontFamily: 'Pretendard-Bold', fontSize: wide * 7, color: c.main.text }}>
                    스마트팜 허브
                </Text>

                {/* Stats Summary Panel */}
                <View style={[
                    styles.summaryContainer,
                    {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : '#FFFFFF',
                        borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                        padding: wide * 3.5,
                        borderRadius: wide * 4,
                        marginTop: wide * 3,
                    }
                ]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: wide * 2 }}>
                            <View style={[styles.statusDot, { backgroundColor: offlineServers > 0 ? '#F87171' : (wrongPicos > 0 ? '#FB7185' : c.accent) }]} />
                            <Text style={{ fontSize: wide * 3.2, fontFamily: 'Pretendard-Medium', color: c.main.text, marginLeft: wide * 2, flex: 1 }} numberOfLines={1}>
                                {offlineServers > 0
                                    ? `${offlineServers}개의 서버가 오프라인 상태입니다`
                                    : (wrongPicos > 0 ? `${wrongPicos}개의 경고 상태 확인 됨` : '모든 온실 시스템이 안정적입니다')}
                            </Text>
                        </View>
                        <Text style={{ fontSize: wide * 2.8, fontFamily: 'Pretendard-Regular', color: c.subText }}>
                            디바이스 {totalPicos}개
                        </Text>
                    </View>
                </View>
            </View>

            {/* Server Card List */}
            {loading ? (
                <View style={[styles.centerAlign, { marginTop: wide * 10 }]}>
                    <ActivityIndicator size="large" color={c.accent} />
                </View>
            ) : (
                <View style={{ paddingHorizontal: wide * 6, gap: wide * 5.5 }}>
                    {fetchedServers.map((server) => (
                        <ServerCard key={server.id} server={server} wide={wide} isDarkTheme={isDark} />
                    ))}

                    {/* Add new server card at bottom */}
                    <Pressable style={[
                        styles.addServerCard,
                        {
                            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
                            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.01)' : 'rgba(0, 0, 0, 0.005)',
                            height: wide * 28,
                            borderRadius: wide * 5,
                        }
                    ]}>
                        <Ionicons name="add-circle" size={wide * 8} color={isDark ? 'rgba(255,255,255,0.15)' : '#94A3B8'} style={{ marginBottom: wide * 1 }} />
                        <Text style={{ fontFamily: 'Pretendard-Medium', fontSize: wide * 3, color: isDark ? '#475569' : '#94A3B8' }}>
                            새 온실 서버 추가
                        </Text>
                    </Pressable>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 2,
    },
    summaryContainer: {
        borderWidth: 1,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    serverCard: {
        borderWidth: 1,
    },
    serverTitle: {
        fontFamily: 'Pretendard-Bold',
    },
    statusTag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        minWidth: 22,
        alignItems: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        rowGap: 8,
    },
    miniPico: {
        justifyContent: 'center',
    },
    miniPicoName: {
        fontFamily: 'Pretendard-Bold',
    },
    miniPicoTxt: {
        fontFamily: 'Pretendard-Medium',
        marginLeft: 4,
    },
    miniValRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    centerAlign: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    addServerCard: {
        borderWidth: 2.5,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorDotBadge: {
        backgroundColor: '#EF4444',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 8,
    },
});
