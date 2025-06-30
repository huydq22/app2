import axios from 'axios';

const BASE_URL = "https://fizennn.click";

export const forgotPasswordUser = async (email) => {
  console.log('Gọi API quên mật khẩu:', `${BASE_URL}/v1/auth/forgot-password`);
  console.log('Payload:', { email });
  
  try {
    const response = await axios.post(`${BASE_URL}/v1/auth/forgot-password`, { email });
    console.log('API quên mật khẩu thành công, response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API quên mật khẩu thất bại:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
}; 