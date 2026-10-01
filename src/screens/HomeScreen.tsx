import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { productApi, Product } from '@services/productApi';
import { ProductCard } from '@components/ProductCard';
import { Watermark } from '@components/Watermark';
import { useCartStore } from '@stores/cartStore';
import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { theme } from '@constants/theme';
import {
  STUDENT,
  ROOM_LABEL,
  DEBOUNCE_MS,
  STALE_TIME_MS,
} from '@constants/student';
import { ShopStackParamList } from '@navigation/ShopStack';

type HomeScreenNavigationProp = NativeStackNavigationProp<ShopStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, DEBOUNCE_MS);

  const addItemToCart = useCartStore((s) => s.addItem);

  const {
    data: products,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => productApi.getProducts(12),
    staleTime: STALE_TIME_MS,
  });

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!debouncedSearch.trim()) return products;
    const lower = debouncedSearch.toLowerCase();
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(lower) ||
        p.category.toLowerCase().includes(lower)
    );
  }, [products, debouncedSearch]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('Detail', { id: product.id.toString() });
  };

  const handleAddToCart = (product: Product) => {
    addItemToCart(product);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header (A) */}
        <View style={styles.header}>
          <View>
            <View style={styles.brandRow}>
              <Text style={styles.brandTitle}>KTXGO</Text>
              <View style={styles.roomBadge}>
                <Text style={styles.roomText}>Giao tận {ROOM_LABEL}</Text>
              </View>
            </View>
            <Text style={styles.subHeader}>
              Sinh viên: {STUDENT.hoTen} ({STUDENT.mssv})
            </Text>
          </View>
        </View>

        {/* Search bar (B) */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={`Tìm món ăn, đồ dùng (Debounce: ${DEBOUNCE_MS}ms)...`}
            placeholderTextColor={theme.colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearSearchBtn}
            >
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Ba cảnh mạng (thiếu một = sai Câu 2b) */}
        <View style={styles.content}>
          {/* Cảnh 1: Đang tải */}
          {isLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Đang tải danh sách món...</Text>
              <Text style={styles.loadingSub}>MSSV: {STUDENT.mssv}</Text>
            </View>
          ) : isError ? (
            /* Cảnh 2: Lỗi mạng (có MSSV + Thử lại) */
            <View style={styles.centerBox}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Lỗi kết nối mạng</Text>
              <Text style={styles.errorMessage}>
                Không thể tải dữ liệu sản phẩm (MSSV: {STUDENT.mssv}).
              </Text>
              <Text style={styles.errorDetail}>
                {(error as Error)?.message || 'Kiểm tra kết nối Internet'}
              </Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => refetch()}
                activeOpacity={0.8}
              >
                <Text style={styles.retryButtonText}>Thử lại ngay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Cảnh 3: Có dữ liệu lưới FlashList 2 cột (C) */
            <FlashList
              data={filteredProducts}
              numColumns={2}
              estimatedItemSize={260}
              keyExtractor={(item) => `${STUDENT.mssv}-${item.id}`}
              renderItem={({ item }) => (
                <View style={styles.columnWrapper}>
                  <ProductCard
                    product={item}
                    onPress={handleProductPress}
                    onAddToCart={handleAddToCart}
                  />
                </View>
              )}
              contentContainerStyle={styles.listContent}
              refreshing={isFetching}
              onRefresh={refetch}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    Không tìm thấy món phù hợp với từ khóa "{debouncedSearch}"
                  </Text>
                </View>
              }
            />
          )}
        </View>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.xs,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  roomBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  roomText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  subHeader: {
    fontSize: 11,
    color: theme.colors.textLight,
    marginTop: 2,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    height: 42,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text,
  },
  clearSearchBtn: {
    position: 'absolute',
    right: theme.spacing.lg + 10,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearSearchText: {
    color: theme.colors.textLight,
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.md,
  },
  columnWrapper: {
    alignItems: 'center',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  loadingSub: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.textLight,
  },
  errorIcon: {
    fontSize: 44,
    marginBottom: theme.spacing.sm,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.error,
    marginBottom: 6,
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  errorDetail: {
    fontSize: 12,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textLight,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default HomeScreen;
