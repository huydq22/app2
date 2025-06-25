import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function ShippingMethodSection({ selectedMethod, onSelectMethod }) {
  const handleOpenShippingMethods = () => {
    if (onSelectMethod) {
      onSelectMethod()
    }
  }

  return (
    <TouchableOpacity style={styles.container} onPress={handleOpenShippingMethods}>
      <View style={styles.header}>
        <Text style={styles.title}>Phương thức vận chuyển</Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.deliveryInfo}>Nhận hàng từ ngày xx đến ngày xx</Text>
        <Text style={styles.feeInfo}>Miễn phí</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deliveryInfo: {
    fontSize: 14,
    color: Colors.gray,
  },
  feeInfo: {
    fontSize: 14,
    color: Colors.text,
  },
})
