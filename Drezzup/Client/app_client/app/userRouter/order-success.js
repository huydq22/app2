import { Colors } from "@/constants/Colors"
import { saveOrder } from "@/utils/orderStorage"
import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const OrderSuccessScreen = () => {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [loading, setLoading] = useState(true)
  const [orderData, setOrderData] = useState(null)

  useEffect(() => {
    handleOrderSuccess()
  }, [])

  const handleOrderSuccess = async () => {
    try {
      setLoading(true)
      console.log('Order success params:', params)

      // Construct order object from individual parameters
      const order = {
        donhang_id: params.orderId?.toString(),
        id: params.orderId?.toString(),
        date: new Date().toISOString(),
        status: 'processing',
        total: Number(params.total) || 0,
        items: params.items ? JSON.parse(params.items) : [],
        address: params.address ? JSON.parse(params.address) : null
      }

      console.log('Constructed order data:', order)

      // Save order to storage
      await saveOrder(order)
      console.log('Order saved successfully')

      setOrderData(order)
    } catch (error) {
      console.error('Error in handleOrderSuccess:', error)
      Alert.alert('Lỗi', 'Không thể xử lý đơn hàng. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoToHome = () => {
    router.replace('/userRouter/(tabs)/home')
  }

  const handleViewOrder = () => {
    if (!orderData) {
      Alert.alert('Lỗi', 'Không có thông tin đơn hàng')
      return
    }

    console.log('Navigating to order detail with data:', orderData)
    router.push({
      pathname: '/userRouter/order-detail',
      params: { order: JSON.stringify(orderData) }
    })
  }

  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes(' - ')) {
      const [minPrice] = price.split(' - ');
      return `${parseInt(minPrice).toLocaleString('vi-VN')} Đ`;
    }
    return `${parseInt(price).toLocaleString('vi-VN')} Đ`;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Đang xử lý đơn hàng...</Text>
      </View>
    )
  }

  if (!orderData) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Không thể tải thông tin đơn hàng</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={60} color="white" />
          </View>
        </View>

        <Text style={styles.title}>Đặt hàng thành công!</Text>

        <View style={styles.orderInfo}>
          <Text style={styles.orderLabel}>Mã đơn hàng:</Text>
          <Text style={styles.orderNumber}>#{orderData.donhang_id || orderData.id}</Text>
        </View>

        <View style={styles.totalInfo}>
          <Text style={styles.totalLabel}>Tổng tiền:</Text>
          <Text style={styles.totalAmount}>{formatPrice(orderData.total)}</Text>
        </View>

        <Text style={styles.message}>
          Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý và giao hàng đến bạn trong thời gian sớm nhất.
        </Text>

        <View style={styles.statusContainer}>
          <View style={styles.statusItem}>
            <View style={styles.statusIcon}>
              <Ionicons name="time-outline" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.statusText}>Đang xử lý</Text>
          </View>

          <View style={styles.statusLine} />

          <View style={styles.statusItem}>
            <View style={[styles.statusIcon, styles.inactiveIcon]}>
              <Ionicons name="cube-outline" size={24} color="#ccc" />
            </View>
            <Text style={[styles.statusText, styles.inactiveText]}>Đang giao</Text>
          </View>

          <View style={styles.statusLine} />

          <View style={styles.statusItem}>
            <View style={[styles.statusIcon, styles.inactiveIcon]}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#ccc" />
            </View>
            <Text style={[styles.statusText, styles.inactiveText]}>Hoàn thành</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.viewOrderButton} onPress={handleViewOrder}>
            <Text style={styles.viewOrderButtonText}>Xem đơn hàng</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.continueButton} onPress={handleGoToHome}>
            <Text style={styles.continueButtonText}>Tiếp tục mua sắm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 32,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 24,
    textAlign: "center",
  },
  orderInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  orderLabel: {
    fontSize: 16,
    color: Colors.gray,
    marginRight: 8,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
  },
  totalInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  totalLabel: {
    fontSize: 16,
    color: Colors.gray,
    marginRight: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
  },
  message: {
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  statusItem: {
    alignItems: "center",
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e8f4fd",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  inactiveIcon: {
    backgroundColor: "#f5f5f5",
  },
  statusText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
  },
  inactiveText: {
    color: "#ccc",
  },
  statusLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#f0f0f0",
    marginHorizontal: 8,
    marginBottom: 20,
  },
  buttonsContainer: {
    width: "100%",
    gap: 16,
  },
  viewOrderButton: {
    backgroundColor: "white",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  viewOrderButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
})

export default OrderSuccessScreen