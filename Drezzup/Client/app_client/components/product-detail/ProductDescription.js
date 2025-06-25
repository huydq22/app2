import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";

export default function ProductDescription({ description }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mô tả</Text>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 12,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  description: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
  },
});