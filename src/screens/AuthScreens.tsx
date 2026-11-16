import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text, XStack, YStack } from 'tamagui';
import { RootStackParamList } from '../types';
import { useAppDispatch } from '../redux/store';
import { loginSuccess } from '../redux/authSlice';

// ================= MÀN HÌNH 1: SPLASH WELCOME (Có Animation Fade & Scale) =================
type SplashProps = NativeStackScreenProps<RootStackParamList, 'SplashWelcome'>;

export const SplashWelcomeScreen: React.FC<SplashProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <YStack flex={1} backgroundColor="#EE4D2D" justifyContent="center" alignItems="center" padding={24}>
      <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: scaleAnim }], alignItems: 'center' }}>
        <YStack
          width={110}
          height={110}
          borderRadius={28}
          backgroundColor="#FFFFFF"
          justifyContent="center"
          alignItems="center"
          marginBottom={20}
        >
          <Text fontSize={54}>🍔</Text>
        </YStack>

        <Text fontSize={30} fontWeight="900" color="#FFFFFF" textAlign="center">
          NT Food
        </Text>
        <Text fontSize={15} color="#FFE4DE" textAlign="center" marginTop={8} marginBottom={36}>
          Giao món ngon tận cửa • Có Trợ lý AI gợi ý thực đơn chuẩn gu
        </Text>
      </Animated.View>

      <YStack width="100%" maxWidth={360} gap={12}>
        <Button
          backgroundColor="#FFFFFF"
          color="#EE4D2D"
          fontWeight="800"
          fontSize={16}
          height={50}
          borderRadius={12}
          onPress={() => navigation.navigate('Login')}
        >
          Đăng nhập ngay
        </Button>

        <Button
          backgroundColor="#D73818"
          color="#FFFFFF"
          fontWeight="700"
          fontSize={15}
          height={48}
          borderRadius={12}
          onPress={() => navigation.replace('MainTabs')}
        >
          Khám phá nhanh (Chế độ Khách)
        </Button>
      </YStack>
    </YStack>
  );
};

// ================= MÀN HÌNH 2: LOGIN SCREEN =================
type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<LoginProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('kimngan@iuh.edu.vn');
  const [password, setPassword] = useState('123456');

  const handleLogin = () => {
    const value = email.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isPhone = /^0\d{9}$/.test(value);

    if (!isEmail && !isPhone) {
      Alert.alert(
        'Sai định dạng',
        'Vui lòng nhập đúng Email (vd: ten@gmail.com) hoặc Số điện thoại 10 số (bắt đầu bằng số 0)!'
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert('Mật khẩu quá ngắn', 'Mật khẩu phải có ít nhất 6 ký tự!');
      return;
    }

    dispatch(loginSuccess({ email: value, name: 'Bùi Nguyễn Kim Ngân' }));
    navigation.replace('MainTabs');
  };

  return (
    <YStack flex={1} backgroundColor="#FFFFFF" justifyContent="center" alignItems="center" padding={24}>
      <YStack width="100%" maxWidth={420} gap={16}>
        <Text fontSize={26} fontWeight="800" color="#EE4D2D">
          Chào mừng trở lại! 👋
        </Text>
        <Text fontSize={14} color="#666666">
          Đăng nhập để lưu món yêu thích, nhận mã Freeship và đặt món nhanh hơn.
        </Text>

        <YStack gap={6} marginTop={8}>
          <Text fontSize={13} fontWeight="600" color="#333333">
            Email hoặc Số điện thoại
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập email..."
            style={styles.input}
            autoCapitalize="none"
          />
        </YStack>

        <YStack gap={6}>
          <Text fontSize={13} fontWeight="600" color="#333333">
            Mật khẩu
          </Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Nhập mật khẩu..."
            secureTextEntry
            style={styles.input}
          />
        </YStack>

        <Button
          backgroundColor="#EE4D2D"
          color="#FFFFFF"
          fontWeight="800"
          height={50}
          borderRadius={12}
          marginTop={8}
          onPress={handleLogin}
        >
          Đăng nhập
        </Button>

        <XStack justifyContent="center" gap={6} marginTop={8}>
          <Text color="#666666">Chưa có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text color="#EE4D2D" fontWeight="700">
              Đăng ký miễn phí
            </Text>
          </TouchableOpacity>
        </XStack>
      </YStack>
    </YStack>
  );
};

// ================= MÀN HÌNH 3: REGISTER SCREEN =================
type RegisterProps = NativeStackScreenProps<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC<RegisterProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    const value = email.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!name.trim()) {
      Alert.alert('Thiếu họ tên', 'Vui lòng nhập họ và tên của bạn!');
      return;
    }
    if (!isEmail) {
      Alert.alert('Email không hợp lệ', 'Vui lòng nhập đúng định dạng Email (vd: kimngan@iuh.edu.vn)!');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Mật khẩu yếu', 'Mật khẩu phải từ 6 ký tự trở lên!');
      return;
    }

    dispatch(loginSuccess({ email: value, name }));
    navigation.replace('MainTabs');
  };

  return (
    <YStack flex={1} backgroundColor="#FFFFFF" justifyContent="center" alignItems="center" padding={24}>
      <YStack width="100%" maxWidth={420} gap={14}>
        <Text fontSize={24} fontWeight="800" color="#EE4D2D">
          Tạo tài khoản mới ✨
        </Text>
        <Text fontSize={13} color="#666666">
          Nhận ngay gói Voucher 65.000đ cho đơn hàng đầu tiên trên NT Food.
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Họ và tên của bạn"
          style={styles.input}
        />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email sinh viên / cá nhân"
          style={styles.input}
          autoCapitalize="none"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Mật khẩu (tối thiểu 4 ký tự)"
          secureTextEntry
          style={styles.input}
        />

        <Button
          backgroundColor="#EE4D2D"
          color="#FFFFFF"
          fontWeight="800"
          height={50}
          borderRadius={12}
          onPress={handleRegister}
        >
          Hoàn tất Đăng ký
        </Button>

        <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignItems: 'center', marginTop: 6 }}>
          <Text color="#666666">← Quay lại màn hình Đăng nhập</Text>
        </TouchableOpacity>
      </YStack>
    </YStack>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: '#F9FAFB',
  },
});