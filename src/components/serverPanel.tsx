import { Colors } from '@/constants/Colors';
import { useTheme } from '@/hooks/useTheme';
import { Text, TextStyle, useWindowDimensions, View, ViewStyle } from 'react-native';

type Server = {
    name: string
}
type Pico = {
    name: string
    color: "green" | "red" | "sub"
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
        sub: picoStyle
    }
}

export function ServerPanel({server}: {server: Server}) {
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
                    borderRadius: wide * 3,
                    padding: wide * 1.5,
                },
                title: {
                    fontSize: wide * 3,
                    fontFamily: 'Pretendard-Medium',
                },
                text: {
                    fontSize: wide * 2.5,
                    fontFamily: 'Pretendard-Regular'
                }
            },
            green: {
                cover: {
                    backgroundColor: currentColors.green.cover,
                    borderColor: currentColors.green.outline,
                    borderWidth: wide * 0.5,
                    boxShadow: [{
                        offsetX: 0,
                        offsetY: 0,
                        blurRadius: wide * 2,
                        spreadDistance: 0,
                        color: currentColors.green.shadow
                    }]
                },
                title: {
                    color: currentColors.green.text
                },
                text: {
                    color: currentColors.green.text
                }
            },
            red: {
                cover: {
                    backgroundColor: currentColors.red.cover
                },
                title: {
                    color: currentColors.red.text
                },
                text: {
                    color: currentColors.red.text
                }
            },
            sub: {
                cover: {
                    backgroundColor: currentColors.sub.cover
                },
                title: {
                    color: currentColors.sub.text
                },
                text: {
                    color: currentColors.sub.text
                }
            }
        },
        title: {
            marginBottom: wide * 4,
            fontSize: wide * 8,
            color: currentColors.main.text,
            fontFamily: 'Pretendard-SemiBold',
        }
    }

    function PicoPannel({pico}: {pico: Pico}) {
        return (<View style={[styles.pico.all.cover, styles.pico[pico.color].cover]}>
            <Text style={[styles.pico.all.title, styles.pico[pico.color].title]}>{pico.name}</Text>
        </View>)
    }

    return (
        <View style={[styles.container]}>
            <Text style={[styles.title]}>{server.name}</Text>
            <PicoPannel
                pico={{name: "pico1", color: "green"}}
            />
        </View>
    )
}