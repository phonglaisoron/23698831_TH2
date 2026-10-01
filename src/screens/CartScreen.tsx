import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '@stores/cartStore';
import { Watermark } from '@components/Watermark';
import {
  useCampusLocation,
  calculateShippingFee,
  KTX_GATE_LOCATION,
} from '@hooks/useCampusLocation';
import {
  STUDENT,
  ROOM_LABEL,
  PRICE_MULTIPLIER,
  VARIANT,
} from '@constants/student';

export const CartScreen: React.FC = () => {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const changeQty = useCartStore((s) => s.changeQty);
  const clearCart = useCartStore((s) => s.clearCart);
  const shippingFee = useCartStore((s) => s.shippingFee);
  const distanceKm = useCartStore((s) => s.distanceKm);

  const { requestLocation } = useCampusLocation();

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const subTotal = items.reduce(
    (sum, item) => sum + Math.round(item.product.price * PRICE_MULTIPLIER) * item.quantity,
    0
  );

  // Khoảng cách thực tế tính tới 12 Nguyễn Văn Bảo (ĐH Công nghiệp TP.HCM)
  const currentKm = distanceKm !== null ? distanceKm : 1.07;
  const effectiveShippingFee =
    shippingFee !== null ? shippingFee : calculateShippingFee(currentKm);
  const finalTotal = subTotal + (items.length > 0 ? effectiveShippingFee : 0);

  const handleCheckout = () => {
    Alert.alert(
      'Xác nhận thanh toán',
      `Đơn hàng giao đến: ${ROOM_LABEL}\n` +
      `Điểm lấy hàng: ${KTX_GATE_LOCATION.address}\n` +
      `Khoảng cách: ≈ ${currentKm.toFixed(1)} km\n` +
      `Tiền hàng: ${subTotal.toLocaleString('vi-VN')} đ\n` +
      `Phí ship: ${effectiveShippingFee.toLocaleString('vi-VN')} đ (công thức ${VARIANT.shipFormula})\n` +
      `--------------------------------\n` +
      `Tổng thanh toán: ${finalTotal.toLocaleString('vi-VN')} đ\n\n` +
      `Sinh viên: ${STUDENT.hoTen} (${STUDENT.mssv})`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Thanh toán ngay',
          onPress: () => {
            clearCart();
            Alert.alert(
              'Thanh toán thành công! 🎉',
              `Đã đặt hàng và thanh toán thành công.\nShipper đang lấy đồ từ 12 Nguyễn Văn Bảo giao đến ${ROOM_LABEL} cho bạn!`
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {VARIANT.watermarkAtTop && <Watermark />}

        {/* Thanh Header GIỎ HÀNG màu xanh đậm như Hình 5 */}
        <View style={styles.blueHeader}>
          <Text style={styles.headerTitle}>GIỎ HÀNG</Text>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
            <Text style={styles.emptySubtitle}>
              Hãy chọn những món đồ dùng, đồ ăn ngon tại Tab Cửa hàng nhé!
            </Text>
            <Text style={styles.emptyStudent}>
              MSSV: {STUDENT.mssv} - {STUDENT.hoTen}
            </Text>
          </View>
        ) : (
          <View style={styles.mainContent}>
            {/* Danh sách món trong giỏ */}
            <FlatList
              data={items}
              keyExtractor={(item) => `${STUDENT.mssv}-${item.product.id}`}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const itemUnitVnd = Math.round(item.product.price * PRICE_MULTIPLIER);
                const itemTotalVnd = itemUnitVnd * item.quantity;

                return (
                  <View style={styles.itemCard}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {item.product.title}
                      </Text>
                      <Text style={styles.itemSubtitle}>
                        ×{item.quantity}  {itemTotalVnd.toLocaleString('vi-VN')} đ
                      </Text>
                      <View style={styles.qtyRow}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => changeQty(item.product.id, item.quantity - 1)}
                        >
                          <Text style={styles.qtyBtnText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyVal}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => changeQty(item.product.id, item.quantity + 1)}
                        >
                          <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Nút xóa màu đỏ hình vuông góc phải như Hình 5 */}
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => removeItem(item.product.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.deleteButtonText}>✕</Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />

            {/* Khung viền cam chứa thông tin giao hàng & phí ship tính từ 12 Nguyễn Văn Bảo */}
            <View style={styles.summaryContainer}>
              <View style={styles.orangeBox}>
                <Text style={styles.deliveryRoomText}>Giao đến {ROOM_LABEL}</Text>
                <Text style={styles.shippingFeeText}>
                  Phí ship: {effectiveShippingFee.toLocaleString('vi-VN')} đ (công thức {VARIANT.shipFormula})
                </Text>
                <Text style={styles.originAddressText}>
                  📍 Từ: {KTX_GATE_LOCATION.shortAddress} (ĐH Công nghiệp TP.HCM) · ≈ {currentKm.toFixed(1)} km
                </Text>
              </View>

              {/* Dòng Tổng hàng */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tổng hàng:</Text>
                <Text style={styles.totalAmountText}>
                  {finalTotal.toLocaleString('vi-VN')} đ
                </Text>
              </View>

              {/* Nút thanh toán ở dưới theo yêu cầu */}
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={handleCheckout}
                activeOpacity={0.85}
              >
                <Text style={styles.checkoutButtonText}>
                  Thanh toán ({finalTotal.toLocaleString('vi-VN')} đ)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  mainContent: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    marginBottom: 6,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1D4ED8',
    lineHeight: 18,
  },
  qtyVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
    minWidth: 16,
    textAlign: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  summaryContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  orangeBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: '#F97316',
    marginBottom: 16,
  },
  deliveryRoomText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  shippingFeeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F97316',
  },
  originAddressText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 5,
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4B5563',
  },
  totalAmountText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1D4ED8',
  },
  checkoutButton: {
    backgroundColor: '#1D4ED8',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E3A8A',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyStudent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
});

export default CartScreen;
