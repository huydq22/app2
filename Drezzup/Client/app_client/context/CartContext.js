import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem("cart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  const saveCart = async (newCart) => {
    try {
      await AsyncStorage.setItem("cart", JSON.stringify(newCart));
      setCartItems(newCart);
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  };

  const getProductId = (product) => {
    return product._id || product.id || product.product_id;
  };

  const generateCartItemId = (product, selectedSize, selectedColor) => {
    const productId = getProductId(product);
    return `${productId}-${selectedSize || 'no-size'}-${selectedColor || 'no-color'}`;
  };

  const addToCart = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    const cartItemId = generateCartItemId(product, selectedSize, selectedColor);
    
    const existingItemIndex = cartItems.findIndex(
      (item) => item.cartItemId === cartItemId
    );

    const newCart = [...cartItems];

    if (existingItemIndex >= 0) {
      newCart[existingItemIndex] = {
        ...newCart[existingItemIndex],
        quantity: newCart[existingItemIndex].quantity + quantity,
      };
    } else {
      // Chuẩn hóa dữ liệu sản phẩm trước khi thêm vào giỏ hàng
      const normalizedProduct = {
        ...product,
        _id: getProductId(product),
        id: getProductId(product), // Giữ lại id để tương thích
        price: product.averagePrice || product.price,
        image_url: product.images?.[0] || product.image_url,
        cartItemId,
        quantity,
        selectedSize,
        selectedColor,
      };
      
      newCart.push(normalizedProduct);
    }

    saveCart(newCart);
    return true;
  };

  const removeFromCart = (item) => {
    const newCart = cartItems.filter(
      (cartItem) => cartItem.cartItemId !== item.cartItemId
    );
    saveCart(newCart);
  };

  const updateQuantity = (cartItemId, quantity) => {
    const newCart = cartItems.map((item) => {
      if (item.cartItemId === cartItemId) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.averagePrice || item.price;
      return total + (parseInt(price) || 0) * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};