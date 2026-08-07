import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const CustomInput = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  error,
}) => {
  return (
    <View style={styles.wrapper}>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  inputError: {
    borderColor: '#E14848',
  },
  errorText: {
    color: '#E14848',
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
    marginLeft: SPACING.xs,
  },
});

export default CustomInput;
