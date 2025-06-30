import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  loading: false,
  error: null,
  isSignedUp: false,
};

const signupSlice = createSlice({
  name: 'signup',
  initialState,
  reducers: {
    signupStart(state) {
      console.log('Reducer: Bắt đầu đăng ký');
      state.loading = true;
      state.error = null;
      state.isSignedUp = false;
    },
    signupSuccess(state, action) {
      console.log('Reducer: Đăng ký thành công, user data:', action.payload);
      state.loading = false;
      state.user = action.payload;
      state.isSignedUp = true;
      state.error = null;
    },
    signupFailure(state, action) {
      console.log('Reducer: Đăng ký thất bại, error:', action.payload);
      state.loading = false;
      state.error = action.payload;
      state.isSignedUp = false;
    },
    resetSignup(state) {
      console.log('Reducer: Reset signup state');
      state.user = null;
      state.loading = false;
      state.error = null;
      state.isSignedUp = false;
    },
  },
});

export const { signupStart, signupSuccess, signupFailure, resetSignup } = signupSlice.actions;
export default signupSlice.reducer; 