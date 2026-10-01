export const theme = {
  colors: {
    primary: '#1D4ED8',      // nút, tab chọn, giá
    secondary: '#F97316',    // badge giỏ, phí ship
    background: '#EFF6FF',   // nền sáng
    surface: '#FFFFFF',      // card
    text: '#1E3A8A',         // chữ chính
    textLight: '#64748B',    // chữ phụ
    border: '#BFDBFE',       // viền
    error: '#DC2626',        // lỗi
    success: '#16A34A',      // thành công
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    full: 9999,
  },
} as const;

export type Theme = typeof theme;
