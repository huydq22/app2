import { configureStore } from '@reduxjs/toolkit';
import bannersReducer from './reducers/bannersSlice';
import categoriesReducer from './reducers/categoriesSlice';
import productsReducer from './reducers/productsSlice';
import userReducer from './reducers/userSlice';
import signupReducer from './reducers/signupSlice';
import forgotPasswordReducer from './reducers/forgotPasswordSlice';

const store = configureStore({
  reducer: {
    banners: bannersReducer,
    categories: categoriesReducer,
    products: productsReducer,
    user: userReducer,
    signup: signupReducer,
    forgotPassword: forgotPasswordReducer
  },
});


export default store; 