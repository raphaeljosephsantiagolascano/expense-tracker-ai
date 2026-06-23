import { Alert, Text, TouchableOpacity, View } from "react-native";

type Props = {
  label: string;
  description: string;
};

export default function InfoLabel({ label, description }: Props) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text>{label}</Text>

      <TouchableOpacity onPress={() => Alert.alert(label, description)}>
        <Text
          style={{
            marginLeft: 5,
            color: "#000000",
            fontWeight: "bold",
          }}
        >
          ⓘ
        </Text>
      </TouchableOpacity>
    </View>
  );
}
