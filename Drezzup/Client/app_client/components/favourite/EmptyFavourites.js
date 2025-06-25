import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, View } from "react-native"

export default function EmptyFavourites() {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={64} color={Colors.gray} />
      <Text style={styles.emptyTitle}>Danh sách yêu thích trống</Text>
      <Text style={styles.emptySubtitle}>Hãy thêm những sản phẩm bạn yêu thích vào đây!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: "center",
    lineHeight: 20,
  },
})
