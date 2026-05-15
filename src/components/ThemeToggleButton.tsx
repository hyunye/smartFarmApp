import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, withSpring } from 'react-native-reanimated';

export function ThemeToggleButton() {
    const { isDark, toggleTheme } = useTheme();

    const animatedContainerStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            isDark ? 1 : 0,
            [0, 1],
            [Colors.light.background, Colors.dark.background]
        );
        return { backgroundColor };
    });

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotate: withSpring(isDark ? '180deg' : '0deg'),
                },
                {
                    scale: withSpring(1),
                }
            ],
        };
    });

    return (
        <Pressable onPress={toggleTheme}>
            <Animated.View style={[styles.container, animatedContainerStyle]}>
                <Animated.View style={animatedIconStyle}>
                    <Ionicons 
                        name={isDark ? "moon" : "sunny"} 
                        size={24} 
                        color={isDark ? Colors.dark.tint : Colors.light.tint} 
                    />
                </Animated.View>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
