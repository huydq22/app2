import { getUserData } from '@/api/userApi';
import Header from "@/components/common/Header";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Add this import

const AddressScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const userData = await getUserData();
      setAddresses(userData.addresses);
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const handleSelectAddress = (address) => {
    router.replace({
      pathname: "/userRouter/checkout",
      params: {
        selectedAddress: JSON.stringify(address),
      },
    });
  };

  const handleBack = () => {
    router.replace("/userRouter/checkout");
  };

  const renderAddressItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.addressItem, item.is_default && styles.defaultAddressItem]}
      onPress={() => handleSelectAddress(item)}
    >
      <View style={styles.addressContent}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{item.recipient_name}</Text>
          <Text style={styles.phone}>• {item.phone}</Text>
          {item.is_default && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Mặc định</Text>
            </View>
          )}
        </View>
        <Text style={styles.addressText}>{item.address}</Text>
        <Text style={styles.country}>{item.country}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => {
            console.log('Edit address:', item);
            router.push({
              pathname: "/userRouter/edit-address-screen",
              params: { address: JSON.stringify(item) },
            });
          }}
        >
          <Ionicons name="create-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <Header 
          title="Địa chỉ của tôi" 
          showBackButton={true} 
          onBack={handleBack} 
        />

        <FlatList
          data={addresses}
          renderItem={renderAddressItem}
          keyExtractor={item => item.address_id.toString()}
          contentContainerStyle={styles.listContainer}
        />

        <View style={styles.bottomContainer}>
          <TouchableOpacity 
            style={styles.addAddressButton}
            onPress={() => {
              console.log('Navigating to add address screen from bottom button...');
              router.navigate({
                pathname: "/userRouter/add-address-screen",
              });
            }}
          >
            <Text style={styles.addAddressButtonText}>Thêm địa chỉ mới</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
    minHeight: 100,
  },
  defaultAddressItem: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  addressContent: {
    flex: 1,
    marginRight: 12,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text,
  },
  phone: {
    fontSize: 16,
    color: Colors.gray,
    marginLeft: 8,
  },
  addressText: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 22,
  },
  country: {
    fontSize: 16,
    color: Colors.gray,
  },
  defaultBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginLeft: 8,
  },
  defaultText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  bottomContainer: {
    padding: 16,
    paddingBottom: 16, // Reduced from 40 to 16
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginBottom: 12,
  },
  addAddressButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addAddressButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  editButton: {
    padding: 8,
  },
});

export default AddressScreen;