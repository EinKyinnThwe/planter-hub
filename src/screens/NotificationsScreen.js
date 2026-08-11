import React from 'react';
import { SafeAreaView, View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

import NotificationListItem from '../components/NotificationListItem';
import EmptyNotifications from '../components/EmptyNotifications';
import useNotifications from '../hooks/useNotifications';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const NotificationsScreen = ({ navigation }) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const handlePress = (id) => {
    markAsRead(id);
  };

  const handleViewPlant = (plantId) => {
    navigation.navigate('PlantDetail', { plantId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleBlock}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.headerSubtitle}>{unreadCount} unread</Text>
          )}
        </View>

        <View style={{ width: 24 }} />
      </View>

      {notifications.length > 0 && (
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={markAllAsRead} hitSlop={6}>
            <Text style={styles.actionLink}>Mark all as read</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAll} hitSlop={6}>
            <Text style={[styles.actionLink, styles.clearLink]}>Clear all</Text>
          </TouchableOpacity>
        </View>
      )}

      {notifications.length === 0 ? (
        <EmptyNotifications />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <NotificationListItem
              notification={item}
              onPress={handlePress}
              onDelete={removeNotification}
              onViewPlant={handleViewPlant}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backArrow: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.primary,
  },
  headerTitleBlock: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  actionLink: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  clearLink: {
    color: COLORS.danger,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.inputBorder,
    marginLeft: SPACING.lg + 44 + SPACING.md,
  },
  listContent: {
    paddingBottom: SPACING.xl,
  },
});

export default NotificationsScreen;