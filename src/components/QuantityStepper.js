import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

const QuantityStepper = ({ quantity, onIncrease, onDecrease, size = 'md' }) => {
    const isSmall = size === 'sm';

    return (
        <View style={styles.container}>
        <TouchableOpacity
            style={[styles.button, isSmall && styles.buttonSmall]}
            onPress={onDecrease}
            hitSlop={6}
        >
            <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>

        <Text style={[styles.quantity, isSmall && styles.quantitySmall]}>{quantity}</Text>

        <TouchableOpacity
            style={[styles.button, isSmall && styles.buttonSmall]}
            onPress={onIncrease}
            hitSlop={6}
        >
            <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        width: 32,
        height: 32,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSmall: {
        width: 26,
        height: 26,
    },
    buttonText: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.primary,
        fontWeight: '700',
    },
    quantity: {
        minWidth: 32,
        textAlign: 'center',
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.text,
        marginHorizontal: SPACING.sm,
    },
    quantitySmall: {
        minWidth: 24,
        marginHorizontal: SPACING.xs,
    },
});

export default QuantityStepper;
