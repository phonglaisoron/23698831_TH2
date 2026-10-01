import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { useCartStore } from '@stores/cartStore';

export const Watermark: React.FC = () => {
  const stamp = examStamp();
  const totalQuantity = useCartStore((s) => s.getTotalQuantity());
  const text = `TH2 · ${STUDENT.mssv} · ${STUDENT.hoTen} · #${stamp}`;

  return (
    <View style={[styles.container, VARIANT.watermarkAtTop ? styles.atTop : styles.atBottom]}>
      <Text style={styles.text} numberOfLines={1}>
        {text}
      </Text>
      <Text style={styles.badgeText}>({totalQuantity})</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: '#DBEAFE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: '#BFDBFE',
  },
  atTop: {
    borderBottomWidth: 1,
    borderTopWidth: 0,
    borderColor: '#BFDBFE',
  },
  atBottom: {
    borderTopWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#BFDBFE',
  },
  text: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#10357A',
    letterSpacing: 0.2,
    flex: 1,
  },
  badgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#10357A',
    marginLeft: 6,
  },
});

export default Watermark;
