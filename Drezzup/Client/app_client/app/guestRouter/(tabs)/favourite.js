// screens/FavouriteScreen.js
import Header from "@/components/common/Header";
import EmptyFavourites from "@/components/favourite/EmptyFavourites";
import FavouriteFooter from "@/components/favourite/FavouriteFooter";
import FavouriteItem from "@/components/favourite/FavouriteItem";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FavouriteScreen = () => {
  const router = useRouter();
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);

  const handleBack = () => {
    router.push("/guestRouter/(tabs)/home");
  };

  const handleRemoveItem = (productId) => {
    Alert.alert("Xác nhận", "Bạn có muốn xóa sản phẩm này khỏi danh sách yêu thích?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          removeFromFavorites(productId);
          // Remove from selected items if it was selected
          setSelectedItems((prev) => prev.filter((id) => id !== productId));
        },
      },
    ]);
  };

  // const handleProductPress = (productId) => {
  //   router.push(`/product/${productId}`);
  // };

  const handleSelectItem = (productId) => {
    setSelectedItems((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === favorites.length) {
      // Deselect all
      setSelectedItems([]);
    } else {
      // Select all
      setSelectedItems(favorites.map((item) => item.id));
    }
  };

  const handleAddSelectedToCart = () => {
    if (selectedItems.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn sản phẩm để thêm vào giỏ hàng!");
      return;
    }

    // Add selected items to cart
    const selectedProducts = favorites.filter((item) => selectedItems.includes(item.id));

    selectedProducts.forEach((product) => {
      // For favorites, we'll use default size and color if available
      const defaultSize = product.variants && product.variants.length > 0 ? product.variants[0].size : null;
      const defaultColor = product.variants && product.variants.length > 0 ? product.variants[0].color : null;

      addToCart(product, 1, defaultSize, defaultColor);
    });

    Alert.alert("Thành công", "Đã thêm sản phẩm vào giỏ hàng", [
      {
        text: "Tiếp tục",
        style: "cancel",
      },
      {
        text: "Xem giỏ hàng",
        onPress: () => router.push("/guestRouter/(tabs)/cart"),
      },
    ]);
  };

  const isAllSelected = favorites.length > 0 && selectedItems.length === favorites.length;

  if (!favorites || !Array.isArray(favorites)) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Yêu thích" showBackButton={true} onBack={handleBack} />
        <View style={styles.content}>
          <Text>Đang tải dữ liệu...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title="Yêu thích" showBackButton={true} onBack={handleBack} />

      <View style={styles.content}>
        {favorites.length === 0 ? (
          <EmptyFavourites />
        ) : (
          <>
            <FlatList
              data={favorites}
              renderItem={({ item }) => (
                <FavouriteItem
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  onSelect={handleSelectItem}
                  onRemove={handleRemoveItem}
                  // onPress={handleProductPress}
                />
              )}
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : `favorite-${index}`
              }
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />

            <FavouriteFooter
              isAllSelected={isAllSelected}
              onSelectAll={handleSelectAll}
              onAddToCart={handleAddSelectedToCart}
            />
          </>
        )}
      </View>
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

export default FavouriteScreen;