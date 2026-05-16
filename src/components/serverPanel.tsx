import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Text, TextStyle, useWindowDimensions, View, ViewStyle } from 'react-native';

interface Server {
    name: string
}
type picoStyle = {
    cover: ViewStyle
    title: TextStyle
    text: TextStyle
}
type Style = {
    container: ViewStyle
    title: TextStyle
    pico: {
        all: picoStyle
        green: picoStyle
        red: picoStyle
        other: picoStyle
    }
}

export function ServerPanel(content: Server) {
    const { width, height } = useWindowDimensions()
    const wide = Math.min(width, height) * 0.01
    const currentColors = useTheme().isDark ? Colors.dark : Colors.light;

    const styles: Style = {
        container: {
            width: wide * 80,
            height: wide * 60,
            padding: wide * 5,
            backgroundColor: currentColors.main.cover,
            borderRadius: wide * 3,
            boxShadow: [{
                offsetX: wide * 2,
                offsetY: wide * 2,
                blurRadius: wide * 5,
                spreadDistance: 0,
                color: currentColors.main.shadow
            }]
        },
        pico: {
            // 언젠가 하겠지 (ToDo)
            // -> 와 잠만 개빡센데
            all: {
                cover: {
                    width: wide * 16,
                    height: wide * 16,
                    borderRadius: wide * 3
                },
                title: {
                    fontSize: wide * 3,
                    fontFamily: 'Pretendard'
                }
            },
            green: {},
            red: {},
            other: {}
        },
        title: {
            fontSize: wide * 8,
            color: currentColors.main.text,
            fontFamily: 'Pretendard-Bold',
        }
    }

    return (
        <View style={[styles.container]}>
            <Text style={[styles.title]}>{content.name}</Text>
        </View>
    )
}