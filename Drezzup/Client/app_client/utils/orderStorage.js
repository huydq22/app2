import AsyncStorage from '@react-native-async-storage/async-storage';

const ORDERS_STORAGE_KEY = '@my_orders';

export const saveOrder = async (order) => {
  try {
    const existingOrdersJson = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
    let orders = existingOrdersJson ? JSON.parse(existingOrdersJson) : [];

    // Check if the order already exists to prevent duplicates
    const orderExists = orders.some(existingOrder => existingOrder.id === order.id);

    if (!orderExists) {
      // Add new order to the beginning of the array
      orders = [order, ...orders];
      await AsyncStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
      console.log('Order saved successfully!', order);
    } else {
      console.log('Order already exists, skipping save:', order.id);
    }
  } catch (e) {
    console.error('Failed to save order.', e);
  }
};

export const getOrders = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(ORDERS_STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Failed to retrieve orders.', e);
    return [];
  }
};

export const clearOrders = async () => {
  try {
    await AsyncStorage.removeItem(ORDERS_STORAGE_KEY);
    console.log('All orders cleared!');
  } catch (e) {
    console.error('Failed to clear orders.', e);
  }
}; 