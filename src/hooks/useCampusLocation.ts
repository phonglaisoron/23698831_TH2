import { useState, useCallback } from 'react';
import { Linking, Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { BASE_SHIP_FEE, VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';

// Tọa độ cổng KTX IUH (Ký túc xá Đại học Công Nghiệp TP.HCM)
export const KTX_GATE_LOCATION = {
  latitude: 10.822363,
  longitude: 106.687498,
  address: 'Cổng KTX IUH, Gò Vấp, TP.HCM',
};

export type PermissionStatus = 'idle' | 'granted' | 'denied' | 'blocked';

export function calculateHaversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateShippingFee(distanceKm: number): number {
  const km = Math.max(0.1, distanceKm);
  if (VARIANT.shipFormula === 'A') {
    return BASE_SHIP_FEE + Math.round(km * 2000);
  }
  // Formula B (Số cuối 1): BASE_SHIP_FEE + Math.round(km * 1500) + 2000
  return BASE_SHIP_FEE + Math.round(km * 1500) + 2000;
}

export function useCampusLocation() {
  const [status, setStatus] = useState<PermissionStatus>('idle');
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [shippingFee, setShippingFee] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const setCartShippingFee = useCartStore((s) => s.setShippingFee);

  const openSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }, []);

  const requestLocation = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const permissionResponse = await Location.requestForegroundPermissionsAsync();

      if (permissionResponse.status === Location.PermissionStatus.GRANTED) {
        setStatus('granted');
        let loc;
        try {
          loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
        } catch {
          // Fallback location nếu máy ảo không có GPS
          loc = {
            coords: {
              latitude: 10.825123,
              longitude: 106.689456,
            },
          };
        }

        const userLat = loc.coords.latitude;
        const userLon = loc.coords.longitude;
        setCoords({ latitude: userLat, longitude: userLon });

        const km = calculateHaversineKm(
          userLat,
          userLon,
          KTX_GATE_LOCATION.latitude,
          KTX_GATE_LOCATION.longitude
        );
        const roundedKm = parseFloat(km.toFixed(2));
        setDistanceKm(roundedKm);

        const fee = calculateShippingFee(roundedKm);
        setShippingFee(fee);
        setCartShippingFee(fee);
      } else if (!permissionResponse.canAskAgain) {
        setStatus('blocked');
        setErrorMessage('Quyền vị trí đã bị chặn vĩnh viễn. Vui lòng mở Cài đặt để cấp quyền.');
      } else {
        setStatus('denied');
        setErrorMessage('Bạn đã từ chối cấp quyền truy cập vị trí.');
      }
    } catch (err: any) {
      setStatus('denied');
      setErrorMessage(err?.message || 'Không thể lấy vị trí hiện tại');
    } finally {
      setLoading(false);
    }
  }, [setCartShippingFee]);

  return {
    status,
    coords,
    distanceKm,
    shippingFee,
    loading,
    errorMessage,
    requestLocation,
    openSettings,
  };
}

export default useCampusLocation;
