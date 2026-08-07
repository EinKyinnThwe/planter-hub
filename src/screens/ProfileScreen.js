import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

const ProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Profile" />
      <View style={styles.emptyState}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>🙂</Text>
        </View>
        <Text style={styles.emptyText}>Sign in to manage your profile</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  avatarEmoji: {
    fontSize: 36,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
});

export default ProfileScreen;
