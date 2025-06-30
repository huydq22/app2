import { signupStart, signupSuccess, signupFailure } from '../reducers/signupSlice';
import { signupUser } from '../../api/signupApi';

export const signup = (name, email, password) => async (dispatch) => {
  console.log('--- Bắt đầu quá trình đăng ký ---');
  dispatch(signupStart());
  try {
    console.log(`Đang gửi yêu cầu đăng ký cho: ${name} (${email})`);
    const userData = await signupUser(name, email, password);
    console.log('Đăng ký thành công, dữ liệu nhận được:', userData);
    dispatch(signupSuccess(userData));
  } catch (error) {
    const errorMessage = error.message || 'Lỗi không xác định';
    console.error('Đăng ký thất bại, lỗi:', errorMessage);
    dispatch(signupFailure(errorMessage));
  }
}; 