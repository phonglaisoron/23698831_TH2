import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useCampusLocation,
  calculateShippingFee,
  DEFAULT_DISTANCE_KM,
} from '@hooks/useCampusLocation';
import { useAuthStore } from '@stores/authStore';
import { Watermark } from '@components/Watermark';
import { STUDENT, examStamp, VARIANT } from '@constants/student';

export const MeScreen: React.FC = () => {
  const {
    status,
    distanceKm,
    shippingFee,
    loading,
    requestLocation,
    openSettings,
  } = useCampusLocation();

  const logout = useAuthStore((s) => s.logout);
  const stamp = examStamp();

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất tài khoản?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Đăng xuất', style: 'destructive', onPress: () => logout() },
    ]);
  };

  const currentKm = distanceKm !== null ? distanceKm : DEFAULT_DISTANCE_KM;
  const currentFee = shippingFee !== null ? shippingFee : calculateShippingFee(currentKm);

  const displayDistance = currentKm.toFixed(1);
  const displayFee = currentFee.toLocaleString('vi-VN');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {VARIANT.watermarkAtTop && <Watermark />}

        {/* Header TÔI · LOCATION màu xanh đậm như Hình 5 */}
        <View style={styles.blueHeader}>
          <Text style={styles.headerTitle}>TÔI · LOCATION</Text>
        </View>

        <View style={styles.content}>
          {/* Thông tin sinh viên căn giữa như Hình 5 */}
          <View style={styles.profileSection}>
            <Text style={styles.studentName}>{STUDENT.hoTen}</Text>
            <Text style={styles.studentMeta}>
              {STUDENT.mssv} · #{stamp}
            </Text>
          </View>

          {/* Card hiển thị trạng thái vị trí & Phí ship ước tính */}
          <View style={styles.locationCard}>
            <Text
              style={[
                styles.permissionText,
                status === 'granted'
                  ? styles.permGranted
                  : styles.permOther,
              ]}
            >
              Quyền: {status}
            </Text>

            <Text style={styles.distanceText}>
              ≈ {displayDistance} km tới 12 Nguyễn Văn Bảo (ĐH Công nghiệp TP.HCM)
            </Text>

            <Text style={styles.feeLabel}>Phí ship ước tính</Text>
            <Text style={styles.feeValue}>{displayFee} đ</Text>
          </View>

          {/* 3 Nút chức năng xếp dọc như Hình 5 */}
          <View style={styles.actionsSection}>
            {/* Nút 1: Lấy vị trí ước tính ship (Màu xanh) */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={requestLocation}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryBtnText}>Lấy vị trí ước tính ship</Text>
              )}
            </TouchableOpacity>

            {/* Nút 2: Mở Cài đặt (blocked) (Nền trắng viền xanh) */}
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={openSettings}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryBtnText}>Mở Cài đặt (blocked)</Text>
            </TouchableOpacity>

            {/* Nút 3: Đăng xuất (Màu đỏ) */}
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={handleLogout}
              activeOpacity={0.85}
            >
              <Text style={styles.logoutBtnText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  studentName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E3A8A',
    marginBottom: 4,
    textAlign: 'center',
  },
  studentMeta: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  permissionText: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  permGranted: {
    color: '#16A34A',
  },
  permOther: {
    color: '#DC2626',
  },
  distanceText: {
    fontSize: 15,
    color: '#1E293B',
    marginBottom: 12,
    fontWeight: '500',
  },
  feeLabel: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  feeValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#F97316',
  },
  actionsSection: {
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: '#1D4ED8',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1D4ED8',
  },
  secondaryBtnText: {
    color: '#1D4ED8',
    fontSize: 15,
    fontWeight: '700',
  },
  logoutBtn: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

export default MeScreen;
