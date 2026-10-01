import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import { Watermark } from '@components/Watermark';
import { STUDENT, VARIANT } from '@constants/student';

export const LoginScreen: React.FC = () => {
  const isPhone = VARIANT.authField === 'phone';
  const defaultValue = isPhone ? '0987654321' : `${STUDENT.mssv}@iuh.edu.vn`;
  const [inputValue, setInputValue] = useState(defaultValue);
  const login = useAuthStore((s) => s.login);

  const handleLogin = () => {
    const val = inputValue.trim() || defaultValue;
    login(val);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      {VARIANT.watermarkAtTop && <Watermark />}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Logo KTXGO & phụ đề như Hình 1 */}
          <Text style={styles.title}>KTXGO</Text>
          <Text style={styles.subtitle}>Giao đồ tận phòng ký túc xá</Text>

          {/* Ô nhập bo góc viền xanh đồng màu, bên phải có badge (A) */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder={
                isPhone
                  ? 'Số điện thoại — 0987654321'
                  : `Email — ${STUDENT.mssv}@iuh.edu.vn`
              }
              placeholderTextColor="#94A3B8"
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType={isPhone ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.badgeA}>(A)</Text>
          </View>

          {/* Nút Vào cửa hàng xanh đồng màu */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>Vào cửa hàng</Text>
          </TouchableOpacity>

          {/* Dòng trạng thái Auth Stack ở dưới nút */}
          <Text style={styles.footerText}>Auth Stack · chưa có token</Text>
        </View>

        {!VARIANT.watermarkAtTop && <Watermark />}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EFF6FF', // Nền sáng dịu đồng bộ toàn bộ app
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    marginTop: -40,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#1D4ED8',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 36,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE', // Đồng bộ màu viền với theme và watermark
    borderRadius: 14,
    height: 52,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1E3A8A',
    paddingVertical: 0,
  },
  badgeA: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1D4ED8',
    marginLeft: 8,
  },
  button: {
    height: 52,
    backgroundColor: '#1D4ED8',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerText: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 13,
    marginTop: 24,
    fontWeight: '500',
  },
});

export default LoginScreen;
