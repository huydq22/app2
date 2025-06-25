import BannerCarousel from "@/components/banners/BannerCarousel";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductSection from "@/components/home/ProductSection";
import SearchBar from "@/components/home/SearchBar";
import { Colors } from "@/constants/Colors";
import { fetchBanners } from '@/redux/actions/bannersActions';
import { fetchCategories } from '@/redux/actions/categoriesActions';
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFeaturedProducts,
  fetchLatestProducts,
  fetchProducts,
  fetchRecommendedProducts
} from '../../../redux/actions/productsActions';

function HomeScreen() {
  const dispatch = useDispatch();
  const { products, latestProducts, recommendedProducts, featuredProducts, loading: productsLoading } = useSelector(state => state.products);
  const { categories, loading: categoriesLoading } = useSelector(state => state.categories);
  const { data: banners, loading: bannersLoading } = useSelector(state => state.banners);


  const loading = productsLoading || categoriesLoading || bannersLoading;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(fetchProducts()),
        dispatch(fetchLatestProducts()),
        dispatch(fetchRecommendedProducts()),
        dispatch(fetchFeaturedProducts()),
        dispatch(fetchCategories()),
        dispatch(fetchBanners()),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LinearGradient
          colors={[Colors.primary, "rgba(255,255,255,0.9)", "white"]}
          style={styles.container}
        >
          <View style={styles.searchBarContainer}>
            <SearchBar />
          </View>
          <BannerCarousel banners={banners || []} />
          <CategoryGrid categories={categories} />
          <View style={styles.content}>
            <ProductSection title="Mới nhất" products={latestProducts} showArrow={true} horizontal={true} />
            <ProductSection title="Sản phẩm nổi bật" products={recommendedProducts} showStar={true} horizontal={false} />
          </View>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 10,
  },
  container: {
    flex: 1,
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});

export default HomeScreen;