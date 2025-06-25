import { getDefaultAddress, getProductById } from "@/api/userApi";
import AddressSection from "@/components/checkout/AddressSection";
import OrderSummarySection from "@/components/checkout/OrderSummarySection";
import OrderTotalSection from "@/components/checkout/OrderTotalSection";
import PaymentMethodSection from "@/components/checkout/PaymentMethodSection";
import ShippingMethodSection from "@/components/checkout/ShippingMethodSection";
import VoucherSection from "@/components/checkout/VoucherSection";
import Header from "@/components/common/Header";
import { Colors } from "@/constants/Colors";
import { useCart } from "@/context/CartContext";
import { useVoucher } from "@/context/VoucherContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CheckoutScreen = () => {
    const router = useRouter();
    const { productId, quantity, size, color, selectedAddress } = useLocalSearchParams();
    const { cartItems, clearCart } = useCart();
    const { selectedVoucher } = useVoucher();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");
    const [address, setAddress] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Calculate order totals with selected voucher
    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = 0;

    // Use selected voucher for discount calculation
    const discountAmount = selectedVoucher && subtotal >= selectedVoucher.minOrder * 1000
        ? Math.round(subtotal * (selectedVoucher.discount / 100))
        : 0;

    const total = subtotal - discountAmount + shippingFee;

    useEffect(() => {
        loadData();
    }, [productId, selectedAddress]);

    const loadData = async () => {
        try {
            // Check if a selected address is passed from AddressScreen
            if (selectedAddress) {
                setAddress(JSON.parse(selectedAddress));
            } else {
                // Load default address if no selected address
                const defaultAddress = await getDefaultAddress();
                setAddress(defaultAddress);
            }

            // Determine order items
            if (productId) {
                // Single product checkout
                const product = await getProductById(productId);
                if (product) {
                    setOrderItems([
                        {
                            ...product,
                            quantity: Number(quantity) || 1,
                            selectedSize: size || "M",
                            selectedColor: color || "Black",
                        },
                    ]);
                }
            } else {
                // Cart checkout - use all cart items
                setOrderItems(cartItems);
            }
        } catch (error) {
            console.error("Error loading checkout data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const handleEditAddress = () => {
        router.push({
            pathname: "/userRouter/address-screen",
            params: { fromCheckout: true },
        });
    };

    const handleSelectPaymentMethod = (method) => {
        setSelectedPaymentMethod(method);
    };

    const handleApplyVoucher = () => {
        router.push("/userRouter/add-voucher");
    };

    const handleSelectShippingMethod = () => {
        console.log("Select shipping method");
    };

    const handlePlaceOrder = async () => {
        try {
            console.log('Placing order with items:', orderItems);
            const orderData = {
                orderId: Math.floor(Math.random() * 1000000),
                total: total,
                items: JSON.stringify(orderItems),
                address: JSON.stringify(address)
            };
            console.log('Order data being passed:', orderData);

            // Clear the cart before navigating to success screen
            await clearCart();
            console.log('Cart cleared after order placement');

            // Navigate to success screen
            router.push({
                pathname: "/userRouter/order-success",
                params: orderData
            });
        } catch (error) {
            console.error('Error placing order:', error);
            Alert.alert('Lỗi', 'Không thể đặt hàng. Vui lòng thử lại.');
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={["top"]}>
                <Header title="Thanh toán" showBackButton={true} onBack={handleBack} />
                <View style={styles.loadingContainer}>
                    <Text>Đang tải...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <Header title="Thanh toán" showBackButton={true} onBack={handleBack} />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <AddressSection address={address} onEditAddress={handleEditAddress} />
                <OrderSummarySection items={orderItems} />
                <VoucherSection
                    appliedVoucher={selectedVoucher}
                    onApplyVoucher={handleApplyVoucher}
                    subtotal={subtotal}
                />
                <ShippingMethodSection selectedMethod="standard" onSelectMethod={handleSelectShippingMethod} />
                <PaymentMethodSection selectedMethod={selectedPaymentMethod} onSelectMethod={handleSelectPaymentMethod} />
                <OrderTotalSection subtotal={subtotal} shippingFee={shippingFee} discount={discountAmount} total={total} />
            </ScrollView>
            <View style={styles.bottomBar}>
                <View style={styles.totalContainer}>
                    <View style={styles.totalRightAlign}>
                        <Text style={styles.totalLabel}>Tổng tiền cần thanh toán</Text>
                        <Text style={styles.totalValue}>{total.toLocaleString("vi-VN")} vnđ</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
                    <Text style={styles.placeOrderButtonText}>Đặt Hàng</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        marginBottom: 12,
    },
    totalContainer: {
        flex: 1,
    },
    totalRightAlign: {
        alignItems: 'flex-end',
    },
    totalLabel: {
        fontSize: 12,
        color: Colors.gray,
        marginBottom: 4,
    },
    totalValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF4D4F',
    },
    placeOrderButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: 6,
        marginLeft: 16,
    },
    placeOrderButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
});

export default CheckoutScreen;