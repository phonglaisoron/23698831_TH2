import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STUDENT, examStamp, VARIANT } from '@constants/student';
import { theme } from '@constants/theme';

export const Watermark: React.FC = () => {
  const stamp = examStamp();
  const text = `TH2 · ${STUDENT.mssv} · ${STUDENT.hoTen} · #${stamp}`;

  return (
    <View style={[styles.container, VARIANT.watermarkAtTop ? styles.atTop : styles.atBottom]}>
      <Text style={styles.text} numberOfLines={1}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(29, 78, 216, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: theme.colors.border,
  },
  atTop: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: 0,
  },
  atBottom: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
});

export default Watermark;
