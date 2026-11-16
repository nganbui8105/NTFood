// 1. Kiểu dữ liệu Món ăn (Food)
export interface Food {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Cơm' | 'Bún/Phở' | 'Trà sữa' | 'Ăn vặt' | 'Healthy';
  rating: number;
  sold: number;
  calories: number;
  tags: string[]; // Dùng cho AI lọc gợi ý món ăn
}

// 2. Kiểu dữ liệu Quán ăn (Restaurant)
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  image: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  category: string;
  isVerified: boolean;
}

// 3. Kiểu dữ liệu Món trong Giỏ hàng (CartItem)
export interface CartItem {
  food: Food;
  quantity: number;
  size: 'S' | 'M' | 'L';
  selectedToppings: string[];
  note: string;
}

// 4. Kiểu dữ liệu Mã giảm giá (Voucher)
export interface Voucher {
  id: string;
  code: string;
  title: string;
  discountAmount: number;
  minOrderValue: number;
}

// 5. Kiểu dữ liệu Đơn hàng (Order)
export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: 'COD' | 'MoMo' | 'ZaloPay';
  status: 'Đã nhận đơn' | 'Đang chuẩn bị' | 'Đang giao hàng' | 'Hoàn thành';
}

// 6. Kiểu dữ liệu Người dùng (User)
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

// 7. Danh sách đúng 12 màn hình của ứng dụng để điều hướng (Navigation)
export type RootStackParamList = {
  SplashWelcome: undefined;                        // Màn hình 1: Chào mừng
  Login: undefined;                                // Màn hình 2: Đăng nhập
  Register: undefined;                             // Màn hình 3: Đăng ký
  MainTabs: undefined;                             // Cụm Tab chính (chứa Màn 4, 5, 6, 11, 12)
  Home: undefined;                                 // Màn hình 4: Trang chủ ShopeeFood
  SearchFilter: { initialCategory?: string };      // Màn hình 5: Tìm kiếm & Lọc
  AIChatAdvisor: undefined;                        // Màn hình 6: AI Gợi ý món ăn
  RestaurantDetail: { restaurantId: string };      // Màn hình 7: Chi tiết quán ăn
  FoodDetail: { food: Food };                      // Màn hình 8: Chi tiết món & Chọn size/topping
  Cart: undefined;                                 // Màn hình 9: Giỏ hàng & Voucher
  Checkout: undefined;                             // Màn hình 10: Thanh toán đặt đơn
  OrderTracking: { orderId?: string };             // Màn hình 11: Theo dõi đơn & Lịch sử
  ProfileFavorites: undefined;                     // Màn hình 12: Hồ sơ & Quán yêu thích
};