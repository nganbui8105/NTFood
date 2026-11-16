import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, XStack, YStack } from 'tamagui';
import { RootStackParamList } from '../types';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { loadFoodsAsync, setSelectedCategory } from '../redux/foodSlice';
import { FoodCard } from '../components/FoodCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CATEGORIES = [
  { label: 'Tất cả', icon: '🍽️' },
  { label: 'Cơm', icon: '🍚' },
  { label: 'Bún/Phở', icon: '🍜' },
  { label: 'Trà sữa', icon: '🧋' },
  { label: 'Ăn vặt', icon: '🍟' },
  { label: 'Healthy', icon: '🥗' },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const { foods, restaurants, loading, selectedCategory } = useAppSelector((state) => state.food);
  const cartItems = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);

  // RESPONSIVE: Tự động nhận diện khi quay ngang màn hình hoặc mở trên Tablet / iPad
  const { width } = useWindowDimensions(); 

  const insets = useSafeAreaInsets();
  const topSpacing = Math.max(insets.top, Platform.OS === 'android' ? StatusBar.currentHeight || 32 : 0) + 10;

  const numColumns = width >= 900 ? 3 : width >= 600 ? 2 : 1;

  useEffect(() => {
    dispatch(loadFoodsAsync());
  }, [dispatch]);

  const filteredFoods =
    selectedCategory === 'Tất cả'
      ? foods
      : foods.filter((item) => item.category === selectedCategory);

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <YStack flex={1} backgroundColor="#F5F5F7">
      {/* Header cam chuẩn ShopeeFood */}
      <YStack backgroundColor="#EE4D2D" paddingHorizontal={16} paddingTop={topSpacing} paddingBottom={14} gap={10}>
        <XStack justifyContent="space-between" alignItems="center">
          <YStack flex={1}>
            <Text fontSize={11} color="#FFE4DE">
              📍 Giao đến:
            </Text>
            <Text fontSize={14} fontWeight="700" color="#FFFFFF" numberOfLines={1}>
              {user?.address || '236 Nguyễn Gia Trí, Q. Bình Thạnh, TP.HCM'}
            </Text>
          </YStack>

          <TouchableOpacity style={styles.cartBadgeBtn} onPress={() => navigation.navigate('Cart')}>
            <Text fontSize={15} fontWeight="800" color="#EE4D2D">
              🛒 Giỏ ({totalCartCount})
            </Text>
          </TouchableOpacity>
        </XStack>

        {/* Thanh tìm kiếm giả lập bấm vào chuyển sang Màn hình 5 (SearchFilter) */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.searchBar}
          onPress={() => navigation.navigate('SearchFilter', {})}
        >
          <Text color="#888888" fontSize={14}>
            🔍 Tìm kiếm Cơm tấm, Trà sữa, Bún bò, Salad...
          </Text>
        </TouchableOpacity>
      </YStack>

      <FlatList
        key={`grid-${numColumns}`} // Bắt buộc đổi key khi numColumns thay đổi để FlatList vẽ lại số cột khi xoay ngang
        data={filteredFoods}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        refreshControl={
       <RefreshControl
         refreshing={loading}
         onRefresh={() => {dispatch(loadFoodsAsync())}}
         colors={['#EE4D2D']}
         tintColor="#EE4D2D"
       /> }
        contentContainerStyle={{ padding: 12, paddingBottom: 90 }}
        ListHeaderComponent={
          <YStack gap={16} marginBottom={12}>
            {/* Banner AI & Khuyến mãi */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('AIChatAdvisor')}
              style={styles.aiBanner}
            >
              <XStack justifyContent="space-between" alignItems="center">
                <YStack flex={1} gap={4}>
                  <Text color="#FFFFFF" fontSize={16} fontWeight="900">
                    🤖 Hôm nay ăn gì? Hỏi Trợ lý AI ngay!
                  </Text>
                  <Text color="#FFE4DE" fontSize={12}>
                    Gợi ý thực đơn theo Calo, Ngân sách sinh viên & Thời tiết
                  </Text>
                </YStack>
                <YStack backgroundColor="#FFFFFF" paddingHorizontal={12} paddingVertical={8} borderRadius={20}>
                  <Text color="#EE4D2D" fontWeight="800" fontSize={12}>
                    Thử ngay →
                  </Text>
                </YStack>
              </XStack>
            </TouchableOpacity>

            {/* Danh mục món ăn */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <XStack gap={10}>
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat.label;
                  return (
                    <TouchableOpacity
                      key={cat.label}
                      onPress={() => dispatch(setSelectedCategory(cat.label))}
                      style={[styles.categoryChip, active && styles.categoryChipActive]}
                    >
                      <Text fontSize={18}>{cat.icon}</Text>
                      <Text
                        fontSize={13}
                        fontWeight="700"
                        color={active ? '#FFFFFF' : '#333333'}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </XStack>
            </ScrollView>

            {/* Quán ăn nổi bật (Bấm vào mở Màn hình 7: RestaurantDetail) */}
            <YStack gap={8}>
              <Text fontSize={17} fontWeight="800" color="#1A1A1A">
                🔥 Quán ngon đối tác quanh Bình Thạnh
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <XStack gap={12}>
                  {restaurants.map((res) => (
                    <TouchableOpacity
                      key={res.id}
                      style={styles.restaurantCard}
                      onPress={() =>
                        navigation.navigate('RestaurantDetail', { restaurantId: res.id })
                      }
                    >
                      <Image source={{ uri: res.image }} style={styles.restaurantImg} />
                      <YStack padding={10} gap={3}>
                        <Text fontSize={14} fontWeight="700" numberOfLines={1} color="#1A1A1A">
                          {res.isVerified ? '☑️ ' : ''}
                          {res.name}
                        </Text>
                        <Text fontSize={12} color="#666666" numberOfLines={1}>
                          ⭐ {res.rating} • {res.deliveryTime} • {res.distance}
                        </Text>
                      </YStack>
                    </TouchableOpacity>
                  ))}
                </XStack>
              </ScrollView>
            </YStack>

            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize={17} fontWeight="800" color="#1A1A1A">
                🍲 Gợi ý món ngon ({filteredFoods.length} món)
              </Text>
              <Text fontSize={12} color="#EE4D2D" fontWeight="600">
                Chế độ hiển thị: {numColumns} cột
              </Text>
            </XStack>

            {loading && foods.length === 0 && <ActivityIndicator size="large" color="#EE4D2D" />}
          </YStack>
        }
        renderItem={({ item }) => (
          <FoodCard
            food={item}
            onPress={() => navigation.navigate('FoodDetail', { food: item })}
          />
        )}
      />
    </YStack>
  );
};

const styles = StyleSheet.create({
  cartBadgeBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  aiBanner: {
    backgroundColor: '#FF6633',
    borderRadius: 14,
    padding: 14,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#EE4D2D',
    borderColor: '#EE4D2D',
  },
  restaurantCard: {
    width: 210,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  restaurantImg: {
    width: '100%',
    height: 110,
  },
});