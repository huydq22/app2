import axios from 'axios';

const BASE_URL = "https://fizennn.click";

export const signupUser = async (name, email, password) => {
  console.log('Gọi API đăng ký:', `${BASE_URL}/v1/auth/register`);
  console.log('Payload:', { name, email, password });
  
  try {
    const response = await axios.post(`${BASE_URL}/v1/auth/register`, { name, email, password });
    console.log('API đăng ký thành công, response:', response.data);
    return response.data;
  } catch (error) {
    console.error('API đăng ký thất bại:', error.response?.data || error.message);
    throw error.response?.data || error;
  }
}; 