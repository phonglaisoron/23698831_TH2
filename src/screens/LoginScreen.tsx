import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import { Watermark } from '@components/Watermark';
import { theme } from '@constants/theme';
import { STUDENT, VARIANT, ROOM_LABEL } from '@constants/student';

export const LoginScreen: React.FC = () => {
  const [inputValue, setInputValue] = useState('0987654321');
  const login = useAuthStore((s) => s.login);

  const isPhone = VARIANT.authField === 'phone';

  const handleLogin = () => {
    if (!inputValue.trim()) {
      Alert.alert(
        'Lỗi',
        isPhone
          ? 'Vui lòng nhập số điện thoại sinh viên'
          : 'Vui lòng nhập email sinh viên'
      );
      return;
    }
    login(inputValue.trim());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoText}>KTX</Text>
              <Text style={styles.logoSubText}>Go</Text>
            </View>
            <Text style={styles.title}>KTXGo Delivery</Text>
            <Text style={styles.subtitle}>
              Giao đồ tận phòng ký túc xá ({ROOM_LABEL})
            </Text>
            <Text style={styles.studentBadge}>
              SV: {STUDENT.hoTen} - MSSV: {STUDENT.mssv}
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>
              {isPhone ? 'Số điện thoại sinh viên' : 'Email sinh viên'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={isPhone ? 'Ví dụ: 0987654321' : 'Ví dụ: sv@iuh.edu.vn'}
              placeholderTextColor={theme.colors.textLight}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType={isPhone ? 'phone-pad' : 'email-address'}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Vào cửa hàng</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Watermark />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  logoSubText: {
    fontSize: 28,
    fontWeight: '900',
    color: theme.colors.secondary,
    letterSpacing: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textLight,
    marginBottom: 8,
  },
  studentBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: 15,
    color: theme.colors.text,
    backgroundColor: '#F8FAFC',
    marginBottom: theme.spacing.lg,
  },
  button: {
    height: 48,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default LoginScreen;
