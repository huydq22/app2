import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const { width } = Dimensions.get("window")

export default function BannerCarousel({ banners }) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (banners && banners.length > 1) {
      // Auto scroll every 3 seconds
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % banners.length
          flatListRef.current?.scrollToIndex({
            index: nextIndex,
            animated: true,
          })
          return nextIndex
        })
      }, 3000)

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [banners])

  const handleBannerPress = (banner) => {
    console.log('Banner pressed:', banner.id); // Debug log
    
    router.push({
      pathname: '/userRouter/banner-detail',
      params: { 
        banner_id: banner.id,
        title: banner.title || banner.name,
        image_url: banner.image
      }
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0)
    }
  }).current

  const renderBanner = ({ item }) => (
    <TouchableOpacity style={styles.bannerContainer} onPress={() => handleBannerPress(item)}>
      <View style={styles.banner}>
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>Giảm giá</Text>
          <Text style={styles.subtitle}>lên tới</Text>
          <Text style={styles.discount}>70%</Text>
        </View>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      </View>
    </TouchableOpacity>
  )

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {banners.map((_, index) => (
        <View key={index} style={[styles.dot, index === currentIndex && styles.activeDot]} />
      ))}
    </View>
  )

  if (!banners || banners.length === 0) {
    return null
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        getItemLayout={(data, index) => ({
          length: width - 32,
          offset: (width - 32) * index,
          index,
        })}
      />
      {banners.length > 1 && renderDots()}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bannerContainer: {
    width: width - 32,
    marginRight: 0,
  },
  banner: {
    height: 160,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  textContainer: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 1,
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  discount: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
  },
  image: {
    position: "absolute",
    right: 0,
    top: 0,
    width: width * 0.6,
    height: 160,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "white",
    width: 20,
  },
})