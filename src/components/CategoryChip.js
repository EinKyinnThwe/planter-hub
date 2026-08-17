import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

const CategoryChip = ({ label, active, onPress }) => {
    return (
        <TouchableOpacity
        style={[styles.chip, active && styles.chipActive]}
        onPress={onPress}
        activeOpacity={0.8}
        >
        <Text
            style={[styles.label, active && styles.labelActive]}
            numberOfLines={1}
        >
            {label}
        </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        height: 40,
        borderRadius: RADIUS.pill,
        paddingHorizontal: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start', // never stretch to the row's cross-axis height
        backgroundColor: COLORS.chipInactiveBg,
        borderWidth: 1,
        borderColor: COLORS.chipInactiveBorder,
        marginRight: SPACING.sm,
    },
    chipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    label: {
        fontSize: FONT_SIZES.sm,
        fontWeight: '600',
        color: COLORS.text,
    },
    labelActive: {
        color: COLORS.white,
    },
});

export default CategoryChip;