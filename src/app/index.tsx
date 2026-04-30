import { Text, View } from "react-native";
import { Colors } from "@/constants/Colors";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.light.background,
      }}
    >
      <Text style={{ color: Colors.light.text }}>
        Edit src/app/index.tsx to edit this screen.
      </Text>
    </View>
  );
}
