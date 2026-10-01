import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Product } from '@services/productApi';
import { theme } from '@constants/theme';
import { PRICE_MULTIPLIER, VARIANT } from '@constants/student';

interface ProductCardProps {
  product: Product;
  index?: number;
  onPress: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - theme.spacing.lg * 2 - theme.spacing.md) / 2;

const PASTEL_COLORS = [
  { bg: '#FEF3C7', oval: '#93C5FD', rect: '#1D4ED8' }, // Vàng pastel (Cơm nắm)
  { bg: '#E0F2FE', oval: '#93C5FD', rect: '#1D4ED8' }, // Xanh dương pastel (Trà sữa)
  { bg: '#DCFCE7', oval: '#93C5FD', rect: '#1D4ED8' }, // Xanh lá pastel (Bút bi)
  { bg: '#FEE2E2', oval: '#93C5FD', rect: '#1D4ED8' }, // Hồng/đỏ pastel (Mì ly)
];

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index = 0,
  onPress,
  onAddToCart,
}) => {
  const priceVnd = Math.round(product.price * PRICE_MULTIPLIER).toLocaleString('vi-VN') + ' đ';
  const pastel = PASTEL_COLORS[index % PASTEL_COLORS.length];

  const handleAddPress = async (e: any) => {
    e.stopPropagation?.();
    try {
      if (VARIANT.hapticOnAdd === 'impact') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        await Haptics.selectionAsync();
      }
    } catch {}
    onAddToCart(product);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => onPress(product)}
    >
      {/* Khung hình pastel giống hệt hình minh họa đề thi */}
      <View style={[styles.imageContainer, { backgroundColor: pastel.bg }]}>
        <View style={[styles.mockOval, { backgroundColor: pastel.oval }]}>
          <View style={[styles.mockRect, { backgroundColor: pastel.rect }]} />
        </View>
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={styles.realImage}
            resizeMode="contain"
          />
        ) : null}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {product.title}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{priceVnd}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddPress}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    padding: 8,
  },
  imageContainer: {
    height: 105,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mockOval: {
    width: '78%',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.9,
  },
  mockRect: {
    width: '70%',
    height: 22,
    borderRadius: 4,
  },
  realImage: {
    position: 'absolute',
    width: '75%',
    height: '75%',
    opacity: 0.15,
  },
  content: {
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  price: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
    flex: 1,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
});

export default ProductCard;
