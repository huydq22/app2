import { Colors } from "@/constants/Colors";
import { StyleSheet, Text, View } from "react-native";

export default function OrderTotalSection({ subtotal, shippingFee, discount, total }) {
  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes(' - ')) {
      const [minPrice] = price.split(' - ');
      return `${parseInt(minPrice).toLocaleString('vi-VN')} Đ`;
    }
    return `${parseInt(price).toLocaleString('vi-VN')} Đ`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết thanh toán</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Tổng tiền hàng</Text>
        <Text style={styles.value}>{formatPrice(subtotal)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Phí vận chuyển</Text>
        <Text style={styles.value}>{formatPrice(shippingFee)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Voucher giảm giá</Text>
        <Text style={[styles.value, styles.discountValue]}>-{formatPrice(discount)}</Text>
      </View>

      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>Tổng thanh toán</Text>
        <Text style={styles.totalValue}>{formatPrice(total)}</Text>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: Colors.gray,
  },
  value: {
    fontSize: 14,
    color: Colors.text,
  },
  discountValue: {
    color: "#FF4D4F",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
})
