import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { VoucherProvider } from "@/context/VoucherContext";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RootLayout = () => {
  console.log('Rootlayout guestRouter component rendered');
  return (
    <SafeAreaProvider>
      <VoucherProvider>
        <FavoritesProvider>
          <CartProvider>
            <Stack screenOptions={{
              headerShown: false,
            }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="category" />
              <Stack.Screen name="search" />
              <Stack.Screen name="banner-detail" />
              <Stack.Screen name="product-detail" />
              <Stack.Screen name="chat" options={{ headerShown: false }} />
              <Stack.Screen name="support-center" options={{ headerShown: false }} />
              <Stack.Screen name="contact-feedback" options={{ headerShown: false }} />
              <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
              <Stack.Screen name="faq" options={{ headerShown: false }} />
              <Stack.Screen name="language-country" options={{ headerShown: false }} />
            </Stack>
          </CartProvider>
        </FavoritesProvider>
      </VoucherProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;