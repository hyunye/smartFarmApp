import { ServerPanel } from '@/components/serverPanel';
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, View } from "react-native";

export default function Index() {
    const { isDark } = useTheme();
    const currentColors = isDark ? Colors.dark : Colors.light;

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: currentColors.background },
            ]}
        >
            <ServerPanel
                server={{ name: "Server1" }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
