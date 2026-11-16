import axios from 'axios';
import { Food, Order, Restaurant, Voucher } from '../types';

// Thay URL MockAPI của bạn vào đây (Nếu chưa kịp tạo trên MockAPI.io, app vẫn chạy mượt nhờ dữ liệu dự phòng bên dưới)
export const MOCK_API_BASE_URL = 'https://6af6f65be844c7ff741bd3c1.mockapi.io';

export const axiosClient = axios.create({
  baseURL: MOCK_API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dữ liệu Quán ăn chuẩn ShopeeFood
export const FALLBACK_RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Cơm Tấm Phúc Lộc Thọ - Nguyễn Gia Trí',
    address: '236 Nguyễn Gia Trí, Q. Bình Thạnh, TP.HCM',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
    rating: 4.8,
    deliveryTime: '15-20 phút',
    distance: '1.2 km',
    category: 'Cơm',
    isVerified: true,
  },
  {
    id: 'r2',
    name: 'Trà Sữa Koi Thé - Phan Xích Long',
    address: '198 Phan Xích Long, Q. Phú Nhuận, TP.HCM',
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&q=80',
    rating: 4.9,
    deliveryTime: '10-15 phút',
    distance: '0.8 km',
    category: 'Trà sữa',
    isVerified: true,
  },
  {
    id: 'r3',
    name: 'Bún Bò Huế Đông Ba - Lê Quang Định',
    address: '45 Lê Quang Định, Q. Bình Thạnh, TP.HCM',
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80',
    rating: 4.7,
    deliveryTime: '20-25 phút',
    distance: '1.9 km',
    category: 'Bún/Phở',
    isVerified: true,
  },
  {
    id: 'r4',
    name: 'Green Bowl - Salad & Eat Clean',
    address: '88 Điện Biên Phủ, Q. Bình Thạnh, TP.HCM',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    rating: 4.9,
    deliveryTime: '15-20 phút',
    distance: '1.5 km',
    category: 'Healthy',
    isVerified: true,
  },
];

