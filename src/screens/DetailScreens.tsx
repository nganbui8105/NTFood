import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text, XStack, YStack } from 'tamagui';
import { RootStackParamList } from '../types';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { addToCart } from '../redux/cartSlice';
import { FoodCard } from '../components/FoodCard';

// ================= MÀN HÌNH 7: CHI TIẾT QUÁN ĂN =================
type ResProps = NativeStackScreenProps<RootStackParamList, 'RestaurantDetail'>;

export const RestaurantDetailScreen: React.FC<ResProps> = ({ route, navigation }) => {
  const { restaurantId } = route.params;
  const { restaurants, foods } = useAppSelector((state) => state.food);

  const restaurant = restaurants.find((r) => r.id === restaurantId) || restaurants[0];
  const menuFoods = foods.filter((f) => f.restaurantId === restaurant.id);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F5F5F7' }}>
      <Image source={{ uri: restaurant.image }} style={{ width: '100%', height: 200 }} />

      <YStack backgroundColor="#FFFFFF" padding={16} gap={6}>
        <Text fontSize={20} fontWeight="800" color="#1A1A1A">
          {restaurant.isVerified ? '☑️ ' : ''}
          {restaurant.name}
        </Text>
        <Text fontSize={13} color="#666666">
          📍 {restaurant.address}
        </Text>
        <XStack gap={14} marginTop={4}>
          <Text fontSize={13} color="#F59E0B" fontWeight="700">
            ⭐ {restaurant.rating} (999+ đánh giá)
          </Text>
          <Text fontSize={13} color="#10B981" fontWeight="700">
            🛵 {restaurant.deliveryTime} ({restaurant.distance})
          </Text>
        </XStack>
      </YStack>

      <YStack padding={14} gap={10}>
        <Text fontSize={16} fontWeight="800" color="#1A1A1A">
          Thực đơn của quán ({menuFoods.length} món)
        </Text>
        {menuFoods.map((item) => (
          <FoodCard
            key={item.id}
            food={item}
            onPress={() => navigation.navigate('FoodDetail', { food: item })}
          />
        ))}
      </YStack>
    </ScrollView>
  );
};

// ================= MÀN HÌNH 8: CHI TIẾT MÓN ĂN & CHỌN TOPPING =================
type FoodProps = NativeStackScreenProps<RootStackParamList, 'FoodDetail'>;

const TOPPING_OPTIONS = ['Trân châu / Trứng ốp la (+5k)', 'Thêm sốt đặc biệt', 'Ít đá / Không hành'];

export const FoodDetailScreen: React.FC<FoodProps> = ({ route, navigation }) => {
  const { food } = route.params;
  const dispatch = useAppDispatch();

  const [size, setSize] = useState<'S' | 'M' | 'L'>('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const sizeExtra = size === 'L' ? 8000 : size === 'S' ? -5000 : 0;
  const finalPrice = (food.price + sizeExtra) * quantity;

  const toggleTopping = (topping: string) => {
    setSelectedToppings((prev) =>
      prev.includes(topping) ? prev.filter((t) => t !== topping) : [...prev, topping]
    );
  };

  const handleAdd = () => {
    dispatch(addToCart({ food, quantity, size, selectedToppings, note }));
    Alert.alert('Đã thêm vào giỏ!', `${quantity}x ${food.name} (Size ${size})`, [
      { text: 'Xem giỏ hàng', onPress: () => navigation.navigate('Cart') },
      { text: 'Mua tiếp', style: 'cancel' },
    ]);
  };

  return (
    <YStack flex={1} backgroundColor="#FFFFFF">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Image source={{ uri: food.image }} style={{ width: '100%', height: 240 }} />

        <YStack padding={16} gap={14}>
          <YStack gap={4}>
            <Text fontSize={22} fontWeight="800" color="#1A1A1A">
              {food.name}
            </Text>
            <Text fontSize={14} color="#666666">
              {food.description}
            </Text>
            <XStack justifyContent="space-between" alignItems="center" marginTop={6}>
              <Text fontSize={20} fontWeight="900" color="#EE4D2D">
                {(food.price + sizeExtra).toLocaleString('vi-VN')}đ
              </Text>
              <Text fontSize={13} color="#10B981" fontWeight="700">
                🔥 {food.calories} kcal • Đã bán {food.sold}
              </Text>
            </XStack>
          </YStack>

          <YStack gap={8}>
            <Text fontSize={15} fontWeight="700" color="#1A1A1A">
              Chọn kích cỡ (Size)
            </Text>
            <XStack gap={10}>
              {(['S', 'M', 'L'] as const).map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => setSize(s)}
                  style={[styles.optionBtn, size === s && styles.optionBtnActive]}
                >
                  <Text fontWeight="700" color={size === s ? '#FFFFFF' : '#333333'}>
                    Size {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </XStack>
          </YStack>

          <YStack gap={8}>
            <Text fontSize={15} fontWeight="700" color="#1A1A1A">
              Tùy chọn thêm
            </Text>
            {TOPPING_OPTIONS.map((tp) => {
              const checked = selectedToppings.includes(tp);
              return (
                <TouchableOpacity
                  key={tp}
                  onPress={() => toggleTopping(tp)}
                  style={[styles.toppingRow, checked && { borderColor: '#EE4D2D', backgroundColor: '#FFF5F2' }]}
                >
                  <Text color="#1A1A1A">{checked ? '☑️' : '⬜'} {tp}</Text>
                </TouchableOpacity>
              );
            })}
          </YStack>

          <YStack gap={6}>
            <Text fontSize={15} fontWeight="700" color="#1A1A1A">
              Ghi chú cho quán
            </Text>
            <TextInput
              value={note}
              onChangeText={setNote}
              placeholder="Ví dụ: Không hành, để riêng nước chấm..."
              style={styles.noteInput}
            />
          </YStack>
        </YStack>
      </ScrollView>

      {/* Thanh đáy Thêm vào giỏ */}
      <XStack
        padding={14}
        backgroundColor="#FFFFFF"
        borderTopWidth={1}
        borderColor="#E5E7EB"
        alignItems="center"
        gap={12}
      >
        <XStack alignItems="center" gap={12}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity((q) => Math.max(1, q - 1))}>
            <Text fontSize={18} fontWeight="700">-</Text>
          </TouchableOpacity>
          <Text fontSize={16} fontWeight="800">{quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity((q) => q + 1)}>
            <Text fontSize={18} fontWeight="700">+</Text>
          </TouchableOpacity>
        </XStack>

        <Button flex={1} backgroundColor="#EE4D2D" color="#FFFFFF" fontWeight="800" height={48} onPress={handleAdd}>
          Thêm vào giỏ • {finalPrice.toLocaleString('vi-VN')}đ
        </Button>
      </XStack>
    </YStack>
  );
};

const styles = StyleSheet.create({
  optionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  optionBtnActive: {
    backgroundColor: '#EE4D2D',
    borderColor: '#EE4D2D',
  },
  toppingRow: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#F9FAFB',
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});