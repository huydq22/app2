// screens/SearchScreen.js
import { getProducts } from '@/api/productApi';
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Header Component (assuming it's a common component)
function Header({ title, showBackButton = false, onBack }) {
  return (
    <View style={headerStyles.container}>
      {showBackButton && (
        <TouchableOpacity onPress={onBack} style={headerStyles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
      )}
      <Text style={headerStyles.title}>{title}</Text>
    </View>
  );
}

// SearchHeader Component
function SearchHeader({ title, onBack }) {
  return <Header title={title} showBackButton={true} onBack={onBack} />;
}

// SearchInput Component
function SearchInput({ value, onChangeText, onClear, placeholder = "Tìm kiếm..." }) {
  return (
    <View style={searchInputStyles.container}>
      <View style={searchInputStyles.inputContainer}>
        <TextInput
          style={searchInputStyles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          autoFocus
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={onClear} style={searchInputStyles.clearButton}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={searchInputStyles.searchButton} onPress={() => onChangeText(value)}>
        <Ionicons name="search" size={20} color={Colors.text} />
      </TouchableOpacity>
    </View>
  );
}

// SearchResults Component
function SearchResults({ products }) {
  const router = useRouter();

  if (products.length === 0) {
    return (
      <View style={searchResultsStyles.emptyContainer}>
        <Text style={searchResultsStyles.emptyText}>Không tìm thấy sản phẩm nào</Text>
      </View>
    );
  }

  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes(' - ')) {
      const [minPrice] = price.split(' - ');
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(minPrice));
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.variants && product.variants.length > 0 && product.variants[0].image) {
      return product.variants[0].image;
    }
    return "https://via.placeholder.com/80";
  };

  const handlePress = (item) => {
    console.log("Navigating to product ID:", item._id);
    
    router.push({
      pathname: '/guestRouter/product-detail',
      params: {
        id: item._id,
        name: item.name,
        price: item.averagePrice,
        image_url: getProductImage(item),
        description: item.description
      }
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={searchResultsStyles.resultItem}
      onPress={() => handlePress(item)}
    >
      <Image
        source={{
          uri: getProductImage(item),
        }}
        style={searchResultsStyles.resultImage}
        onError={() => console.warn(`Failed to load image for product ${item._id}`)}
      />
      <View style={searchResultsStyles.resultInfo}>
        <Text style={searchResultsStyles.resultName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={searchResultsStyles.resultBrand} numberOfLines={1}>
          {item.brand}
        </Text>
        <Text style={searchResultsStyles.resultPrice}>{formatPrice(item.averagePrice)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item._id.toString()}
      contentContainerStyle={searchResultsStyles.listContainer}
      showsVerticalScrollIndicator={false}
    />
  );
}

// SuggestedList Component
function SuggestedList({ products }) {
  const router = useRouter();

  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes(' - ')) {
      const [minPrice] = price.split(' - ');
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(minPrice));
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.variants && product.variants.length > 0 && product.variants[0].image) {
      return product.variants[0].image;
    }
    return "https://via.placeholder.com/150";
  };

  const handlePress = (item) => {
    console.log("Navigating to product ID:", item._id);
    
    router.push({
      pathname: '/guestRouter/product-detail',
      params: {
        id: item._id,
        name: item.name,
        price: item.averagePrice,
        image_url: getProductImage(item),
        description: item.description
      }
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={suggestedListStyles.suggestedItem}
      onPress={() => handlePress(item)}
    >
      <Image
        source={{
          uri: getProductImage(item),
        }}
        style={suggestedListStyles.suggestedImage}
        onError={() => console.warn(`Failed to load image for product ${item._id}`)}
      />
      <Text style={suggestedListStyles.suggestedName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={suggestedListStyles.suggestedBrand} numberOfLines={1}>
        {item.brand}
      </Text>
      <Text style={suggestedListStyles.suggestedPrice}>{formatPrice(item.averagePrice)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={suggestedListStyles.container}>
      <Text style={suggestedListStyles.sectionTitle}>Danh sách gợi ý</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item, index) => item._id ? item._id.toString() : `product-${index}`}
        numColumns={2}
        columnWrapperStyle={suggestedListStyles.row}
      />
    </View>
  );
}

// Main SearchScreen Component
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
};

// Styles
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

const headerStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
});

const searchInputStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    height: 40,
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
});

const searchResultsStyles = StyleSheet.create({
  listContainer: {
    paddingVertical: 12,
  },
  resultItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  resultInfo: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: "center",
  },
  resultName: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
    fontWeight: "500",
  },
  resultBrand: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  resultPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
  },
});

const suggestedListStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 16,
  },
  row: {
    justifyContent: "space-between",
  },
  suggestedItem: {
    width: "48%",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestedImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  suggestedName: {
    fontSize: 14,
    color: Colors.text,
    padding: 8,
    paddingBottom: 2,
    fontWeight: "500",
  },
  suggestedBrand: {
    fontSize: 12,
    color: Colors.gray,
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  suggestedPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});

export default SearchScreen;