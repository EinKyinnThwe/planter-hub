import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const SectionHeader = ({ title, onSeeAllPress }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            {onSeeAllPress && (
                <TouchableOpacity onPress={onSeeAllPress} hitSlop={6}>
                    <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    title: {
        fontSize: FONT_SIZES.lg,
        fontWeight: '700',
        color: COLORS.text,
    },
    seeAll: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.primary,
        fontWeight: '600',
    },
});

export default SectionHeader;
