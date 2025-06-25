import { createAsyncThunk } from '@reduxjs/toolkit';
import { getFeaturedProducts, getLatestProducts, getProducts, getRecommendedProducts } from '../../api/productApi';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await getProducts();
    return response;
  }
);

export const fetchLatestProducts = createAsyncThunk(
  'products/fetchLatestProducts',
  async () => {
    const response = await getLatestProducts();
    return response;
  }
);

export const fetchRecommendedProducts = createAsyncThunk(
  'products/fetchRecommendedProducts',
  async () => {
    const response = await getRecommendedProducts();
    return response;
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async () => {
    const response = await getFeaturedProducts();
    return response;
  }
); 