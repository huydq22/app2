import { getProducts } from '@/api/productApi';
import SearchHeader from "@/components/search/SearchHeader";
import SearchInput from "@/components/search/SearchInput";
import SearchResults from "@/components/search/SearchResults";
import SuggestedList from "@/components/search/SuggestedList";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsData = await getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error("Error loading products:", error);
      setError("Không thể tải sản phẩm. Vui lòng kiểm tra kết nối và thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    if (searchQuery.trim() === "") {
      setIsSearching(false);
      return [];
    }
    setIsSearching(true);
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, products]);

  const handleBack = () => {
    router.back();
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <SearchHeader title="Tìm kiếm" onBack={handleBack} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProducts}>
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <SearchHeader title="Tìm kiếm" onBack={handleBack} />
      <SearchInput
        value={searchQuery}
        onChangeText={handleSearch}
        onClear={handleClearSearch}
        placeholder="Tìm kiếm ...."
      />
      <View style={styles.content}>
        {isSearching ? (
          <SearchResults products={filteredProducts} />
        ) : (
          <SuggestedList products={products.slice(0, 6)} />
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
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SearchScreen;