const BASE_URL = "https://fizennn.click/v1";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getCategories = async () => {
  await delay(300);
  try {
    const response = await fetch(`${BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    const products = data.items || [];
    const categories = [
      {
        category_id: "68579dd417d49dec5a62e240",
        name: "Thời trang",
        image: "https://down-vn.img.susercontent.com/file/vn-11134201-7ras8-mb6l778p00d492.webp",
        parent_category_id: null
      }
    ];
    return categories;
  } catch (error) {
    console.error("Get categories error:", error.message);
    return [];
  }
};

export const getSubCategories = async (categoryId) => {
  await delay(300);
  try {
    return [];
  } catch (error) {
    console.error("Get subcategories error:", error.message);
    return [];
  }
}; 