import { Dimensions, FlatList, Image, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");

export default function ProductImageCarousel({ images }) {
  const defaultImage = "https://via.placeholder.com/400";
  const imageUrls = images && images.length > 0 ? images : [defaultImage];

  const renderImage = ({ item }) => (
    <Image
      source={{ uri: item }}
      style={styles.image}
      resizeMode="cover"
      onError={() => console.warn(`Failed to load image: ${item}`)}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={imageUrls}
        renderItem={renderImage}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={width}
        decelerationRate="fast"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: width,
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: width,
    height: width,
  },
});