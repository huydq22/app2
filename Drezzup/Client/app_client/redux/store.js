import { configureStore } from '@reduxjs/toolkit';
import bannersReducer from './reducers/bannersSlice';
import categoriesReducer from './reducers/categoriesSlice';
import productsReducer from './reducers/productsSlice';

const store = configureStore({
  reducer: {
    banners: bannersReducer,
    categories: categoriesReducer,
    products: productsReducer
  },
});


export default store; 