// Dữ liệu Món ăn chuẩn ShopeeFood (Có thông số calories & tags phục vụ AI gợi ý)
export const FALLBACK_FOODS: Food[] = [
  {
    id: 'f1',
    restaurantId: 'r1',
    restaurantName: 'Cơm Tấm Phúc Lộc Thọ - Nguyễn Gia Trí',
    name: 'Cơm Sườn Nướng Bì Chả Trứng Ốp La',
    description: 'Sườn cốt lết nướng than hoa thơm lừng, kèm bì thính, chả hấp và đồ chua.',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=80',
    category: 'Cơm',
    rating: 4.9,
    sold: 1420,
    calories: 650,
    tags: ['no lâu', 'bữa trưa', 'bữa tối', 'giàu đạm', 'cơm'],
  },
  {
    id: 'f2',
    restaurantId: 'r1',
    restaurantName: 'Cơm Tấm Phúc Lộc Thọ - Nguyễn Gia Trí',
    name: 'Cơm Đùi Gà Rô Ti Mật Ong',
    description: 'Đùi gà góc tư rim nước dừa tươi và mật ong mềm thấm vị.',
    price: 49000,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80',
    category: 'Cơm',
    rating: 4.7,
    sold: 890,
    calories: 580,
    tags: ['no lâu', 'bữa trưa', 'giá rẻ', 'gà', 'cơm'],
  },
  {
    id: 'f3',
    restaurantId: 'r2',
    restaurantName: 'Trà Sữa Koi Thé - Phan Xích Long',
    name: 'Trà Sữa Trân Châu Hoàng Kim',
    description: 'Hồng trà Assam hòa quyện sữa thơm béo cùng trân châu hoàng kim dẻo mềm.',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=600&q=80',
    category: 'Trà sữa',
    rating: 4.9,
    sold: 2300,
    calories: 380,
    tags: ['giải khát', 'ngọt', 'buổi chiều', 'trà sữa', 'vui vẻ'],
  },
  {
    id: 'f4',
    restaurantId: 'r2',
    restaurantName: 'Trà Sữa Koi Thé - Phan Xích Long',
    name: 'Hồng Trà Macchiato Ít Đường',
    description: 'Lớp kem phô mai mặn béo nhẹ phủ trên nền hồng trà thanh mát.',
    price: 42000,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&q=80',
    category: 'Trà sữa',
    rating: 4.8,
    sold: 1120,
    calories: 260,
    tags: ['giải khát', 'ít ngọt', 'tỉnh táo', 'trà sữa'],
  },
  {
    id: 'f5',
    restaurantId: 'r3',
    restaurantName: 'Bún Bò Huế Đông Ba - Lê Quang Định',
    name: 'Bún Bò Huế Đặc Biệt (Nạm, Gân, Chả Cua)',
    description: 'Nước dùng hầm xương bò đậm đà hương sả ruốc Huế, đầy ắp thịt nạm và chả cua.',
    price: 52000,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=80',
    category: 'Bún/Phở',
    rating: 4.8,
    sold: 1650,
    calories: 520,
    tags: ['nóng hổi', 'ngày mưa', 'cay', 'bữa sáng', 'bữa trưa', 'bún'],
  },
  {
    id: 'f6',
    restaurantId: 'r4',
    restaurantName: 'Green Bowl - Salad & Eat Clean',
    name: 'Salad Ức Gà Áp Chảo & Trứng Lòng Đào',
    description: 'Ức gà ướp thảo mộc mềm mọng, rau xanh hữu cơ, bắp ngọt và sốt mè rang.',
    price: 48000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    category: 'Healthy',
    rating: 4.9,
    sold: 980,
    calories: 310,
    tags: ['ít calo', 'giảm cân', 'eat clean', 'giàu đạm', 'healthy', 'nhẹ bụng'],
  },
  {
    id: 'f7',
    restaurantId: 'r4',
    restaurantName: 'Green Bowl - Salad & Eat Clean',
    name: 'Cơm Gạo Lứt Cá Hồi Áp Chảo',
    description: 'Gạo lứt dẻo, cá hồi giàu Omega-3, bông cải xanh hấp và cà rốt.',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80',
    category: 'Healthy',
    rating: 4.9,
    sold: 740,
    calories: 410,
    tags: ['ít calo', 'giảm cân', 'eat clean', 'giàu đạm', 'healthy'],
  },
  {
    id: 'f8',
    restaurantId: 'r2',
    restaurantName: 'Trà Sữa Koi Thé - Phan Xích Long',
    name: 'Combo Gà Rán Giòn Cay & Khoai Tây Lắc Phô Mai',
    description: 'Miếng gà rán giòn rụm kèm khoai tây chiên lắc bột phô mai thơm béo.',
    price: 39000,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80',
    category: 'Ăn vặt',
    rating: 4.7,
    sold: 1540,
    calories: 540,
    tags: ['ăn vặt', 'giá rẻ', 'cay', 'buổi chiều', 'gà rán'],
  },
];

export const AVAILABLE_VOUCHERS: Voucher[] = [
  { id: 'v1', code: 'FREESHIP15K', title: 'Miễn phí giao hàng 15.000đ', discountAmount: 15000, minOrderValue: 40000 },
  { id: 'v2', code: 'SHOPEE20K', title: 'Giảm 20.000đ cho đơn từ 80.000đ', discountAmount: 20000, minOrderValue: 80000 },
  { id: 'v3', code: 'BANMOI30K', title: 'Giảm 30.000đ cho đơn từ 120.000đ', discountAmount: 30000, minOrderValue: 120000 },
];

// Hàm gọi Axios lấy danh sách món ăn từ MockAPI (Nếu API lỗi hoặc chưa tạo bảng, tự động trả về dữ liệu chuẩn)
export const fetchFoodsFromApi = async (): Promise<Food[]> => {
  try {
    const response = await axiosClient.get<Food[]>('/foods');
    if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].restaurantId) {
      return response.data;
    }
    return FALLBACK_FOODS;
  } catch {
    return FALLBACK_FOODS;
  }
};

// Hàm gọi Axios gửi đơn hàng mới lên MockAPI
export const postOrderToApi = async (newOrder: Omit<Order, 'id'>): Promise<Order> => {
  try {
    const response = await axiosClient.post<Order>('/orders', newOrder);
    return response.data;
  } catch {
    return {
      ...newOrder,
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
    };
  }
};