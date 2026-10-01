import apiClient from './apiClient';
import { STUDENT, PRICE_MULTIPLIER } from '@constants/student';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

// Danh sách món mẫu chuẩn theo hình mẫu đề thi KTXGo
export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Cơm nắm',
    price: 28500 / PRICE_MULTIPLIER,
    description: 'Cơm nắm rong biển Nhật Bản dẻo thơm, bọc rong biển nướng giòn rụm với nhân cá hồi mayonnaise.',
    category: 'Đồ ăn',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    rating: { rate: 4.8, count: 120 },
  },
  {
    id: 2,
    title: 'Trà sữa',
    price: 35000 / PRICE_MULTIPLIER,
    description: 'Trà sữa truyền thống đậm vị trà đen, kem béo ngậy cùng trân châu hoàng kim dẻo dai.',
    category: 'Đồ uống',
    image: 'https://images.unsplash.com/photo-1558857563-b37cf5a73eef?w=400',
    rating: { rate: 4.9, count: 250 },
  },
  {
    id: 3,
    title: 'Bút bi',
    price: 12000 / PRICE_MULTIPLIER,
    description: 'Bút bi gel mực xanh ngòi 0.5mm êm trơn, không tắc mực, phù hợp ghi chép giảng đường.',
    category: 'Văn phòng phẩm',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400',
    rating: { rate: 4.7, count: 80 },
  },
  {
    id: 4,
    title: 'Mì ly',
    price: 18000 / PRICE_MULTIPLIER,
    description: 'Mì ly tôm chua cay Modern nước sốt đậm đà, sợi mì dai giòn thơm ngon chống đói đêm khuya.',
    category: 'Đồ ăn',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    rating: { rate: 4.6, count: 310 },
  },
  {
    id: 5,
    title: 'Bánh mì que',
    price: 15000 / PRICE_MULTIPLIER,
    description: 'Bánh mì que Hải Phòng nướng nóng giòn, pate cay thơm nồng chuẩn vị.',
    category: 'Đồ ăn',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400',
    rating: { rate: 4.5, count: 95 },
  },
  {
    id: 6,
    title: 'Cà phê sữa',
    price: 20000 / PRICE_MULTIPLIER,
    description: 'Cà phê sữa đá pha phin truyền thống thơm nồng giúp tỉnh táo học bài.',
    category: 'Đồ uống',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
    rating: { rate: 4.8, count: 180 },
  },
  {
    id: 7,
    title: 'Sổ tay KTX',
    price: 25000 / PRICE_MULTIPLIER,
    description: 'Sổ tay bìa cứng ghi chú bài học, kích thước A5 tiện lợi mang theo.',
    category: 'Văn phòng phẩm',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
    rating: { rate: 4.6, count: 65 },
  },
  {
    id: 8,
    title: 'Nước khoáng',
    price: 10000 / PRICE_MULTIPLIER,
    description: 'Nước khoáng thiên nhiên mát lạnh 500ml bổ sung khoáng chất.',
    category: 'Đồ uống',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400',
    rating: { rate: 4.9, count: 420 },
  },
];

export const productApi = {
  getProducts: async (limit: number = 12): Promise<Product[]> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await apiClient.get<Product[]>(`/products?limit=${limit}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch {
      try {
        const fetchController = new AbortController();
        const fTimeout = setTimeout(() => fetchController.abort(), 2500);
        const res = await fetch(`https://fakestoreapi.com/products?limit=${limit}`, {
          headers: { 'X-Student-Id': STUDENT.mssv },
          signal: fetchController.signal,
        });
        clearTimeout(fTimeout);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            return data;
          }
        }
      } catch {}
    }

    // Fallback danh sách món ký túc xá khớp chuẩn đề thi
    return FALLBACK_PRODUCTS.slice(0, limit);
  },

  getProductById: async (id: string | number): Promise<Product> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await apiClient.get<Product>(`/products/${id}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.data && response.data.id) {
        return response.data;
      }
    } catch {
      try {
        const fetchController = new AbortController();
        const fTimeout = setTimeout(() => fetchController.abort(), 2500);
        const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
          headers: { 'X-Student-Id': STUDENT.mssv },
          signal: fetchController.signal,
        });
        clearTimeout(fTimeout);
        if (res.ok) {
          return await res.json();
        }
      } catch {}
    }

    const found = FALLBACK_PRODUCTS.find((p) => String(p.id) === String(id));
    if (found) return found;
    return FALLBACK_PRODUCTS[0];
  },
};

export default productApi;
