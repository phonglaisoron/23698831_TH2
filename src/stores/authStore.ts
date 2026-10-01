import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STUDENT, examStamp } from '@constants/student';

interface AuthState {
  token: string | null;
  identifier: string; // phone or email
  login: (identifier: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      identifier: '',
      login: (identifier: string) => {
        const dummyToken = `ktxgo-${STUDENT.mssv}-${examStamp()}`;
        set({ token: dummyToken, identifier });
      },
      logout: () => {
        set({ token: null, identifier: '' });
      },
    }),
    {
      name: `ktxgo-auth-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
