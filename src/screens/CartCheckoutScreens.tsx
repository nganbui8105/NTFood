import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text, XStack, YStack } from 'tamagui';
import { RootStackParamList } from '../types';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { applyVoucher, clearCart, updateQuantity } from '../redux/cartSlice';
import { createOrderAsync } from '../redux/orderSlice';

// ================= MÀN HÌNH 9: GIỎ HÀNG & CHỌN VOUCHER =================
type CartProps = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export const CartScreen: React.FC<CartProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items, vouchers, appliedVoucher } = useAppSelector((state) => state.cart);

  // Responsive: Trên Tablet / Màn hình ngang, chia Giỏ hàng thành 2 cột trái - phải
  const { width } = useWindowDimensions();
  const isWide = width >= 700;

  const subtotal = items.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const shippingFee = items.length > 0 ? 15000 : 0;
  const discount =
    appliedVoucher && subtotal >= appliedVoucher.minOrderValue ? appliedVoucher.discountAmount : 0;
  const total = Math.max(0, subtotal + shippingFee - discount);

  if (items.length === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding={24} gap={12} backgroundColor="#FFFFFF">
        <Text fontSize={54}>🛒</Text>
        <Text fontSize={18} fontWeight="800" color="#1A1A1A">
          Giỏ hàng của bạn đang trống
        </Text>
        <Text fontSize={14} color="#666666" textAlign="center">
          Hãy quay lại Trang chủ hoặc hỏi Trợ lý AI để chọn món ngon nhé!
        </Text>
        <Button backgroundColor="#EE4D2D" color="#FFFFFF" onPress={() => navigation.navigate('MainTabs')}>
          Khám phá món ngon ngay
        </Button>
      </YStack>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F7' }} contentContainerStyle={{ padding: 14 }}>
      <YStack flexDirection={isWide ? 'row' : 'column'} gap={14}>
        {/* Danh sách món */}
        <YStack flex={isWide ? 1.4 : undefined} gap={10}>
          {items.map((item) => (
            <XStack
              key={`${item.food.id}-${item.size}`}
              backgroundColor="#FFFFFF"
              padding={12}
              borderRadius={12}
              gap={12}
              alignItems="center"
            >
              <Image source={{ uri: item.food.image }} style={{ width: 64, height: 64, borderRadius: 8 }} />
              <YStack flex={1} gap={2}>
                <Text fontWeight="700" fontSize={14} color="#1A1A1A">
                  {item.food.name} (Size {item.size})
                </Text>
                <Text fontSize={13} color="#EE4D2D" fontWeight="800">
                  {item.food.price.toLocaleString('vi-VN')}đ
                </Text>
                {item.note ? <Text fontSize={11} color="#888888">Ghi chú: {item.note}</Text> : null}
              </YStack>

              <XStack alignItems="center" gap={8}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => dispatch(updateQuantity({ foodId: item.food.id, size: item.size, delta: -1 }))}
                >
                  <Text fontWeight="700">-</Text>
                </TouchableOpacity>
                <Text fontWeight="800">{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => dispatch(updateQuantity({ foodId: item.food.id, size: item.size, delta: 1 }))}
                >
                  <Text fontWeight="700">+</Text>
                </TouchableOpacity>
              </XStack>
            </XStack>
          ))}
        </YStack>

        {/* Khung Voucher & Tổng tiền */}
        <YStack flex={isWide ? 1 : undefined} gap={12}>
          <YStack backgroundColor="#FFFFFF" padding={14} borderRadius={12} gap={8}>
            <Text fontWeight="800" fontSize={15}>
              🎟️ Chọn mã khuyến mãi ShopeeFood
            </Text>
            {vouchers.map((v) => {
              const selected = appliedVoucher?.id === v.id;
              return (
                <TouchableOpacity
                  key={v.id}
                  onPress={() => dispatch(applyVoucher(selected ? null : v))}
                  style={[styles.voucherBox, selected && styles.voucherBoxActive]}
                >
                  <Text fontWeight="700" color={selected ? '#EE4D2D' : '#1A1A1A'}>
                    {selected ? '✅ ' : '⬜ '}
                    {v.code} — {v.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </YStack>

          <YStack backgroundColor="#FFFFFF" padding={14} borderRadius={12} gap={8}>
            <XStack justifyContent="space-between">
              <Text color="#666666">Tạm tính</Text>
              <Text fontWeight="700">{subtotal.toLocaleString('vi-VN')}đ</Text>
            </XStack>
            <XStack justifyContent="space-between">
              <Text color="#666666">Phí giao hàng</Text>
              <Text fontWeight="700">{shippingFee.toLocaleString('vi-VN')}đ</Text>
            </XStack>
            <XStack justifyContent="space-between">
              <Text color="#10B981">Giảm giá Voucher</Text>
              <Text fontWeight="700" color="#10B981">
                -{discount.toLocaleString('vi-VN')}đ
              </Text>
            </XStack>
            <XStack justifyContent="space-between" borderTopWidth={1} borderColor="#E5E7EB" paddingTop={8}>
              <Text fontSize={16} fontWeight="800">Tổng thanh toán</Text>
              <Text fontSize={18} fontWeight="900" color="#EE4D2D">
                {total.toLocaleString('vi-VN')}đ
              </Text>
            </XStack>

            <Button
              backgroundColor="#EE4D2D"
              color="#FFFFFF"
              fontWeight="800"
              height={48}
              marginTop={6}
              onPress={() => navigation.navigate('Checkout')}
            >
              Tiến hành Đặt hàng
            </Button>
          </YStack>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

// ================= MÀN HÌNH 10: XÁC NHẬN THANH TOÁN =================
type CheckoutProps = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

export const CheckoutScreen: React.FC<CheckoutProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { items, appliedVoucher } = useAppSelector((state) => state.cart);
  const submitting = useAppSelector((state) => state.order.submitting);

  const [address, setAddress] = useState(user?.address || '236 Nguyễn Gia Trí, Q. Bình Thạnh, TP.HCM');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'MoMo' | 'ZaloPay'>('COD');

  const subtotal = items.reduce((sum, item) => sum + item.food.price * item.quantity, 0);
  const discount =
    appliedVoucher && subtotal >= appliedVoucher.minOrderValue ? appliedVoucher.discountAmount : 0;
  const totalAmount = Math.max(0, subtotal + 15000 - discount);

  const handleConfirmOrder = async () => {
    if (!address.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập địa chỉ giao hàng!');
      return;
    }

    await dispatch(
      createOrderAsync({
        createdAt: new Date().toLocaleString('vi-VN'),
        items,
        totalAmount,
        deliveryAddress: address,
        paymentMethod,
        status: 'Đã nhận đơn',
      })
    );

    dispatch(clearCart());
    Alert.alert('Đặt đơn thành công! 🎉', 'Quán đang chuẩn bị món ăn cho bạn.', [
      {
        text: 'Theo dõi đơn ngay',
        onPress: () => navigation.navigate('MainTabs'),
      },
    ]);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F7' }} contentContainerStyle={{ padding: 16, gap: 14 }}>
      <YStack backgroundColor="#FFFFFF" padding={14} borderRadius={12} gap={8}>
        <Text fontWeight="800" fontSize={15}>📍 Địa chỉ giao hàng</Text>
        <TextInput value={address} onChangeText={setAddress} style={styles.input} />
      </YStack>

      <YStack backgroundColor="#FFFFFF" padding={14} borderRadius={12} gap={8}>
        <Text fontWeight="800" fontSize={15}>💳 Phương thức thanh toán</Text>
        {(['COD', 'MoMo', 'ZaloPay'] as const).map((method) => (
          <TouchableOpacity
            key={method}
            onPress={() => setPaymentMethod(method)}
            style={[styles.voucherBox, paymentMethod === method && styles.voucherBoxActive]}
          >
            <Text fontWeight="700">
              {paymentMethod === method ? '🔘 ' : '⚪ '}
              {method === 'COD' ? 'Tiền mặt khi nhận hàng (COD)' : `Ví điện tử ${method}`}
            </Text>
          </TouchableOpacity>
        ))}
      </YStack>

      <YStack backgroundColor="#FFFFFF" padding={14} borderRadius={12} gap={6}>
        <XStack justifyContent="space-between">
          <Text fontSize={15} fontWeight="700">Số lượng món:</Text>
          <Text fontWeight="700">{items.reduce((s, i) => s + i.quantity, 0)} món</Text>
        </XStack>
        <XStack justifyContent="space-between">
          <Text fontSize={16} fontWeight="800">Tổng thanh toán:</Text>
          <Text fontSize={18} fontWeight="900" color="#EE4D2D">
            {totalAmount.toLocaleString('vi-VN')}đ
          </Text>
        </XStack>
      </YStack>

      <Button
        backgroundColor="#EE4D2D"
        color="#FFFFFF"
        fontWeight="800"
        height={50}
        disabled={submitting}
        onPress={handleConfirmOrder}
      >
        {submitting ? 'Đang gửi đơn lên Server...' : 'Xác nhận Đặt đơn'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voucherBox: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  voucherBoxActive: {
    borderColor: '#EE4D2D',
    backgroundColor: '#FFF5F2',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#F9FAFB',
  },
});