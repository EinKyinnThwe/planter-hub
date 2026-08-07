import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const AuthFooterLink = ({ promptText, actionText, onPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.promptText}>{promptText} </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.actionText}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  promptText: {
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.md,
  },
  actionText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
  },
});

export default AuthFooterLink;
