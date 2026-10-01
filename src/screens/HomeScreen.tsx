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
  VARIANT,
} from '@constants/student';
import { ShopStackParamList } from '@navigation/types';

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
        {VARIANT.watermarkAtTop && <Watermark />}

        {/* Header (A) - Thanh màu xanh đậm chuẩn đề thi */}
        <View style={styles.blueHeader}>
          <View>
            <Text style={styles.brandTitle}>KTXGO</Text>
            <Text style={styles.roomText}>Giao tận {ROOM_LABEL}</Text>
          </View>
          <Text style={styles.headerLabelA}>(A)</Text>
        </View>

        {/* Thanh tìm kiếm (B) */}
        <View style={styles.searchSection}>
          <View style={styles.labelBRow}>
            <View style={{ flex: 1 }} />
            <Text style={styles.labelB}>(B)</Text>
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder={`Tìm món (debounce) — ${STUDENT.mssv}`}
              placeholderTextColor="#94A3B8"
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
        </View>

        {/* Nhãn (C) FlashList x2 */}
        <View style={styles.labelCRow}>
          <Text style={styles.labelC}>(C) FlashList ×2</Text>
        </View>

        {/* Ba cảnh mạng */}
        <View style={styles.content}>
          {isLoading ? (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Đang tải danh sách món...</Text>
              <Text style={styles.loadingSub}>MSSV: {STUDENT.mssv}</Text>
            </View>
          ) : isError ? (
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
            <FlashList
              data={filteredProducts}
              numColumns={2}
              estimatedItemSize={175}
              keyExtractor={(item) => `${STUDENT.mssv}-${item.id}`}
              renderItem={({ item, index }) => (
                <View style={styles.columnWrapper}>
                  <ProductCard
                    product={item}
                    index={index}
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

        {!VARIANT.watermarkAtTop && <Watermark />}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1D4ED8',
  },
  container: {
    flex: 1,
    backgroundColor: '#EFF6FF',
  },
  blueHeader: {
    backgroundColor: '#1D4ED8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  roomText: {
    fontSize: 13,
    color: '#E0F2FE',
    marginTop: 2,
    fontWeight: '500',
  },
  headerLabelA: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F97316',
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 2,
  },
  labelBRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  labelB: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  searchContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 13,
    color: '#1E3A8A',
  },
  clearSearchBtn: {
    position: 'absolute',
    right: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearSearchText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '700',
  },
  labelCRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  labelC: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  content: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  columnWrapper: {
    alignItems: 'center',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
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
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
  },
});

export default HomeScreen;
