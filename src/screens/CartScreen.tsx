import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore, CartItem } from '@stores/cartStore';
import { Watermark } from '@components/Watermark';
import { theme } from '@constants/theme';
import { STUDENT, ROOM_LABEL } from '@constants/student';

export const CartScreen: React.FC = () => {
  const items = useCartStore((s) => s.items);
  const changeQty = useCartStore((s) => s.changeQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const shippingFee = useCartStore((s) => s.shippingFee);
  const getTotalAmount = useCartStore((s) => s.getTotalAmount);

  const subtotal = getTotalAmount();
  const actualShippingFee = shippingFee ?? 0;
  const finalTotal = subtotal + actualShippingFee;

  const handleClearAll = () => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa hết', style: 'destructive', onPress: clearCart },
    ]);
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartCard}>
      <Image
        source={{ uri: item.product.image }}
        style={styles.itemImage}
        resizeMode="contain"
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle} numberOfLines={2}>
          {item.product.title}
        </Text>
        <Text style={styles.itemPrice}>
          {item.unitPriceVnd.toLocaleString('vi-VN')} đ
        </Text>

        <View style={styles.qtyRow}>
          <View style={styles.qtyControls}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => changeQty(item.id, -1)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.qtyButtonText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => changeQty(item.id, 1)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => removeItem(item.id)}
          >
            <Text style={styles.removeText}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Giỏ hàng KTXGo</Text>
            <Text style={styles.roomNotice}>
              Giao tận phòng: <Text style={styles.roomHighlight}>{ROOM_LABEL}</Text>
            </Text>
          </View>
          {items.length > 0 && (
            <TouchableOpacity onPress={handleClearAll} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Xóa tất cả</Text>
            </TouchableOpacity>
          )}
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Giỏ hàng đang trống</Text>
            <Text style={styles.emptySubtitle}>
              Hãy chọn những món đồ dùng, đồ ăn ngon tại Tab Cửa hàng nhé!
            </Text>
            <Text style={styles.studentNote}>
              MSSV: {STUDENT.mssv} - {STUDENT.hoTen}
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            keyExtractor={(item) => `cart-${STUDENT.mssv}-${item.id}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* Footer Summary */}
        {items.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tiền hàng:</Text>
              <Text style={styles.summaryValue}>
                {subtotal.toLocaleString('vi-VN')} đ
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.shippingLabelRow}>
                <Text style={styles.summaryLabel}>Phí ship KTX:</Text>
                {shippingFee === null && (
                  <Text style={styles.shippingNotice}> (Vào tab Tôi để tính GPS)</Text>
                )}
              </View>
              <Text style={styles.shippingValue}>
                {shippingFee !== null
                  ? `${shippingFee.toLocaleString('vi-VN')} đ`
                  : 'Chưa tính GPS'}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
              <Text style={styles.totalValue}>
                {finalTotal.toLocaleString('vi-VN')} đ
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              onPress={() =>
                Alert.alert(
                  'Đặt hàng thành công!',
                  `Đơn hàng sẽ được chuyển đến ${ROOM_LABEL} trong 15 phút.\n(MSSV: ${STUDENT.mssv})`,
                  [{ text: 'OK', onPress: clearCart }]
                )
              }
              activeOpacity={0.8}
            >
              <Text style={styles.checkoutText}>
                Đặt hàng về {ROOM_LABEL}
              </Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
  },
  roomNotice: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  roomHighlight: {
    color: theme.colors.secondary,
    fontWeight: '800',
  },
  clearBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  clearBtnText: {
    fontSize: 13,
    color: theme.colors.error,
    fontWeight: '600',
  },
  listContent: {
    padding: theme.spacing.md,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: '#FFFFFF',
  },
  itemDetails: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
    marginTop: 4,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: theme.borderRadius.sm,
  },
  qtyButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
  },
  qtyValue: {
    paddingHorizontal: 8,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.text,
  },
  removeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeText: {
    fontSize: 12,
    color: theme.colors.error,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  studentNote: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 13,
    color: theme.colors.textLight,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.text,
  },
  shippingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shippingNotice: {
    fontSize: 11,
    color: theme.colors.secondary,
  },
  shippingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  checkoutBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  checkoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});

export default CartScreen;
