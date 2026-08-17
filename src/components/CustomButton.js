import React from 'react';
import {
	TouchableOpacity,
	Text,
	StyleSheet,
	ActivityIndicator,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const CustomButton = ({
	title,
	onPress,
	loading = false,
	disabled = false,
	variant = 'primary', // 'primary' | 'danger'
}) => {
	return (
		<TouchableOpacity
			style={[
				styles.button,
				variant === 'danger' && styles.buttonDanger,
				(disabled || loading) && styles.buttonDisabled,
			]}
			onPress={onPress}
			activeOpacity={0.8}
			disabled={disabled || loading}
		>
			{loading ? (
				<ActivityIndicator color={COLORS.white} />
			) : (
				<Text style={styles.buttonText}>{title}</Text>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: COLORS.primary,
		borderRadius: 12,
		paddingVertical: SPACING.md,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: SPACING.sm,
	},
	buttonDanger: {
		backgroundColor: COLORS.danger,
	},
	buttonDisabled: {
		opacity: 0.6,
	},
	buttonText: {
		color: COLORS.white,
		fontSize: FONT_SIZES.md,
		fontWeight: '600',
	},
});

export default CustomButton;