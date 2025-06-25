import Header from "@/components/common/Header";
import EmptyFavourites from "@/components/favourite/EmptyFavourites";
import FavouriteFooter from "@/components/favourite/FavouriteFooter";
import FavouriteItem from "@/components/favourite/FavouriteItem";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FavouriteScreen = () =>{
  const router = useRouter();
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();
  const [selectedItems, setSelectedItems] = useState([]);

  // Debug dữ liệu favorites
  useEffect(() => {
    console.log("Favorites data:", favorites);
    console.log("Favorite IDs:", favorites?.map(item => item._id || item.id));
  }, [favorites]);

  const handleBack = () => {
    router.push("/userRouter/(tabs)/home");
  };

  const getProductId = (item) => {
    return item._id || item.id || item.product_id;
  };

  const handleRemoveItem = (productId) => {
    Alert.alert("Xác nhận", "Bạn có muốn xóa sản phẩm này khỏi danh sách yêu thích?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: () => {
          removeFromFavorites(productId);
          setSelectedItems((prev) => prev.filter((id) => id !== productId));
        },
      },
    ]);
  };

  const handleProductPress = (product) => {
    const productId = getProductId(product);
    router.push({
      pathname: "/userRouter/product-detail",
      params: {
        id: productId,
        name: product.name,
        price: product.averagePrice || product.price,
        image_url: product.images?.[0] || product.image_url,
        description: product.description
      }
    });
  };

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
      setSelectedItems([]);
    } else {
      setSelectedItems(favorites.map((item) => getProductId(item)));
    }
  };

  const handleAddSelectedToCart = () => {
    if (selectedItems.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn sản phẩm để thêm vào giỏ hàng!");
      return;
    }

    const selectedProducts = favorites.filter((item) => selectedItems.includes(getProductId(item)));

    selectedProducts.forEach((product) => {
      const defaultSize = product.variants?.[0]?.sizes?.[0]?.size || "default";
      const defaultColor = product.variants?.[0]?.color || "default";
      // Tạo uniqueId để tránh trùng lặp trong giỏ hàng
      const uniqueId = `${getProductId(product)}-${defaultSize}-${defaultColor}`;
      addToCart({ ...product, uniqueId }, 1, defaultSize, defaultColor);
    });

    Alert.alert("Thành công", "Đã thêm sản phẩm vào giỏ hàng", [
      { text: "Tiếp tục", style: "cancel" },
      { text: "Xem giỏ hàng", onPress: () => router.push("/userRouter/(tabs)/cart") },
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
                  isSelected={selectedItems.includes(getProductId(item))}
                  onSelect={handleSelectItem}
                  onRemove={handleRemoveItem}
                  onPress={() => handleProductPress(item)}
                />
              )}
              keyExtractor={(item, index) => getProductId(item)?.toString() || `favorite-${index}`}
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

export default FavouriteScreen;