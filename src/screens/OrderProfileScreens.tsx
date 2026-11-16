import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, ScrollView, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Text, XStack, YStack } from 'tamagui';
import { RootStackParamList } from '../types';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { advanceOrderStatus } from '../redux/orderSlice';
import { logout, updateProfile } from '../redux/authSlice';
import { FoodCard } from '../components/FoodCard';

// ================= MÀN HÌNH 11: THEO DÕI ĐƠN HÀNG & LỊCH SỬ =================
const STEPS = ['Đã nhận đơn', 'Đang chuẩn bị', 'Đang giao hàng', 'Hoàn thành'] as const;

export const OrderTrackingScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.order.orders);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Animation thanh tiến trình giao hàng
  const progressAnim = useRef(new Animated.Value(0.25)).current;

  const latestOrder = orders[0];
  const stepIndex = latestOrder ? STEPS.indexOf(latestOrder.status) : 0;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (stepIndex + 1) / 4,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [stepIndex, progressAnim]);

  if (orders.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding={24} gap={10} backgroundColor="#FFFFFF">
        <Text fontSize={48}>🛵</Text>
        <Text fontSize={17} fontWeight="800">Chưa có đơn hàng nào</Text>
        <Text color="#666666" textAlign="center">
          Hãy đặt thử một món để xem hiệu ứng theo dõi tài xế giao hàng nhé!
        </Text>
      </YStack>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F7' }} contentContainerStyle={{ padding: 14, gap: 14 }}>
      <YStack backgroundColor="#FFFFFF" padding={16} borderRadius={14} gap={12}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontWeight="800" fontSize={16} color="#EE4D2D">
            🛵 Đơn mới nhất ({latestOrder.id})
          </Text>
          <Text fontSize={12} color="#10B981" fontWeight="700">
            {latestOrder.status}
          </Text>
        </XStack>

        {/* Thanh tiến trình có Animation */}
        <YStack height={10} backgroundColor="#F3F4F6" borderRadius={5} overflow="hidden">
          <Animated.View
            style={{
              height: '100%',
              backgroundColor: '#EE4D2D',
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }}
          />
        </YStack>

        <XStack justifyContent="space-between">
          {STEPS.map((s, idx) => (
            <Text key={s} fontSize={10} fontWeight={idx <= stepIndex ? '700' : '400'} color={idx <= stepIndex ? '#EE4D2D' : '#999999'}>
              {s}
            </Text>
          ))}
        </XStack>

        <Button
          height={40}
          backgroundColor="#FFF0ED"
          color="#EE4D2D"
          fontWeight="700"
          onPress={() => dispatch(advanceOrderStatus(latestOrder.id))}
        >
          ⚡ Mô phỏng bước giao hàng tiếp theo
        </Button>
      </YStack>

      <Text fontSize={16} fontWeight="800">Lịch sử đơn hàng ({orders.length})</Text>
      {orders.map((ord) => {
     const isExpanded = expandedOrderId === ord.id;
     return (
       <TouchableOpacity
         key={ord.id}
         activeOpacity={0.85}
         onPress={() => setExpandedOrderId(isExpanded ? null : ord.id)}
       >
         <YStack backgroundColor="#FFFFFF" padding={14} borderRadius={12} gap={4}>
           <XStack justifyContent="space-between" alignItems="center">
             <Text fontWeight="800">Đơn #{ord.id} {isExpanded ? '▲' : '▼'}</Text>
             <Text color="#EE4D2D" fontWeight="800">{ord.totalAmount.toLocaleString('vi-VN')}đ</Text>
           </XStack>
           <Text fontSize={12} color="#666666">🕒 {ord.createdAt} • {ord.paymentMethod} • {ord.status}</Text>
           <Text fontSize={12} color="#666666">📍 {ord.deliveryAddress}</Text>

           {isExpanded && (
             <YStack marginTop={8} paddingTop={8} borderTopWidth={1} borderColor="#F0F0F0" gap={6}>
               <Text fontSize={12} fontWeight="700" color="#1A1A1A">🍲 Chi tiết món đã đặt:</Text>
               {ord.items.map((item, idx) => (
                 <XStack key={idx} justifyContent="space-between">
                   <Text fontSize={12} color="#333333" flex={1}>
                     • {item.quantity}x {item.food.name} (Size {item.size})
                   </Text>
                   <Text fontSize={12} fontWeight="700" color="#EE4D2D">
                     {(item.food.price * item.quantity).toLocaleString('vi-VN')}đ
                   </Text>
                 </XStack>
               ))}
             </YStack>
           )}
         </YStack>
       </TouchableOpacity>
     );
   })}
    </ScrollView>
  );
};

// ================= MÀN HÌNH 12: HỒ SƠ CÁ NHÂN & MÓN YÊU THÍCH =================
export const ProfileFavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);
  const { foods, favoriteFoodIds } = useAppSelector((state) => state.food);

  const [name, setName] = useState(user?.name || '');
  const [address, setAddress] = useState(user?.address || '');

  const favoriteFoods = foods.filter((f) => favoriteFoodIds.includes(f.id));

  const handleSave = () => {
    dispatch(updateProfile({ name, address }));
    Alert.alert('Đã lưu!', 'Thông tin giao hàng của bạn đã được cập nhật.');
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F7' }} contentContainerStyle={{ padding: 14, gap: 14 }}>
      <YStack backgroundColor="#FFFFFF" padding={16} borderRadius={14} gap={10}>
        <Text fontSize={18} fontWeight="800" color="#EE4D2D">
          👤 Hồ sơ cá nhân
        </Text>
        <TextInput value={name} onChangeText={setName} placeholder="Họ tên" style={styles.input} />
        <TextInput value={address} onChangeText={setAddress} placeholder="Địa chỉ mặc định" style={styles.input} />

        <XStack gap={10}>
          <Button flex={1} backgroundColor="#EE4D2D" color="#FFFFFF" fontWeight="700" onPress={handleSave}>
            Lưu thông tin
          </Button>
          <Button
            backgroundColor="#F3F4F6"
            color="#333333"
            fontWeight="700"
            onPress={() => {
              dispatch(logout());
              navigation.replace('Login');
            }}
          >
            Đăng xuất
          </Button>
        </XStack>
      </YStack>

      <Text fontSize={16} fontWeight="800" color="#1A1A1A">
        ❤️ Món ăn đã thả tim ({favoriteFoods.length})
      </Text>
      {favoriteFoods.map((food) => (
        <FoodCard
          key={food.id}
          food={food}
          onPress={() => navigation.navigate('FoodDetail', { food })}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#F9FAFB',
  },
});