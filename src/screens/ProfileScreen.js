import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import ScreenHeader from '../components/ScreenHeader';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import useAuthUser from '../hooks/useAuthUser';
import useFavorites from '../hooks/useFavorites';
import useOrders from '../hooks/useOrders';
import { signOutUser, updateDisplayName } from '../services/authService';
import { updateUserProfile } from '../services/userService';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../constants/theme';

const formatJoinDate = (isoString) => {
  if (!isoString) return null;
  return new Date(isoString).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
};

const ProfileScreen = ({ navigation }) => {
  const { user } = useAuthUser();
  const { favoriteIds } = useFavorites();
  const { orders } = useOrders();

  const [signingOut, setSigningOut] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.displayName || '');
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState(null);

  const startEditingName = () => {
    setNameInput(user?.displayName || '');
    setNameError(null);
    setIsEditingName(true);
  };

  const cancelEditingName = () => {
    setIsEditingName(false);
    setNameError(null);
  };

  const saveName = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setNameError('Name cannot be empty');
      return;
    }

    setSavingName(true);
    setNameError(null);

    const { error } = await updateDisplayName(trimmed);
    if (error) {
      setSavingName(false);
      setNameError(error);
      return;
    }

    try {
      await updateUserProfile(user.uid, { displayName: trimmed });
      setIsEditingName(false);
    } catch (err) {
      setNameError('Saved to your account, but failed to sync — try again.');
    } finally {
      setSavingName(false);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    const { error } = await signOutUser();
    setSigningOut(false);

    if (error) {
      Alert.alert('Sign out failed', error);
      return;
    }

    const rootNavigation = navigation.getParent() || navigation;
    rootNavigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScreenHeader title="Profile" />
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Sign in to manage your profile</Text>
        </View>
      </SafeAreaView>
    );
  }

  const initials = (user.displayName || user.email || '?').charAt(0).toUpperCase();
  const joinDate = formatJoinDate(user.metadata?.creationTime);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenHeader title="Profile" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          {user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarInitials}>{initials}</Text>
            </View>
          )}

          {isEditingName ? (
            <View style={styles.editNameBlock}>
              <CustomInput
                placeholder="Your name"
                value={nameInput}
                onChangeText={setNameInput}
                error={nameError}
              />

              <View style={styles.editNameActions}>
                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    savingName && styles.buttonDisabled,
                  ]}
                  onPress={cancelEditingName}
                  disabled={savingName}
                  activeOpacity={0.8}
                >
                  <Text style={styles.secondaryButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    savingName && styles.buttonDisabled,
                  ]}
                  onPress={saveName}
                  disabled={savingName}
                  activeOpacity={0.8}
                >
                  {savingName ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.nameRow}>
              <Text style={styles.name}>{user.displayName || 'Plant lover'}</Text>
              <TouchableOpacity
                onPress={startEditingName}
                hitSlop={8}
                style={styles.editIcon}
              >
                <Text style={styles.editIconText}>✎</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.email}>{user.email}</Text>
          {joinDate && (
            <Text style={styles.joinDate}>Member since - {joinDate}</Text>
          )}

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{orders.length}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{favoriteIds.length}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.signOutWrap}>
            <CustomButton
              title="Sign Out"
              onPress={handleSignOut}
              loading={signingOut}
              variant="danger"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    marginTop: 24,
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: SPACING.md,
  },
  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarInitials: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  editIcon: {
    marginLeft: SPACING.sm,
  },
  editIconText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
  },
  editNameBlock: {
    width: '100%',
    marginBottom: SPACING.sm,
  },
  editNameActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.inputBorder,
    backgroundColor: COLORS.surface || '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  secondaryButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  email: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  joinDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textFaint,
    marginTop: SPACING.xs,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.inputBorder,
    marginVertical: SPACING.lg,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.inputBorder,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  signOutWrap: {
    width: '100%',
    marginTop: SPACING.md,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
  },
});

export default ProfileScreen;