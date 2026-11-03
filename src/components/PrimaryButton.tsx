import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  title: string;
  onPress: () => void;
  secondary?: boolean;
};

export default function PrimaryButton({
  title,
  onPress,
  secondary = false,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, secondary && styles.secondaryText]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    borderRadius: 14,
    backgroundColor: "#2F855A",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    marginTop: 12,
  },
  secondary: {
    backgroundColor: "#E6F4EA",
    borderWidth: 1,
    borderColor: "#B7DCC2",
  },
  pressed: { opacity: 0.8 },
  text: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  secondaryText: { color: "#276749" },
});
