import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SearchBar() {
  const router = useRouter();

  const handleSearchPress = () => {
    router.push("/userRouter/search");
  };

  const handleNotificationPress = () => {
    router.push("/userRouter/notification");
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.searchInput} onPress={handleSearchPress}>
        <Ionicons name="search" size={20} color={Colors.gray} />
        <Text style={styles.placeholder}>Tìm kiếm</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
        <View style={styles.notificationIcon}>
          <Ionicons name="notifications" size={16} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  placeholder: {
    color: Colors.gray,
    fontSize: 16,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },
})
