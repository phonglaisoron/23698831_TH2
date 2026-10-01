import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import { productApi, Product } from '@services/productApi';
import { useCartStore } from '@stores/cartStore';
import { Watermark } from '@components/Watermark';
import {
  STUDENT,
  PRICE_MULTIPLIER,
  STALE_TIME_MS,
  VARIANT,
  ROOM_LABEL,
} from '@constants/student';
import { ShopStackParamList } from '@navigation/types';

type DetailScreenRouteProp = RouteProp<ShopStackParamList, 'Detail'>;

export const DetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const navigation = useNavigation();
  const { id } = route.params;

  const addItemToCart = useCartStore((s) => s.addItem);

  const {
    data: product,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductById(id),
    staleTime: STALE_TIME_MS,
  });

  const handleAddToCart = async () => {
    if (!product) return;

    try {
      if (VARIANT.hapticOnAdd === 'impact') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        await Haptics.selectionAsync();
      }
    } catch {}

    addItemToCart(product);

    Alert.alert(
      'Thành công',
      `Đã thêm món vào giỏ hàng!\n(MSSV: ${STUDENT.mssv} - Giao tận ${ROOM_LABEL})`
    );
  };

  const priceVnd = product
    ? Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ'
    : '';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {VARIANT.watermarkAtTop && <Watermark />}

        {/* Header chi tiết món */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Chi tiết món</Text>
          </TouchableOpacity>
          <Text style={styles.headerStackTag}>Stack</Text>
        </View>

        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#1D4ED8" />
            <Text style={styles.loadingText}>Đang tải chi tiết món...</Text>
            <Text style={styles.loadingSub}>MSSV: {STUDENT.mssv}</Text>
          </View>
        ) : isError || !product ? (
          <View style={styles.centerBox}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>Lỗi tải dữ liệu</Text>
            <Text style={styles.errorMessage}>
              Không thể tải thông tin món #{id} (MSSV: {STUDENT.mssv})
            </Text>
            <Text style={styles.errorDetail}>
              {(error as Error)?.message || 'Kiểm tra kết nối mạng'}
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
              <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Khung hình ảnh pastel giống Hình 4 */}
            <View style={styles.mediaContainer}>
              <View style={styles.mockOval}>
                <View style={styles.mockRect} />
              </View>
              {product.image ? (
                <Image
                  source={{ uri: product.image }}
                  style={styles.realImage}
                  resizeMode="contain"
                />
              ) : null}
            </View>

            {/* Thông tin món */}
            <View style={styles.infoSection}>
              <Text style={styles.title}>{product.title}</Text>
              <Text style={styles.price}>{priceVnd}</Text>
              <Text style={styles.subtitle}>Giao nội khu · Nhận tận phòng</Text>
            </View>

            {/* Phần mô tả theo đúng yêu cầu trên tờ đề */}
            <View style={styles.descriptionSection}>
              <Text style={styles.descPrompt}>Mô tả ngắn từ API (tối đa 3 dòng).</Text>
              <Text style={styles.descContent} numberOfLines={3}>
                {product.description || 'Món ăn, đồ dùng giao nhanh ký túc xá cho sinh viên nội trú.'}
              </Text>
              <Text style={styles.descPrompt}>
                Giữ nguyên id từ route.params (ID: {id}).
              </Text>
            </View>

            {/* Nút Thêm vào giỏ · Haptic */}
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
              activeOpacity={0.85}
            >
              <Text style={styles.addToCartText}>Thêm vào giỏ · Haptic</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {!VARIANT.watermarkAtTop && <Watermark />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F6FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1D4ED8',
    fontWeight: '700',
  },
  headerStackTag: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F97316',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  mediaContainer: {
    height: 190,
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  mockOval: {
    width: '75%',
    height: 100,
    borderRadius: 50,
    backgroundColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  mockRect: {
    width: '78%',
    height: 60,
    backgroundColor: '#1D4ED8',
    borderRadius: 6,
  },
  realImage: {
    position: 'absolute',
    width: '75%',
    height: '75%',
    opacity: 0.15,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 6,
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1D4ED8',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  descriptionSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 28,
  },
  descPrompt: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  descContent: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 19,
    marginVertical: 4,
  },
  addToCartButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  loadingSub: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B',
  },
  errorIcon: {
    fontSize: 44,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A8A',
    textAlign: 'center',
    marginBottom: 4,
  },
  errorDetail: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#1D4ED8',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default DetailScreen;
