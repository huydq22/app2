import { CartProvider } from "@/context/CartContext"
import { FavoritesProvider } from "@/context/FavoritesContext"
import { VoucherProvider } from "@/context/VoucherContext"
import { Stack } from "expo-router"
import { SafeAreaProvider } from "react-native-safe-area-context"

const RootLayout = () =>{
  console.log('Rootlayout userRouter component rendered');
  return (
    <SafeAreaProvider>
      <VoucherProvider>
        <FavoritesProvider>
          <CartProvider>
            <Stack screenOptions={{
              headerShown: false,
            }}
              >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="category" />
              <Stack.Screen name="checkout" />
              <Stack.Screen
                name="order-detail"
                options={{
                  headerShown: false,
                  presentation: 'card',
                  animation: 'slide_from_right'
                }}
              />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="signup" options={{ headerShown: false }} />
              <Stack.Screen name="add-voucher" options={{ headerShown: false }} />
              <Stack.Screen name="add-address-screen" options={{ headerShown: false }} />
              <Stack.Screen name="order-success" />
              <Stack.Screen name="orders" />
              <Stack.Screen name="profile-detail" />
              <Stack.Screen name="search" />
              <Stack.Screen name="banner-detail" />
              <Stack.Screen name="product-detail" />
              <Stack.Screen name="review-detail" />
              <Stack.Screen name="chat" options={{ headerShown: false }} />
              <Stack.Screen name="return-exchange" options={{ headerShown: false }} />
              <Stack.Screen name="support-center" options={{ headerShown: false }} />
              <Stack.Screen name="contact-feedback" options={{ headerShown: false }} />
              <Stack.Screen name="privacy-policy" options={{ headerShown: false }} />
              <Stack.Screen name="faq" options={{ headerShown: false }} />
              <Stack.Screen name="vouchers" options={{ headerShown: false }} />
              <Stack.Screen name="payment-methods" options={{ headerShown: false }} />
              <Stack.Screen name="change-password" options={{ headerShown: false }} />
              <Stack.Screen name="language-country" options={{ headerShown: false }} />
              <Stack.Screen name="address" options={{ headerShown: false }} />
              <Stack.Screen name="add-edit" options={{ headerShown: false }} />
            </Stack>
          </CartProvider>
        </FavoritesProvider>
      </VoucherProvider>
    </SafeAreaProvider>
  )
}

export default RootLayout;