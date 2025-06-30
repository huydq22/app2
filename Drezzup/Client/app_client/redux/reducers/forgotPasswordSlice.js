import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  success: false,
  message: null,
};

const forgotPasswordSlice = createSlice({
  name: 'forgotPassword',
  initialState,
  reducers: {
    forgotPasswordStart(state) {
      console.log('Reducer: Bắt đầu quên mật khẩu');
      state.loading = true;
      state.error = null;
      state.success = false;
      state.message = null;
    },
    forgotPasswordSuccess(state, action) {
      console.log('Reducer: Quên mật khẩu thành công, result:', action.payload);
      state.loading = false;
      state.success = true;
      state.message = action.payload?.message || 'Link đặt lại mật khẩu đã được gửi đến email của bạn';
      state.error = null;
    },
    forgotPasswordFailure(state, action) {
      console.log('Reducer: Quên mật khẩu thất bại, error:', action.payload);
      state.loading = false;
      state.error = action.payload;
      state.success = false;
      state.message = null;
    },
    resetForgotPassword(state) {
      console.log('Reducer: Reset forgot password state');
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
    },
  },
});

export const { forgotPasswordStart, forgotPasswordSuccess, forgotPasswordFailure, resetForgotPassword } = forgotPasswordSlice.actions;
export default forgotPasswordSlice.reducer; 