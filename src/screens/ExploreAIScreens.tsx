import React, { useMemo, useState, useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Button, Text, XStack, YStack } from 'tamagui';
import { Food, RootStackParamList } from '../types';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { setSearchQuery } from '../redux/foodSlice';
import { addToCart } from '../redux/cartSlice';
import { FoodCard } from '../components/FoodCard';

// ================= MÀN HÌNH 5: TÌM KIẾM & LỌC NÂNG CAO =================
export const SearchFilterScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { foods, searchQuery } = useAppSelector((state) => state.food);

  const [maxPrice, setMaxPrice] = useState<number>(Infinity);
  const { width } = useWindowDimensions();
  const numColumns = width >= 600 ? 2 : 1;

  const results = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return foods.filter((f) => {
      const matchText =
        !q ||
        f.name.toLowerCase().includes(q) ||
        f.restaurantName.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q);
      const matchPrice = f.price <= maxPrice;
      return matchText && matchPrice;
    });
  }, [foods, searchQuery, maxPrice]);

  return (
    <YStack flex={1} backgroundColor="#F5F5F7" padding={14} gap={12}>
      <TextInput
        value={searchQuery}
        onChangeText={(text) => dispatch(setSearchQuery(text))}
        placeholder="Nhập tên món, tên quán (vd: Cơm, Trà sữa, Salad)..."
        style={styles.searchInput}
      />

      <XStack gap={8} alignItems="center" flexWrap="wrap">
        <Text fontSize={13} fontWeight="700" color="#333333">
          Mức giá tối đa:
        </Text>
        {[45000, 55000, Infinity].map((price) => (
          <TouchableOpacity
            key={price}
            onPress={() => setMaxPrice(price)}
            style={[styles.filterChip, maxPrice === price && styles.filterChipActive]}
          >
            <Text fontSize={12} fontWeight="700" color={maxPrice === price ? '#FFFFFF' : '#333333'}>
              {price === Infinity ? 'Tất cả giá' : `≤ ${price.toLocaleString('vi-VN')}đ`}
            </Text>
          </TouchableOpacity>
        ))}
      </XStack>

      <FlatList
        key={`search-${numColumns}`}
        data={results}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <YStack alignItems="center" marginTop={40} gap={8}>
            <Text fontSize={36}>🔍</Text>
            <Text color="#666666">Không tìm thấy món phù hợp với bộ lọc.</Text>
          </YStack>
        }
        renderItem={({ item }) => (
          <FoodCard food={item} onPress={() => navigation.navigate('FoodDetail', { food: item })} />
        )}
      />
    </YStack>
  );
};

// ================= MÀN HÌNH 6: TRỢ LÝ AI GỢI Ý MÓN ĂN (AI BASIC) =================
interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  suggestedFoods?: Food[];
}

const AI_QUICK_PROMPTS = [
  'Ít calo dưới 50k để ăn kiêng',
  'Trời mưa thèm món nóng cay',
  'Bữa trưa no lâu giàu đạm',
  'Đồ uống ngọt buổi chiều',
];

export const AIChatAdvisorScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const foods = useAppSelector((state) => state.food.foods);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm0',
      sender: 'ai',
      text: 'Chào bạn! Mình là Trợ lý Ẩm thực AI của NT Food 🤖. Bạn đang muốn ăn món gì, ngân sách bao nhiêu hoặc chế độ ăn như thế nào? Nhắn cho mình biết nhé!',
    },
  ]);
