import { forgotPasswordStart, forgotPasswordSuccess, forgotPasswordFailure } from '../reducers/forgotPasswordSlice';
import { forgotPasswordUser } from '../../api/forgotPasswordApi';

export const forgotPassword = (email) => async (dispatch) => {
  console.log('--- Bắt đầu quá trình quên mật khẩu ---');
  dispatch(forgotPasswordStart());
  try {
    console.log(`Đang gửi yêu cầu quên mật khẩu cho email: ${email}`);
    const result = await forgotPasswordUser(email);
    console.log('Quên mật khẩu thành công, kết quả:', result);
    dispatch(forgotPasswordSuccess(result));
  } catch (error) {
    const errorMessage = error.message || 'Lỗi không xác định';
    console.error('Quên mật khẩu thất bại, lỗi:', errorMessage);
    dispatch(forgotPasswordFailure(errorMessage));
  }
}; 