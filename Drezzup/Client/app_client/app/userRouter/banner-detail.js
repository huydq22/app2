import { getBannerById } from "@/api/bannerApi";
import Header from "@/components/common/Header";
import { Colors } from "@/constants/Colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BannerDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams(); // Nhận tất cả params
  const banner_id = params.banner_id; // Lấy banner_id từ params
  
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Received params:', params); // Debug log
    console.log('Banner ID:', banner_id); // Debug log
    
    if (banner_id) {
      loadBanner();
    } else {
      console.error('No banner_id received');
      setLoading(false);
    }
  }, [banner_id]);

  const loadBanner = async () => {
    try {
      console.log('Loading banner with ID:', banner_id); // Debug log
      const bannerData = await getBannerById(banner_id);
      console.log('Banner data loaded:', bannerData); // Debug log
      setBanner(bannerData);
    } catch (error) {
      console.error("Error loading banner:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Chi tiết banner" showBackButton={true} onBack={handleBack} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!banner) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Header title="Chi tiết banner" showBackButton={true} onBack={handleBack} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Không tìm thấy banner</Text>
          <Text style={styles.errorText}>Banner ID: {banner_id}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header title={banner.name || "Chi tiết banner"} showBackButton={true} onBack={handleBack} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.bannerImageContainer}>
          <Image source={{ uri: banner.image_url }} style={styles.bannerImage} resizeMode="cover" />
          <View style={styles.discountOverlay}>
            <Text style={styles.discountText}>70%</Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.title}>{banner.title || banner.name}</Text>
          <Text style={styles.description}>{banner.description}</Text>
        </View>
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: Colors.gray,
  },
  errorText: {
    fontSize: 14,
    color: Colors.gray,
    marginTop: 8,
  },
  bannerImageContainer: {
    position: "relative",
    height: 200,
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  discountOverlay: {
    position: "absolute",
    left: 16,
    top: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  discountText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  descriptionContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: Colors.gray,
    lineHeight: 20,
  },
});

export default BannerDetailScreen;