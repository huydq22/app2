import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProductCard from "./ProductCard";

export default function ProductSection({ title, products, showArrow = false, showStar = false, horizontal = false }) {
  const renderItem = ({ item }) => {
    if (!item) return null; 
    return <ProductCard product={item} horizontal={horizontal} />;
  };

  const handleCategoryPress = () => {
    router.push('/userRouter/category')
  }

  const keyExtractor = (item) => (item ? item._id?.toString() || item.id?.toString() || Math.random().toString() : Math.random().toString());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {showStar && <Ionicons name="star" size={20} color={Colors.secondary} />}
        </View>
        {showArrow && (
          <TouchableOpacity style={styles.arrowButton} onPress={handleCategoryPress}>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      {horizontal ? (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          style={styles.gridList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    justifyContent: "space-between",
  },
  horizontalList: {
    paddingLeft: 0,
  },
  separator: {
    width: 12,
  },
  gridList: {
    marginBottom: 0,
  },
});