import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getCategories } from '../../api/categoryApi';
import { getProductsByCategory } from '../../api/productApi';

const categoryIcons = {
  Nam: "👔",
  Nữ: "👗",
  "Phụ kiện": "👕",
  "Mùa Hè": "☀️",
  "Mùa Thu": "🎈",
  Thêm: "⊞",
  Unisex: "👚",
};

const Category = () => {
  const { categoryId, categoryName } = useLocalSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(categoryId || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProductsByCategory(categoryId || null),
          getCategories(),
        ]);
        // Lọc các sản phẩm hợp lệ
        const validProducts = productsData.filter((p) => p && (p.id || p.product_id));
        setProducts(validProducts);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [categoryId]);

  const handleCategorySelect = (category) => {
    // Toggle category: if same category is selected, show all products
    setSelectedCategoryId((prev) =>
      prev === category.category_id.toString() ? null : category.category_id.toString()
    );
  };

  const formatPrice = (price) => {
    if (typeof price === 'string' && price.includes(' - ')) {
      const [minPrice] = price.split(' - ');
      return `${parseInt(minPrice).toLocaleString('vi-VN')} Đ`;
    }
    return `${parseInt(price).toLocaleString('vi-VN')} Đ`;
  };

  const handleProductPress = (product) => {
    console.log("Navigating to product ID:", product.id);
    
    // Navigate tới file product-detail có sẵn và truyền id qua params
    router.push({
      pathname: '/guestRouter/product-detail',
      params: { 
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        description: product.description
      }
    });
  };

  const renderProductItem = ({ item: product }) => {
    return (
      <TouchableOpacity
        style={[styles.productContainer, styles.verticalContainer]}
        onPress={() => handleProductPress(product)}
      >
        <View style={[styles.imageContainer, styles.verticalImage]}>
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.description} numberOfLines={2}>
            {product.description}
          </Text>
          <Text style={styles.price}>
            {formatPrice(product.price)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Filter products based on selected category
  const filteredProducts = selectedCategoryId
    ? products.filter(
        (product) => product.category_id.toString() === selectedCategoryId.toString()
      )
    : products;

  // Filter top-level categories for horizontal filter
  const displayCategories = categories.filter((cat) => cat.parent_category_id === null);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator size="large" color="#41C4E1" style={styles.loading} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Back Button and Title */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sản Phẩm</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.container}>
        {/* Horizontal Category Filter */}
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContainer}
          >
            {displayCategories.map((category) => (
              <TouchableOpacity
                key={category.category_id}
                style={[
                  styles.categoryItem,
                  selectedCategoryId === category.category_id.toString() &&
                    styles.selectedCategoryItem,
                ]}
                onPress={() => handleCategorySelect(category)}
              >
                <View
                  style={[
                    styles.iconContainer,
                    selectedCategoryId === category.category_id.toString() &&
                      styles.selectedIconContainer,
                  ]}
                >
                  <Text style={styles.icon}>
                    {categoryIcons[category.name] || categoryIcons.default}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.label,
                    selectedCategoryId === category.category_id.toString() &&
                      styles.selectedLabel,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product List */}
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => (item ? item.id?.toString() || item.product_id?.toString() : Math.random().toString())}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>Không có sản phẩm nào</Text>
            </View>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  headerPlaceholder: {
    width: 24,
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  filterSection: {
    paddingVertical: 8,
  },
  filterScrollContainer: {
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 16,
  },
  selectedCategoryItem: {
    // Optional: Add styling for selected category item
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "white",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedIconContainer: {
    backgroundColor: "#41C4E1",
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  selectedLabel: {
    color: "#000",
    fontWeight: "bold",
  },
  productRow: {
    justifyContent: "space-between",
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
  // Product card styles (merged from ProductCard component)
  productContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  verticalContainer: {
    width: "48%",
  },
  imageContainer: {
    backgroundColor: Colors.lightGray,
  },
  verticalImage: {
    height: 160,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    padding: 8,
  },
  description: {
    fontSize: 12,
    color: Colors.gray,
    lineHeight: 16,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
});

export default Category;