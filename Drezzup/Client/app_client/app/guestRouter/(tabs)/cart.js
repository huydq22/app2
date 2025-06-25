// screens/CartScreen.js
import CartFooter from "@/components/cart/CartFooter";
import CartItem from "@/components/cart/CartItem";
import EmptyCart from "@/components/cart/EmptyCart";
import Header from "@/components/common/Header";
import { LoginModal } from "@/components/common/LoginModal";
import { useCart } from "@/context/CartContext";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CartScreen = () => {
  const { cartItems, removeFromCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedTotal, setSelectedTotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

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
    router.replace('/guestRouter/(tabs)/home');
  };

  const handleRemoveItem = (item) => {
    Alert.alert("Xác nhận", "Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          removeFromCart(item);
          setSelectedItems(prev => 
            prev.filter(id => id !== item.cartItemId)
          );
        },
      },
    ]);
  };

  const handleSelectItem = (cartItemId) => {
    setSelectedItems(prev => 
      prev.includes(cartItemId) 
        ? prev.filter(id => id !== cartItemId) 
        : [...prev, cartItemId]
    );
  };

  const handleSelectAll = () => {
    setSelectedItems(
      selectedItems.length === cartItems.length 
        ? [] 
        : cartItems.map(item => item.cartItemId)
    );
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn sản phẩm để thanh toán!");
      return;
    }
    setModalVisible(true);
  };

  const handleLoginRedirect = () => {
    setModalVisible(false);
    router.replace('/userRouter/login');
  };

  const isAllSelected = cartItems.length > 0 && selectedItems.length === cartItems.length;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Giỏ hàng" showBackButton onBack={handleBack} />

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
              keyExtractor={item => item.cartItemId}
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

      <LoginModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLogin={handleLoginRedirect}
        action="thanh toán"
      />
    </SafeAreaView>
  );
};

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