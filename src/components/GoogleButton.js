import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

const GoogleButton = ({ onPress, loading = false, disabled = false }) => {
    return (
        <TouchableOpacity
        style={[styles.button, (disabled || loading) && styles.buttonDisabled]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled || loading}
        >
        {loading ? (
            <ActivityIndicator color={COLORS.text} />
        ) : (
            <>
            <Text style={styles.gIcon}>G</Text>
            <Text style={styles.buttonText}>Continue with Google</Text>
            </>
        )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.inputBorder,
        borderRadius: RADIUS.md,
        paddingVertical: SPACING.md,
        marginTop: SPACING.sm,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    gIcon: {
        fontSize: FONT_SIZES.md,
        fontWeight: '800',
        color: '#4285F4',
        marginRight: SPACING.sm,
    },
    buttonText: {
        color: COLORS.text,
        fontSize: FONT_SIZES.md,
        fontWeight: '600',
    },
});

export default GoogleButton;
