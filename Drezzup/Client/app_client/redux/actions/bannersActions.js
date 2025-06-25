import { getBanners } from '@/api/bannerApi';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchBanners = createAsyncThunk(
  'banners/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBanners();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch banners');
    }
  }
); 