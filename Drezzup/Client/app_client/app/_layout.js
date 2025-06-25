import { Stack } from "expo-router";
import { Provider } from 'react-redux';
import store from '../redux/store';

const RootLayout = () => {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="welcome"
      >
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="userRouter" options={{ headerShown: false }} />
        <Stack.Screen name="guestRouter" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
};

export default RootLayout;