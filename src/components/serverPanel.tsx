import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Text, TextStyle, useWindowDimensions, View, ViewStyle } from 'react-native';

interface Server {
    name: string
}

export function ServerPanel(content: Server) {
    const { width, height } = useWindowDimensions()
    const wide = Math.min(width, height)
    const currentColors = useTheme().isDark ? Colors.dark : Colors.light;

    const styles: {
        container: ViewStyle
        title: TextStyle
    } = {
        container: {
            width: wide * 0.8,
            height: wide * 0.6,
            padding: wide * 0.05,
            backgroundColor: currentColors.pannel,
            borderRadius: wide * 0.04,
        },
        title: {
            fontSize: wide * 0.08,
            color: currentColors.text
        }
    }

    return (
        <View style={[styles.container]}>
            <Text style={[styles.title]}>{content.name}</Text>
        </View>
    )
}