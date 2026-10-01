import apiClient from './apiClient';
import { STUDENT } from '@constants/student';

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

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Fjallraven - Balo KTX Foldsack No. 1',
    price: 3.5,
    description: 'Balo sinh viên chống nước nhẹ, quai đeo êm ái, ngăn đựng laptop tiện lợi cho sinh viên.',
    category: 'Đồ dùng',
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: { rate: 3.9, count: 120 },
  },
  {
    id: 2,
    title: 'Cơm tấm sườn nướng đặc biệt KTXGo',
    price: 1.2,
    description: 'Cơm tấm sườn mật ong thơm ngon, bì dai giòn, chả hấp nóng giao tận phòng P.131.',
    category: 'Đồ ăn',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    rating: { rate: 4.8, count: 320 },
  },
  {
    id: 3,
    title: 'Trà sữa trân châu đường đen size L',
    price: 0.9,
    description: 'Trà sữa Đài Loan vị trà đen đậm đà, kem béo ngậy kèm trân châu hoàng kim dai giòn.',
    category: 'Đồ uống',
    image: 'https://images.unsplash.com/photo-1558857563-b37cf5a73eef?w=400',
    rating: { rate: 4.9, count: 450 },
  },
  {
    id: 4,
    title: 'Bánh mì pate thịt nướng giòn rụm',
    price: 0.8,
    description: 'Bánh mì giòn kẹp thịt nướng xiên que, pate béo ngậy, sốt bơ trứng đặc biệt.',
    category: 'Đồ ăn',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=400',
    rating: { rate: 4.6, count: 210 },
  },
  {
    id: 5,
    title: 'Mì cay bò Mỹ kim chi xúc xích',
    price: 1.1,
    description: 'Tô mì cay Hàn Quốc nấu sôi sùng sục, topping thịt bò Mỹ, xúc xích và kim chi giòn cay.',
    category: 'Đồ ăn',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400',
    rating: { rate: 4.7, count: 195 },
  },
  {
    id: 6,
    title: 'Cà phê muối sinh viên chuẩn vị Huế',
    price: 0.6,
    description: 'Cà phê phin Robusta đậm đặc kết hợp lớp kem mặn béo ngậy khởi động ngày mới.',
    category: 'Đồ uống',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
    rating: { rate: 4.8, count: 280 },
  },
  {
    id: 7,
    title: 'Ổ cứng di động WD 2TB USB 3.0',
    price: 2.8,
    description: 'Ổ cứng dung lượng cao sao lưu tài liệu, đồ án học tập an toàn nhanh chóng.',
    category: 'Thiết bị điện tử',
    image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg',
    rating: { rate: 4.3, count: 140 },
  },
  {
    id: 8,
    title: 'SanDisk 1TB High-Speed SSD M.2',
    price: 2.5,
    description: 'Nâng cấp tốc độ máy tính chạy mượt Android Studio và React Native.',
    category: 'Thiết bị điện tử',
    image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg',
    rating: { rate: 4.5, count: 180 },
  },
  {
    id: 9,
    title: 'Combo 5 vở ô ly + 3 bút bi Thiên Long',
    price: 0.5,
    description: 'Bộ đồ dùng học tập ghi chép bài giảng chất lượng giấy dày không thấm mực.',
    category: 'Văn phòng phẩm',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400',
    rating: { rate: 4.9, count: 90 },
  },
  {
    id: 10,
    title: 'Bình giữ nhiệt Lock&Lock 500ml',
    price: 1.3,
    description: 'Bình giữ nhiệt inox 304 giữ nóng 8h và giữ lạnh 12h tiện lợi mang lên giảng đường.',
    category: 'Đồ dùng',
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=400',
    rating: { rate: 4.7, count: 160 },
  },
  {
    id: 11,
    title: 'Bánh tráng trộn sa tế bò khô KTX',
    price: 0.7,
    description: 'Bánh tráng phơi sương trộn khô bò sợi, ruốc tôm, xoài băm và trứng cút cay giòn.',
    category: 'Đồ ăn',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
    rating: { rate: 4.8, count: 310 },
  },
  {
    id: 12,
    title: 'Tai nghe chụp tai có mic học online',
    price: 1.5,
    description: 'Âm thanh sống động, chống ồn tốt, mic đàm thoại rõ ràng cho buổi học trực tuyến.',
    category: 'Thiết bị điện tử',
    image: 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg',
    rating: { rate: 4.4, count: 125 },
  },
];

export const productApi = {
  getProducts: async (limit: number = 12): Promise<Product[]> => {
    try {
      // 1. Thử lấy từ FakeStoreAPI qua Axios có gắn header X-Student-Id
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const response = await apiClient.get<Product[]>(`/products?limit=${limit}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (err) {
      // 2. Thử fetch fallback
      try {
        const fetchController = new AbortController();
        const fTimeout = setTimeout(() => fetchController.abort(), 3000);
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

    // 3. Fallback danh sách món mẫu KTXGo khi mạng ngoài/Cloudflare bị timeout
    return FALLBACK_PRODUCTS.slice(0, limit);
  },

  getProductById: async (id: string | number): Promise<Product> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const response = await apiClient.get<Product>(`/products/${id}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (response.data && response.data.id) {
        return response.data;
      }
    } catch (err) {
      try {
        const fetchController = new AbortController();
        const fTimeout = setTimeout(() => fetchController.abort(), 3000);
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
