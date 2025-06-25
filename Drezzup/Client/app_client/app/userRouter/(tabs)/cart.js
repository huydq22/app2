import CartFooter from "@/components/cart/CartFooter";
import CartItem from "@/components/cart/CartItem";
import EmptyCart from "@/components/cart/EmptyCart";
import Header from "@/components/common/Header";
import { useCart } from "@/context/CartContext";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CartScreen = () => {
  const { cartItems, removeFromCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTotal, setSelectedTotal] = useState(0);

  useEffect(() => {
    calculateSelectedTotal();
  }, [selectedItems, cartItems]);

  const calculateSelectedTotal = () => {
    const total = cartItems.reduce((sum, item) => {
      if (selectedItems.includes(item.cartItemId)) {
        return sum + item.price * item.quantity;
      }
      return sum;
    }, 0);
    setSelectedTotal(total);
  };

  const handleBack = () => {
    // Xử lý quay lại nếu cần
    router.replace('/userRouter/(tabs)/home')
  };

  const handleRemoveItem = (item) => {
    Alert.alert("Xác nhận", "Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          removeFromCart(item);
          setSelectedItems((prev) => 
            prev.filter((id) => id !== item.cartItemId)
          );
        },
      },
    ]);
  };

  const handleSelectItem = (cartItemId) => {
    setSelectedItems((prev) => {
      if (prev.includes(cartItemId)) {
        return prev.filter((id) => id !== cartItemId);
      } else {
        return [...prev, cartItemId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.cartItemId));
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn sản phẩm để thanh toán!");
      return;
    }
    // Xử lý thanh toán
    router.push('/userRouter/checkout')
  };

  const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Giỏ hàng" showBackButton={true} onBack={handleBack} />

      <View style={styles.content}>
        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <FlatList
              data={cartItems}
              renderItem={({ item }) => (
                <CartItem
                  key={item.cartItemId}
                  item={item}
                  isSelected={selectedItems.includes(item.cartItemId)}
                  onSelect={handleSelectItem}
                  onRemove={handleRemoveItem}
                />
              )}
              keyExtractor={(item) => item.cartItemId}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />

            <CartFooter
              isAllSelected={isAllSelected}
              onSelectAll={handleSelectAll}
              selectedTotal={selectedTotal}
              onCheckout={handleCheckout}
              selectedItems={selectedItems}
            />
          </>
        )}
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
  listContainer: {
    padding: 16,
  },
});

export default CartScreen;