const scrollViewRef = useRef<any>(null);

  // Hàm AI Basic phân tích ngữ nghĩa câu hỏi và chấm điểm mức độ phù hợp từ dữ liệu thực đơn
  // Hàm AI Basic: Trích xuất ngân sách (NLP Regex) + Chấm điểm mức độ phù hợp từ thực đơn
  const generateAIRecommendation = (query: string) => {
    const q = query.toLowerCase();
    // Xử lý nhanh các câu hỏi so sánh cực trị (mắc nhất, rẻ nhất, bán chạy nhất)
    let extremePicks: Food[] | null = null;
    if (q.includes('mắc nhất') || q.includes('đắt nhất') || q.includes('cao giá nhất')) {
      extremePicks = [...foods].sort((a, b) => b.price - a.price).slice(0, 2);
    } else if (q.includes('rẻ nhất') || q.includes('thấp nhất') || q.includes('ít tiền nhất')) {
      extremePicks = [...foods].sort((a, b) => a.price - b.price).slice(0, 2);
    } else if (q.includes('bán chạy') || q.includes('ngon nhất') || q.includes('đánh giá cao')) {
      extremePicks = [...foods].sort((a, b) => b.sold - a.sold).slice(0, 2);
    }

    if (extremePicks) {
      setMessages((prev) => [
        ...prev,
        { id: 'u-' + Date.now(), sender: 'user', text: query },
        {
          id: 'a-' + (Date.now() + 1),
          sender: 'ai',
          text: `Dựa trên dữ liệu thực đơn hiện tại, đây là top lựa chọn đúng theo tiêu chí "${query}" của bạn:`,
          suggestedFoods: extremePicks,
        },
      ]);
      setInput('');
      return;
    }

    // 1. Tự động đọc số tiền từ câu hỏi (vd: "2 triệu", "1 triệu 800", "50k", "2000000")
    let targetPrice: number | null = null;
    const trieuMatch = q.match(/(\d+)\s*(?:triệu|tr)(?:\s*(\d+))?/);
    const kMatch = q.match(/(\d+)\s*(?:k|nghìn|ngàn)/);
    const rawNumberMatch = q.match(/\b(\d{4,})\b/);

    if (trieuMatch) {
      const millions = parseInt(trieuMatch[1], 10) * 1000000;
      const extra = trieuMatch[2]
        ? parseInt(trieuMatch[2], 10) * (trieuMatch[2].length === 1 ? 100000 : 1000)
        : 0;
      targetPrice = millions + extra;
    } else if (kMatch) {
      targetPrice = parseInt(kMatch[1], 10) * 1000;
    } else if (rawNumberMatch) {
      targetPrice = parseInt(rawNumberMatch[1], 10);
    }

    const isMaxBudget = q.includes('dưới') || q.includes('ngân sách') || q.includes('tối đa');

    // 2. Chấm điểm từng món ăn
    const scored = foods.map((food) => {
      let score = 0;

      if (targetPrice !== null) {
        if (isMaxBudget) {
          if (food.price <= targetPrice) score += 4;
        } else {
          // Tìm món có giá sát với mức giá người dùng yêu cầu nhất
          const diffRatio = Math.abs(food.price - targetPrice) / Math.max(targetPrice, 1);
          if (diffRatio === 0) score += 10;
          else if (diffRatio <= 0.3) score += 6;
          else if (diffRatio <= 0.6) score += 2;
        }
      }

      if (q.includes('ít calo') || q.includes('giảm cân') || q.includes('eat clean') || q.includes('kiêng')) {
        if (food.category === 'Healthy' || food.tags.includes('giảm cân')) {
          score += 6;
        } else if (food.category === 'Trà sữa' || food.category === 'Ăn vặt') {
          score -= 5; // Loại bỏ trà sữa & đồ ăn vặt khỏi thực đơn giảm cân
        }
      }
      if (q.includes('mưa') || q.includes('nóng') || q.includes('cay')) {
        if (food.tags.includes('ngày mưa') || food.tags.includes('cay') || food.tags.includes('nóng hổi')) score += 3;
      }
      if (q.includes('no') || q.includes('đạm') || q.includes('trưa') || q.includes('cơm')) {
        if (food.tags.includes('no lâu') || food.tags.includes('giàu đạm')) score += 3;
      }
      if (q.includes('uống') || q.includes('trà sữa') || q.includes('ngọt') || q.includes('chiều')) {
        if (food.category === 'Trà sữa' || food.category === 'Ăn vặt') score += 3;
      }

      if (q.includes('việt') || q.includes('truyền thống') || q.includes('đặc sản')) {
        if (food.category === 'Cơm' || food.category === 'Bún/Phở') score += 4;
      }

      // Tự động so khớp từng từ khóa trong câu hỏi với Tên món & Mô tả món
      const stopWords = ['muốn', 'ăn', 'uống', 'món', 'gì', 'đó', 'cho', 'tui', 'tôi', 'với', 'nào'];
      const words = q.split(/\s+/).filter((w) => w.length >= 2 && !stopWords.includes(w));
      const fullText = `${food.name} ${food.description} ${food.category}`.toLowerCase();
      words.forEach((w) => {
        if (fullText.includes(w)) score += 3;
      });

      return { food, score };
    });

    const topPicks = scored
      .sort((a, b) => b.score - a.score)
      .filter((item) => item.score > 0)
      .slice(0, 3)
      .map((item) => item.food);

    const finalPicks = topPicks.length > 0 ? topPicks : foods.slice(0, 2);

    const replyText =
      topPicks.length > 0
        ? `Dựa trên yêu cầu "${query}", AI đề xuất ${finalPicks.length} lựa chọn phù hợp nhất cho bạn:`
        : `Mình gợi ý 2 món đang bán chạy nhất hôm nay để bạn tham khảo nhé:`;

    const userMsg: ChatMessage = { id: 'u-' + Date.now(), sender: 'user', text: query };
    const aiMsg: ChatMessage = {
      id: 'a-' + (Date.now() + 1),
      sender: 'ai',
      text: replyText,
      suggestedFoods: finalPicks,
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={95}
    >
      <YStack flex={1} backgroundColor="#F5F5F7">
        {/* Gợi ý câu hỏi nhanh - CỐ ĐỊNH LUÔN HIỂN THỊ */}
        <YStack
          backgroundColor="#FFFFFF"
          paddingVertical={10}
          paddingHorizontal={12}
          borderBottomWidth={1}
          borderColor="#E5E7EB"
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack gap={8}>
              {AI_QUICK_PROMPTS.map((prompt) => (
                <TouchableOpacity
                  key={prompt}
                  style={styles.promptChip}
                  onPress={() => generateAIRecommendation(prompt)}
                >
                  <Text fontSize={12} color="#EE4D2D" fontWeight="700">
                    ✨ {prompt}
                  </Text>
                </TouchableOpacity>
              ))}
            </XStack>
          </ScrollView>
        </YStack>

        {/* Khung cuộn tin nhắn riêng ở bên dưới */}
        <ScrollView
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={{ padding: 14, gap: 12 }}
        >
          {messages.map((msg) => (
            <YStack
              key={msg.id}
              alignSelf={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
              maxWidth="88%"
              backgroundColor={msg.sender === 'user' ? '#EE4D2D' : '#FFFFFF'}
              padding={12}
              borderRadius={14}
              gap={8}
            >
              <Text color={msg.sender === 'user' ? '#FFFFFF' : '#1A1A1A'} fontSize={14}>
                {msg.text}
              </Text>

              {msg.suggestedFoods?.map((food) => (
                <XStack
                  key={food.id}
                  backgroundColor="#FFF5F2"
                  padding={10}
                  borderRadius={10}
                  justifyContent="space-between"
                  alignItems="center"
                  gap={8}
                >
                  <YStack flex={1}>
                    <Text fontWeight="700" fontSize={13} color="#1A1A1A">
                      {food.name}
                    </Text>
                    <Text fontSize={12} color="#666666">
                      {food.price.toLocaleString('vi-VN')}đ • {food.calories} kcal
                    </Text>
                  </YStack>
                  <Button
                    height={34}
                    paddingHorizontal={12}
                    backgroundColor="#EE4D2D"
                    color="#FFFFFF"
                    onPress={() => dispatch(addToCart({ food, quantity: 1, size: 'M' }))}
                  >
                    + Giỏ
                  </Button>
                </XStack>
              ))}
            </YStack>
          ))}
        </ScrollView>

        <XStack
          padding={12}
          backgroundColor="#FFFFFF"
          gap={8}
          alignItems="center"
          borderTopWidth={1}
          borderColor="#E5E7EB"
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Hỏi AI: Hôm nay ăn gì ít calo dưới 50k?"
            style={[styles.searchInput, { flex: 1 }]}
          />
          <Button
            backgroundColor="#EE4D2D"
            color="#FFFFFF"
            fontWeight="700"
            onPress={() => input.trim() && generateAIRecommendation(input)}
          >
            Gửi
          </Button>
        </XStack>
      </YStack>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    fontSize: 14,
  },
  filterChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#EE4D2D',
    borderColor: '#EE4D2D',
  },
  promptChip: {
    backgroundColor: '#FFF0ED',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFCABD',
  },
});