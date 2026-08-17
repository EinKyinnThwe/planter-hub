import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import QuantityStepper from './QuantityStepper';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

const CartItemRow = ({ item, onIncrease, onDecrease, onRemove }) => {
    const { plant, quantity } = item;

    return (
        <View style={styles.row}>
            <View style={styles.imageBox}>
                <Text style={styles.emoji}>{plant.emoji}</Text>
            </View>

            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                    {plant.name}
                </Text>
                <Text style={styles.price}>${plant.price.toFixed(2)}</Text>

                <View style={styles.bottomRow}>
                    <QuantityStepper
                        quantity={quantity}
                        onIncrease={onIncrease}
                        onDecrease={onDecrease}
                        size="sm"
                    />
                    <TouchableOpacity onPress={onRemove} hitSlop={8}>
                        <Text style={styles.removeText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.sm,
    },
    imageBox: {
        width: 64,
        height: 64,
        borderRadius: RADIUS.sm,
        backgroundColor: COLORS.primaryLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    emoji: {
        fontSize: 30,
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
        color: COLORS.text,
    },
    price: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: '700',
        marginTop: 2,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: SPACING.sm,
    },
    removeText: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.danger,
        fontWeight: '600',
    },
});

export default CartItemRow;
