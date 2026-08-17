import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { relativeTime } from '../utils/relativeTime';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

const TYPE_META = {
    order: { emoji: '📦', tint: COLORS.primaryLight },
    restock: { emoji: '🌱', tint: '#FFF4E0' },
    promo: { emoji: '🎁', tint: '#F3E8FF' },
    default: { emoji: '🔔', tint: COLORS.surface },
};

const NotificationListItem = ({ notification, onPress, onDelete, onViewPlant }) => {
    const swipeableRef = useRef(null);
    const meta = TYPE_META[notification.data?.type] || TYPE_META.default;
    const plantId = notification.data?.plantId;

    const renderRightActions = (progress, dragX) => {
        const translateX = dragX.interpolate({
            inputRange: [-80, 0],
            outputRange: [0, 80],
            extrapolate: 'clamp',
        });

        return (
            <TouchableOpacity
                style={styles.deleteAction}
                onPress={() => {
                    swipeableRef.current?.close();
                    onDelete(notification.id);
                }}
            >
                <Animated.Text style={[styles.deleteActionText, { transform: [{ translateX }] }]}>
                    Delete
                </Animated.Text>
            </TouchableOpacity>
        );
    };

    return (
        <Swipeable ref={swipeableRef} renderRightActions={renderRightActions} overshootRight={false}>
            <TouchableOpacity
                style={[styles.row, !notification.read && styles.rowUnread]}
                onPress={() => onPress(notification.id)}
                activeOpacity={0.7}
            >
                {!notification.read && <View style={styles.unreadDot} />}

                <View style={[styles.iconCircle, { backgroundColor: meta.tint }]}>
                    <Text style={styles.iconEmoji}>{meta.emoji}</Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title} numberOfLines={1}>
                            {notification.title}
                        </Text>
                        <Text style={styles.time}>{relativeTime(notification.receivedAt)}</Text>
                    </View>

                    <Text style={styles.body} numberOfLines={2}>
                        {notification.body}
                    </Text>

                    {plantId && (
                        <View style={styles.actionsRow}>
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={() => onViewPlant(plantId)}
                            >
                                <Text style={styles.actionButtonText}>View Plant</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.actionButtonGhost}
                                onPress={() => onDelete(notification.id)}
                            >
                                <Text style={styles.actionButtonGhostText}>Dismiss</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: COLORS.background,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    rowUnread: {
        backgroundColor: COLORS.primaryLight + '55',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
        marginTop: 6,
        marginRight: SPACING.sm,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: SPACING.md,
    },
    iconEmoji: {
        fontSize: 20,
    },
    content: {
        flex: 1,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        flex: 1,
        fontSize: FONT_SIZES.md,
        fontWeight: '700',
        color: COLORS.text,
        marginRight: SPACING.sm,
    },
    time: {
        fontSize: FONT_SIZES.xs,
        color: COLORS.textFaint,
    },
    body: {
        fontSize: FONT_SIZES.sm,
        color: COLORS.textMuted,
        marginTop: 2,
        lineHeight: 18,
    },
    actionsRow: {
        flexDirection: 'row',
        marginTop: SPACING.sm,
    },
    actionButton: {
        backgroundColor: COLORS.primary,
        borderRadius: RADIUS.sm,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        marginRight: SPACING.sm,
    },
    actionButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZES.xs,
        fontWeight: '700',
    },
    actionButtonGhost: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
    },
    actionButtonGhostText: {
        color: COLORS.textMuted,
        fontSize: FONT_SIZES.xs,
        fontWeight: '700',
    },
    deleteAction: {
        width: 80,
        backgroundColor: COLORS.danger,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteActionText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: FONT_SIZES.sm,
    },
});

export default NotificationListItem;