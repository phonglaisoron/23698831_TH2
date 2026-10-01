import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import { useCampusLocation, KTX_GATE_LOCATION } from '@hooks/useCampusLocation';
import { Watermark } from '@components/Watermark';
import { theme } from '@constants/theme';
import {
  STUDENT,
  ROOM_LABEL,
  BASE_SHIP_FEE,
  VARIANT,
  examStamp,
} from '@constants/student';

export const MeScreen: React.FC = () => {
  const logout = useAuthStore((s) => s.logout);
  const identifier = useAuthStore((s) => s.identifier);

  const {
    status,
    coords,
    distanceKm,
    shippingFee,
    loading,
    errorMessage,
    requestLocation,
    openSettings,
  } = useCampusLocation();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
          <Text style={styles.headerSubtitle}>KTXGo Delivery Service</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Card Thông tin sinh viên */}
          <View style={styles.card}>
            <View style={styles.avatarRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {STUDENT.hoTen.charAt(0)}
                </Text>
              </View>
              <View style={styles.avatarInfo}>
                <Text style={styles.nameText}>{STUDENT.hoTen}</Text>
                <Text style={styles.mssvText}>MSSV: {STUDENT.mssv}</Text>
                <Text style={styles.phoneText}>
                  {VARIANT.authField === 'phone' ? 'SĐT: ' : 'Email: '}
                  {identifier || '0987654321'}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phòng ký túc xá:</Text>
              <Text style={styles.infoValueHighlight}>{ROOM_LABEL}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã định danh Stamp:</Text>
              <Text style={styles.infoValue}>#{examStamp()}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Biến thể đề thi:</Text>
              <Text style={styles.infoValue}>
                Công thức {VARIANT.shipFormula} · Haptic {VARIANT.hapticOnAdd}
              </Text>
            </View>
          </View>

          {/* Card Định vị GPS & Phí Ship */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📍 Định vị GPS & Phí giao hàng</Text>
            <Text style={styles.cardDesc}>
              Ước tính phí giao hàng từ Cổng KTX tới vị trí hiện tại của bạn theo công thức {VARIANT.shipFormula}.
            </Text>

            <View style={styles.locationInfoBox}>
              <Text style={styles.locSubTitle}>Tọa độ mốc Cổng KTX:</Text>
              <Text style={styles.locCoordText}>
                {KTX_GATE_LOCATION.address}
              </Text>
              <Text style={styles.locCoordText}>
                ({KTX_GATE_LOCATION.latitude.toFixed(6)}, {KTX_GATE_LOCATION.longitude.toFixed(6)})
              </Text>
            </View>

            {/* Trạng thái quyền và kết quả */}
            {status === 'granted' && coords && (
              <View style={styles.resultBox}>
                <Text style={styles.resultTitle}>✅ Đã xác định vị trí của bạn:</Text>
                <Text style={styles.resultDetail}>
                  Tọa độ: {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
                </Text>
                <Text style={styles.resultDetail}>
                  Khoảng cách Haversine: <Text style={styles.boldText}>{distanceKm} km</Text>
                </Text>
                <View style={styles.feeHighlightBox}>
                  <Text style={styles.feeLabel}>Phí ship tính theo Công thức {VARIANT.shipFormula}:</Text>
                  <Text style={styles.feeAmount}>
                    {shippingFee?.toLocaleString('vi-VN')} đ
                  </Text>
                  <Text style={styles.formulaNote}>
                    ({BASE_SHIP_FEE} + {distanceKm} × 1500 + 2000)
                  </Text>
                </View>
                <Text style={styles.syncCartNotice}>
                  * Phí ship đã được cập nhật tự động vào Giỏ hàng của bạn.
                </Text>
              </View>
            )}

            {status === 'denied' && (
              <View style={styles.alertBox}>
                <Text style={styles.alertText}>
                  ⚠️ Bạn chưa cấp quyền truy cập vị trí. Hãy nhấn nút bên dưới để cấp quyền.
                </Text>
              </View>
            )}

            {status === 'blocked' && (
              <View style={styles.blockedBox}>
                <Text style={styles.blockedText}>
                  🚫 Quyền truy cập vị trí đã bị chặn. Vui lòng mở Cài đặt thiết bị để cho phép.
                </Text>
                <TouchableOpacity
                  style={styles.settingsButton}
                  onPress={openSettings}
                  activeOpacity={0.8}
                >
                  <Text style={styles.settingsButtonText}>
                    Mở Cài đặt hệ thống (openSettings)
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {errorMessage && status !== 'blocked' && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <TouchableOpacity
              style={[styles.locationBtn, loading && styles.btnDisabled]}
              onPress={requestLocation}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.locationBtnText}>
                  {status === 'granted'
                    ? '🔄 Cập nhật lại vị trí & Phí'
                    : '🎯 Lấy vị trí & Tính phí ship'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Nút Đăng xuất */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
          </TouchableOpacity>
        </ScrollView>

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
  headerSubtitle: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  avatarInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
  },
  mssvText: {
    fontSize: 13,
    color: theme.colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  phoneText: {
    fontSize: 12,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  infoLabel: {
    fontSize: 13,
    color: theme.colors.textLight,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.text,
  },
  infoValueHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.secondary,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: theme.colors.textLight,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  locationInfoBox: {
    backgroundColor: '#F8FAFC',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  locSubTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textLight,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  locCoordText: {
    fontSize: 12,
    color: theme.colors.text,
    fontFamily: 'monospace',
  },
  resultBox: {
    backgroundColor: '#F0FDF4',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    marginBottom: theme.spacing.md,
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.success,
    marginBottom: 4,
  },
  resultDetail: {
    fontSize: 12,
    color: theme.colors.text,
    marginBottom: 2,
  },
  boldText: {
    fontWeight: '800',
    color: theme.colors.primary,
  },
  feeHighlightBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
  },
  feeLabel: {
    fontSize: 12,
    color: theme.colors.textLight,
  },
  feeAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: theme.colors.secondary,
    marginTop: 2,
  },
  formulaNote: {
    fontSize: 10,
    color: theme.colors.textLight,
    fontStyle: 'italic',
  },
  syncCartNotice: {
    fontSize: 11,
    color: theme.colors.success,
    marginTop: 6,
    fontStyle: 'italic',
  },
  alertBox: {
    backgroundColor: '#FEF3C7',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  alertText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  blockedBox: {
    backgroundColor: '#FEE2E2',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  blockedText: {
    fontSize: 12,
    color: theme.colors.error,
    marginBottom: 8,
    fontWeight: '500',
  },
  settingsButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  errorText: {
    fontSize: 12,
    color: theme.colors.error,
    marginBottom: 8,
  },
  locationBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.7,
  },
  locationBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    color: theme.colors.error,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default MeScreen;
