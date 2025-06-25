import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function AddressSection({ address, onEditAddress }) {
  if (!address) {
    return (
      <TouchableOpacity style={styles.container} onPress={onEditAddress}>
        <View style={styles.addAddressContainer}>
          <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
          <Text style={styles.addAddressText}>Thêm địa chỉ giao hàng</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity style={styles.container} onPress={onEditAddress}>
      <View style={styles.iconContainer}>
        <Ionicons name="location-outline" size={20} color={Colors.text} />
      </View>

      <View style={styles.addressContent}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{address.recipient_name}</Text>
          <Text style={styles.phone}>• {address.phone}</Text>
        </View>

        <Text style={styles.addressText}>{address.address}</Text>
        <Text style={styles.country}>{address.country}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  iconContainer: {
    marginRight: 12,
  },
  addressContent: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  phone: {
    fontSize: 14,
    color: Colors.gray,
    marginLeft: 4,
  },
  addressText: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  country: {
    fontSize: 14,
    color: Colors.gray,
  },
  addAddressContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addAddressText: {
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 8,
    fontWeight: "500",
  },
})
