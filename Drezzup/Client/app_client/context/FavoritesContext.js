import AsyncStorage from "@react-native-async-storage/async-storage"
import { createContext, useContext, useEffect, useState } from "react"

const FavoritesContext = createContext()

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem("favorites")
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites)
        console.log("Loaded favorites:", parsedFavorites)
        setFavorites(parsedFavorites)
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
    }
  }

  const saveFavorites = async (newFavorites) => {
    try {
      console.log("Saving favorites:", newFavorites)
      await AsyncStorage.setItem("favorites", JSON.stringify(newFavorites))
      setFavorites(newFavorites)
    } catch (error) {
      console.error("Error saving favorites:", error)
    }
  }

  const addToFavorites = (product) => {
    console.log("Adding to favorites:", product)
    // Kiểm tra xem sản phẩm đã tồn tại chưa
    const productId = product._id || product.id || product.product_id
    const existingIndex = favorites.findIndex(item => {
      const itemId = item._id || item.id || item.product_id
      return itemId === productId
    })
    
    if (existingIndex === -1) {
      // Chuẩn hóa dữ liệu sản phẩm trước khi lưu
      const normalizedProduct = {
        _id: product._id || product.id || product.product_id,
        id: product._id || product.id || product.product_id, // Giữ lại id để tương thích
        name: product.name,
        brand: product.brand,
        averagePrice: product.averagePrice || product.price,
        price: product.averagePrice || product.price, // Giữ lại price để tương thích
        images: product.images || [],
        image_url: product.images?.[0] || product.image_url, // Giữ lại image_url để tương thích
        description: product.description,
        variants: product.variants || [],
        countInStock: product.countInStock || 0,
        rating: product.rating || 0
      }
      
      const newFavorites = [...favorites, normalizedProduct]
      saveFavorites(newFavorites)
    } else {
      console.log("Product already in favorites")
    }
  }

  const removeFromFavorites = (productId) => {
    console.log("Removing from favorites:", productId)
    const newFavorites = favorites.filter((item) => {
      const itemId = item._id || item.id || item.product_id
      return itemId !== productId
    })
    saveFavorites(newFavorites)
  }

  const isFavorite = (productId) => {
    return favorites.some((item) => {
      const itemId = item._id || item.id || item.product_id
      return itemId === productId
    })
  }

  const toggleFavorite = (product) => {
    const productId = product._id || product.id || product.product_id
    if (isFavorite(productId)) {
      removeFromFavorites(productId)
    } else {
      addToFavorites(product)
    }
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}
