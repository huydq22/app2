import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const categoryIcons = {
  "Thời trang": "👔",
  Nam: "👔",
  Nữ: "👗",
  "Phụ kiện": "👕",
  "Mùa Hè": "☀️",
  "Mùa Thu": "🎈",
  Thêm: "⊞",
  Unisex: "👚",
};

export default function CategoryGrid({ categories }) {
  const router = useRouter();

  const handleCategory = async (category) => {
    try {
      router.push("/userRouter/category");
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  // Tạo categories mặc định nếu không có categories từ API
  const defaultCategories = [
    { category_id: "68579dd417d49dec5a62e240", name: "Thời trang", description: "", image_url: "", parent_category_id: null },
    { category_id: 999, name: "Unisex", description: "", image_url: "", parent_category_id: null },
    { category_id: 1000, name: "Mùa Hè", description: "", image_url: "", parent_category_id: null },
    { category_id: 1001, name: "Mùa Thu", description: "", image_url: "", parent_category_id: null },
    { category_id: 1002, name: "Thêm", description: "", image_url: "", parent_category_id: null },
  ];

  const displayCategories = categories && categories.length > 0 
    ? [
        ...categories.filter((cat) => cat.parent_category_id === null).slice(0, 2),
        { category_id: 999, name: "Unisex", description: "", image_url: "", parent_category_id: null },
        { category_id: 1000, name: "Mùa Hè", description: "", image_url: "", parent_category_id: null },
        { category_id: 1001, name: "Mùa Thu", description: "", image_url: "", parent_category_id: null },
        { category_id: 1002, name: "Thêm", description: "", image_url: "", parent_category_id: null },
      ]
    : defaultCategories;

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {displayCategories.map((category) => (
          <TouchableOpacity
            key={category.category_id}
            style={styles.categoryItem}
            onPress={() => handleCategory(category)}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{categoryIcons[category.name] || "📦"}</Text>
            </View>
            <Text style={styles.label}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  grid: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: "white",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
})