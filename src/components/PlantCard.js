import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

const PlantCard = ({ plant, isFavorite, onPress, onToggleFavorite, style }) => {
    const hasDiscount = !!plant.discountPercent && !!plant.originalPrice;

    return (
        <TouchableOpacity
            style={[styles.card, style]}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <View style={styles.imageBox}>
                <View style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>{plant.category}</Text>
                </View>
                <Text style={styles.emoji}>{plant.emoji}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.name} numberOfLines={1}>
                    {plant.name}
                </Text>
                <TouchableOpacity onPress={onToggleFavorite} hitSlop={6}>
                    <Text style={styles.heart}>{isFavorite ? '♥' : '♡'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.ratingRow}>
                <Text style={styles.star}>★</Text>
                <Text style={styles.ratingText}>
                    {plant.rating.toFixed(1)} ({plant.reviewCount}) · {plant.sold} sold
                </Text>
            </View>

            <View style={styles.priceRow}>
                {hasDiscount && (
                    <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>{plant.discountPercent}%</Text>
                    </View>
                )}
                <Text style={styles.price}>${plant.price.toFixed(2)}</Text>
                {hasDiscount && (
                    <Text style={styles.originalPrice}>${plant.originalPrice.toFixed(2)}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.md,
        padding: SPACING.sm,
    },
    imageBox: {
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        height: 130,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.sm,
    },
    categoryTag: {
        position: 'absolute',
        top: SPACING.sm,
        left: SPACING.sm,
        backgroundColor: 'rgba(31,42,36,0.75)',
        borderRadius: RADIUS.sm,
        paddingHorizontal: SPACING.sm,
        paddingVertical: 2,
    },
    categoryTagText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.xs,
        fontWeight: '600',
    },
    emoji: {
        fontSize: 48,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.text,
        marginRight: SPACING.xs,
    },
    heart: {
        fontSize: FONT_SIZES.lg,
        color: COLORS.danger,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    star: {
        color: COLORS.star,
        fontSize: FONT_SIZES.sm,
        marginRight: 4,
    },
    ratingText: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textMuted,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.xs,
    },
    discountBadge: {
        backgroundColor: COLORS.discountBg,
        borderRadius: RADIUS.sm,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginRight: SPACING.xs,
    },
    discountText: {
        color: COLORS.discountText,
        fontSize: FONT_SIZES.xs,
        fontWeight: '700',
    },
    price: {
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.text,
        marginRight: SPACING.xs,
    },
    originalPrice: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.strikethrough,
        textDecorationLine: 'line-through',
    },
});

export default PlantCard;
