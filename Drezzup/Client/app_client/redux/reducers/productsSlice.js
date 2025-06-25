import { createSlice } from '@reduxjs/toolkit';
import {
    fetchFeaturedProducts,
    fetchLatestProducts,
    fetchProducts,
    fetchRecommendedProducts
} from '../actions/productsActions';

const initialState = {
  products: [],
  latestProducts: [],
  recommendedProducts: [],
  featuredProducts: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProducts: (state) => {
      state.products = [];
      state.latestProducts = [];
      state.recommendedProducts = [];
      state.featuredProducts = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch latest products
      .addCase(fetchLatestProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLatestProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.latestProducts = action.payload;
      })
      .addCase(fetchLatestProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch recommended products
      .addCase(fetchRecommendedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendedProducts = action.payload;
      })
      .addCase(fetchRecommendedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch featured products
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearProducts } = productsSlice.actions;
export default productsSlice.reducer; 