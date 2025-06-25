const BASE_URL = "https://fizennn.click/v1";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getProducts = async () => {
  await delay(500);
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Get products error:", error.message);
    return [];
  }
};

export const getProductById = async (id) => {
  await delay(300);
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const products = data.items || [];
    const product = products.find(p => p._id === id);
    if (!product) {
      throw new Error(`Product not found for ID: ${id}`);
    }
    return product;
  } catch (error) {
    console.error(`Get product ${id} error:`, error.message);
    throw error;
  }
};

export const getFeaturedProducts = async () => {
  await delay(400);
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const products = data.items || [];
    return products.slice(0, 4);
  } catch (error) {
    console.error("Get featured products error:", error.message);
    return [];
  }
};

export const getRecommendedProducts = async () => {
  await delay(400);
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const products = data.items || [];
    return products.slice(0, 6);
  } catch (error) {
    console.error("Get recommended products error:", error.message);
    return [];
  }
};

export const getLatestProducts = async () => {
  await delay(400);
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const products = data.items || [];
    return products
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 6);
  } catch (error) {
    console.error("Get latest products error:", error.message);
    return [];
  }
};

export const getProductsByCategory = async (categoryId) => {
  await delay(400);
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    const products = data.items || [];
    if (!categoryId) {
      return products.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }
    const filteredProducts = products.filter(
      (product) => product.category === categoryId
    );
    return filteredProducts.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  } catch (error) {
    console.error("Get products by category error:", error.message);
    return [];
  }
};

export const searchProducts = async (query) => {
  await delay(400);
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const products = data.items || [];
    if (!query) return products;
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase())
    );
    return filteredProducts;
  } catch (error) {
    console.error("Search products error:", error.message);
    return [];
  }
}; 