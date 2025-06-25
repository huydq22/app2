const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getUserData = async () => {
  await delay(200);
  try {
    const userData = {
      id: 1,
      name: "Nguyễn Văn A",
      email: "user@example.com",
      phone: "0123456789",
      addresses: [
        {
          id: 1,
          address: "123 Đường ABC, Quận 1, TP.HCM",
          is_default: true
        }
      ]
    };
    return userData;
  } catch (error) {
    console.error("Get user data error:", error.message);
    return null;
  }
};

export const getDefaultAddress = async () => {
  await delay(200);
  try {
    const user = await getUserData();
    return user?.addresses?.find((addr) => addr.is_default) || null;
  } catch (error) {
    console.error("Get default address error:", error.message);
    return null;
  }
}; 