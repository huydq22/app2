import { loginStart, loginSuccess, loginFailure } from '../reducers/userSlice';
import { loginUser } from '../../api/userApi';

// Giả lập API login
export const login = (email, password) => async (dispatch) => {
  console.log('--- Bắt đầu quá trình đăng nhập ---');
  dispatch(loginStart());
  try {
    console.log(`Đang gửi yêu cầu đăng nhập cho email: ${email}`);
    const userData = await loginUser(email, password);
    console.log('Đăng nhập thành công, dữ liệu nhận được:', userData);
    dispatch(loginSuccess(userData));
  } catch (error) {
    const errorMessage = error.message || 'Lỗi không xác định';
    console.error('Đăng nhập thất bại, lỗi:', errorMessage);
    dispatch(loginFailure(errorMessage));
  }
}; 