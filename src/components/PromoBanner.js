import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

const PromoBanner = ({
    headline = 'Discount up to',
    percent = '25%',
    subtext = 'First transaction up to $500',
    dateRange = '',
    onShopPress,
}) => {
    return (
        <View style={styles.card}>
        <View style={styles.textBlock}>
            <Text style={styles.headline}>{headline}</Text>
            <Text style={styles.percent}>{percent}</Text>
            <Text style={styles.subtext}>{subtext}</Text>
            {!!dateRange && <Text style={styles.dateRange}>{dateRange}</Text>}
            <Text style={styles.terms}>Term of Condition</Text>
        </View>

        <View style={styles.rightSide}>
            <Text style={styles.plantEmoji}>🪴</Text>
            <TouchableOpacity style={styles.shopButton} onPress={onShopPress}>
            <Text style={styles.shopButtonText}>Shop now</Text>
            </TouchableOpacity>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#1F2A24',
        borderRadius: RADIUS.lg,
        marginHorizontal: SPACING.lg,
        padding: SPACING.lg,
        overflow: 'hidden',
    },
    textBlock: {
        flex: 1,
    },
    headline: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        opacity: 0.85,
    },
    percent: {
        color: COLORS.white,
        fontSize: FONT_SIZES.xxl,
        fontWeight: '800',
        marginTop: 2,
    },
    subtext: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        marginTop: SPACING.xs,
        opacity: 0.9,
    },
    dateRange: {
        color: COLORS.white,
        fontSize: FONT_SIZES.xs,
        opacity: 0.7,
        marginTop: 2,
    },
    terms: {
        color: COLORS.white,
        fontSize: FONT_SIZES.xs,
        opacity: 0.6,
        marginTop: SPACING.sm,
        textDecorationLine: 'underline',
    },
    rightSide: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    plantEmoji: {
        fontSize: 40,
    },
    shopButton: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.pill,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
    },
    shopButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.sm,
        fontWeight: '700',
    },
});

export default PromoBanner;
