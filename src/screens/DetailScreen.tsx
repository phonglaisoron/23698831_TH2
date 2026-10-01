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
import { theme } from '@constants/theme';
import {
  STUDENT,
  PRICE_MULTIPLIER,
  STALE_TIME_MS,
  VARIANT,
  ROOM_LABEL,
} from '@constants/student';
import { ShopStackParamList } from '@navigation/ShopStack';

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

    if (VARIANT.hapticOnAdd === 'impact') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } else {
      await Haptics.selectionAsync();
    }

    addItemToCart(product);

    Alert.alert(
      'Thành công',
      `Đã thêm món vào giỏ hàng!\n(MSSV: ${STUDENT.mssv} - Giao tận ${ROOM_LABEL})`
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Custom Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Quay lại</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Chi tiết sản phẩm #{id}
          </Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        {isLoading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
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
          >
            <View style={styles.imageCard}>
              <Image
                source={{ uri: product.image }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>

            <View style={styles.infoCard}>
              <View style={styles.categoryRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{product.category}</Text>
                </View>
                {product.rating && (
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>
                      ⭐ {product.rating.rate} ({product.rating.count} đánh giá)
                    </Text>
                  </View>
                )}
              </View>

              <Text style={styles.title}>{product.title}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Giá ưu đãi KTX:</Text>
                <Text style={styles.price}>
                  {Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN')} đ
                </Text>
              </View>

              <View style={styles.deliveryBadge}>
                <Text style={styles.deliveryText}>
                  🛵 KTXGo đảm bảo giao nhanh tận {ROOM_LABEL}
                </Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Mô tả sản phẩm:</Text>
              <Text style={styles.description}>{product.description}</Text>
            </View>
          </ScrollView>
        )}

        {/* Bottom action bar */}
        {product && (
          <View style={styles.bottomBar}>
            <View style={styles.totalPreview}>
              <Text style={styles.totalPreviewLabel}>Đơn giá:</Text>
              <Text style={styles.totalPreviewPrice}>
                {Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN')} đ
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addToCartButton}
              onPress={handleAddToCart}
              activeOpacity={0.8}
            >
              <Text style={styles.addToCartText}>+ Thêm vào giỏ</Text>
            </TouchableOpacity>
          </View>
        )}

        <Watermark />
      </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    maxWidth: '50%',
  },
  headerRightPlaceholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    height: 240,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  categoryBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },
  categoryText: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ratingText: {
    fontSize: 12,
    color: theme.colors.textLight,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.text,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.sm,
    gap: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: theme.colors.textLight,
  },
  price: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  deliveryBadge: {
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.2)',
  },
  deliveryText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: theme.colors.textLight,
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalPreview: {
    flex: 1,
  },
  totalPreviewLabel: {
    fontSize: 11,
    color: theme.colors.textLight,
  },
  totalPreviewPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  addToCartButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
  },
  addToCartText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  loadingSub: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.textLight,
  },
  errorIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.error,
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 13,
    color: theme.colors.text,
    textAlign: 'center',
  },
  errorDetail: {
    fontSize: 11,
    color: theme.colors.textLight,
    marginTop: 4,
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default DetailScreen;
