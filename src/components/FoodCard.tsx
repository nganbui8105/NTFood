import React, { useRef } from 'react';
import { Animated, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { Food } from '../types';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { addToCart } from '../redux/cartSlice';
import { toggleFavoriteFood } from '../redux/foodSlice';

interface Props {
  food: Food;
  onPress: () => void;
}

export const FoodCard: React.FC<Props> = ({ food, onPress }) => {
  const dispatch = useAppDispatch();
  const favoriteIds = useAppSelector((state) => state.food.favoriteFoodIds);
  const isFav = favoriteIds.includes(food.id);

  // Animation cơ bản: Phóng to rồi thu nhỏ nút "+" khi bấm thêm món vào giỏ
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleQuickAdd = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.35, duration: 120, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();

    dispatch(addToCart({ food, quantity: 1, size: 'M' }));
  };

  return (
    <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={styles.cardWrapper}>
      <XStack
        backgroundColor="#FFFFFF"
        borderRadius={14}
        padding={10}
        gap={12}
        borderWidth={1}
        borderColor="#F0F0F0"
        alignItems="center"
      >
        <Image source={{ uri: food.image }} style={styles.foodImage} />

        <YStack flex={1} gap={4}>
          <XStack justifyContent="space-between" alignItems="flex-start">
            <Text fontSize={15} fontWeight="700" color="#1A1A1A" numberOfLines={1} flex={1}>
              {food.name}
            </Text>
            <TouchableOpacity onPress={() => dispatch(toggleFavoriteFood(food.id))}>
              <Text fontSize={16}>{isFav ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </XStack>

          <Text fontSize={12} color="#666666" numberOfLines={1}>
            🏪 {food.restaurantName}
          </Text>

          <XStack gap={8} alignItems="center">
            <Text fontSize={12} color="#F59E0B" fontWeight="600">
              ★ {food.rating}
            </Text>
            <Text fontSize={12} color="#888888">
              • Đã bán {food.sold}
            </Text>
            <Text fontSize={11} color="#10B981" fontWeight="600">
              • {food.calories} kcal
            </Text>
          </XStack>

          <XStack justifyContent="space-between" alignItems="center" marginTop={4}>
            <Text fontSize={16} fontWeight="800" color="#EE4D2D">
              {food.price.toLocaleString('vi-VN')}đ
            </Text>

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity style={styles.addBtn} onPress={handleQuickAdd}>
                <Text color="#FFFFFF" fontSize={18} fontWeight="700">
                  +
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </XStack>
        </YStack>
      </XStack>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    flex: 1,
    marginBottom: 10,
    marginHorizontal: 4,
  },
  foodImage: {
    width: 84,
    height: 84,
    borderRadius: 10,
    backgroundColor: '#F5F5F7',
  },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#EE4D2D',
    alignItems: 'center',
    justifyContent: 'center',
  },
});