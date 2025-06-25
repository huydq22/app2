import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

export default function PaymentMethodSection({ selectedMethod, onSelectMethod }) {
  const paymentMethods = [
    { id: "cod", name: "Thanh toán khi nhận hàng", icon: "cash-outline" },
    { id: "vnpay", name: "Thanh toán với VN PAY", icon: "card-outline" },
  ]

  const handleSelectPayment = (methodId) => {
    if (onSelectMethod) {
      onSelectMethod(methodId)
    }
  }

  const renderRadioButton = (isSelected) => (
    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
      {isSelected && <View style={styles.radioInner} />}
    </View>
  )

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phương thức thanh toán</Text>

      <View style={styles.methodsContainer}>
        {paymentMethods.map((method) => (
          <TouchableOpacity key={method.id} style={styles.methodItem} onPress={() => handleSelectPayment(method.id)}>
            <View style={styles.methodRadio}>{renderRadioButton(selectedMethod === method.id)}</View>

            <View style={styles.methodIcon}>
              <Ionicons name={method.icon} size={20} color={Colors.text} />
            </View>

            <Text style={styles.methodName}>{method.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
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
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
    marginBottom: 16,
  },
  methodsContainer: {
    gap: 12,
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  methodRadio: {
    marginRight: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  radioOuterSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  methodIcon: {
    marginRight: 12,
  },
  methodName: {
    fontSize: 14,
    color: Colors.text,
  },
})
