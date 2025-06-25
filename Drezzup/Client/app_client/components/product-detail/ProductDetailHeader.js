import { useFavorites } from "@/context/FavoritesContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ProductDetailHeader({ onBack, product }) {
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleFavorite = () => {
    if (product) {
      toggleFavorite(product);
    }
  };

  const isProductFavorite = product ? isFavorite(product._id) : false;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.button}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleFavorite} style={styles.button}>
        <Ionicons name={isProductFavorite ? "heart" : "heart-outline"} size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: "absolute",
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
});