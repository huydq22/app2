const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getBanners = async () => {
  await delay(200);
  try {
    const banners = [
      {
        id: 1,
        title: "Khuyến mãi mùa hè",
        image: "https://down-vn.img.susercontent.com/file/vn-11134201-7ras8-mb6l778p00d492.webp",
        link: "/banner/1"
      },
      {
        id: 2,
        title: "Bộ sưu tập mới",
        image: "https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-ltup5hkcy6ml6b.webp",
        link: "/banner/2"
      }
    ];
    return banners;
  } catch (error) {
    console.error("Get banners error:", error.message);
    return [];
  }
};

export const getBannerById = async (id) => {
  await delay(200);
  try {
    const banners = await getBanners();
    const banner = banners.find(b => b.id === parseInt(id));
    if (!banner) {
      throw new Error(`Banner not found for ID: ${id}`);
    }
    return banner;
  } catch (error) {
    console.error(`Get banner ${id} error:`, error.message);
    throw error;
  }
}; 