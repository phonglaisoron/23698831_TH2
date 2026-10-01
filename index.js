/**
 * @format
 */
/* global globalThis */

// Fallback polyfill for expo-modules-core when running in bare React Native CLI
if (typeof globalThis !== 'undefined') {
  if (!globalThis.expo) {
    class SimpleEventEmitter {
      addListener() {
        return { remove: () => {} };
      }
      removeListener() {}
      removeAllListeners() {}
      emit() {}
      listenerCount() {
        return 0;
      }
    }
    globalThis.expo = {
      EventEmitter: SimpleEventEmitter,
      modules: {},
    };
  }
  if (!globalThis.expo.modules) {
    globalThis.expo.modules = {};
  }

  // Fallback for ExpoFetchModule
  const dummyFetch = function () {};
  dummyFetch.NativeRequest = function () {};
  dummyFetch.NativeResponse = function () {};
  dummyFetch.unstable_createBlobData = async function () {
    return '';
  };
  globalThis.expo.modules.ExpoFetchModule = dummyFetch;

  // Fallback for ExpoHaptics
  if (!globalThis.expo.modules.ExpoHaptics) {
    globalThis.expo.modules.ExpoHaptics = {
      notificationAsync: async () => {},
      selectionAsync: async () => {},
      impactAsync: async () => {},
    };
  }

  // Fallback for ExpoLocation
  if (!globalThis.expo.modules.ExpoLocation) {
    globalThis.expo.modules.ExpoLocation = {
      getForegroundPermissionsAsync: async () => ({
        status: 'granted',
        canAskAgain: true,
        granted: true,
        expires: 'never',
      }),
      requestForegroundPermissionsAsync: async () => ({
        status: 'granted',
        canAskAgain: true,
        granted: true,
        expires: 'never',
      }),
      getCurrentPositionAsync: async () => ({
        coords: {
          latitude: 10.8285,
          longitude: 106.6800,
          altitude: 0,
          accuracy: 5,
          altitudeAccuracy: 5,
          heading: 0,
          speed: 0,
        },
        timestamp: Date.now(),
      }),
      reverseGeocodeAsync: async () => [{ city: 'TP Hồ Chí Minh', street: 'Nguyễn Văn Bảo' }],
    };
  }
}

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
