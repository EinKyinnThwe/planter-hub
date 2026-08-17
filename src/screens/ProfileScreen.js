import React, {
  useEffect,
  useState,
} from 'react';

import {
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

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

import useAuthUser from '../hooks/useAuthUser';
import useFavorites from '../hooks/useFavorites';
import useOrders from '../hooks/useOrders';

import {
  signOutUser,
  updateDisplayName,
} from '../services/authService';

import {
  fetchUserProfile,
  updateUserProfile,
} from '../services/userService';

import {
  logButtonClick,
  logScreenView,
  logErrorToCrashlytics,
} from '../services/analyticsService';

import {
  COLORS,
  SPACING,
  FONT_SIZES,
} from '../constants/theme';


const formatJoinDate = (
  isoString
) => {
  if (!isoString) {
    return null;
  }

  const date =
    new Date(isoString);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return null;
  }

  return date.toLocaleDateString(
    undefined,
    {
      month: 'long',
      year: 'numeric',
    }
  );
};


const ProfileScreen = () => {
  const {
    user,
  } = useAuthUser();

  const {
    favoriteIds,
  } = useFavorites();

  const {
    orders,
  } = useOrders();


  // Firestore profile
  const [
    profile,
    setProfile,
  ] = useState(null);

  const [
    loadingProfile,
    setLoadingProfile,
  ] = useState(false);


  // Sign out
  const [
    signingOut,
    setSigningOut,
  ] = useState(false);


  // Name editing
  const [
    isEditingName,
    setIsEditingName,
  ] = useState(false);

  const [
    nameInput,
    setNameInput,
  ] = useState('');

  const [
    savingName,
    setSavingName,
  ] = useState(false);

  const [
    nameError,
    setNameError,
  ] = useState(null);


  useEffect(() => {
    logScreenView(
      'ProfileScreen'
    );
  }, []);

  //Load firestore profile
  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      if (!user?.uid) {
        setProfile(null);
        return;
      }

      try {
        setLoadingProfile(true);

        const firestoreProfile =
          await fetchUserProfile(
            user.uid
          );

        if (
          mounted &&
          firestoreProfile
        ) {
          setProfile(
            firestoreProfile
          );
        }
      } catch (error) {
        console.error(
          'Failed to load profile:',
          error
        );

        logErrorToCrashlytics(
          error,
          'ProfileScreen - Failed to load profile'
        );
      } finally {
        if (mounted) {
          setLoadingProfile(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [user?.uid]);

  const displayName =
    profile?.displayName ||
    user?.displayName ||
    'Plant lover';


  const email =
    profile?.email ||
    user?.email ||
    null;


  const photoURL =
    profile?.photoURL ||
    user?.photoURL ||
    null;


  const initials = (
    displayName ||
    email ||
    '?'
  )
    .charAt(0)
    .toUpperCase();


  const joinDate =
    formatJoinDate(
      user?.metadata?.creationTime
    );


  const startEditingName = () => {
    setNameInput(
      displayName
    );

    setNameError(null);
    setIsEditingName(true);

    logButtonClick(
      'edit_profile_name',
      'ProfileScreen'
    );
  };


  const cancelEditingName = () => {
    setNameInput(
      displayName
    );

    setNameError(null);
    setIsEditingName(false);

    logButtonClick(
      'cancel_edit_name',
      'ProfileScreen'
    );
  };


  const saveName = async () => {
    const trimmed =
      nameInput.trim();


    if (!trimmed) {
      setNameError(
        'Name cannot be empty'
      );

      return;
    }


    if (!user?.uid) {
      setNameError(
        'User account not available'
      );

      return;
    }


    setSavingName(true);
    setNameError(null);


    try {
      logButtonClick(
        'save_profile_name',
        'ProfileScreen'
      );

      const authResult =
        await updateDisplayName(
          trimmed
        );


      if (authResult?.error) {
        setNameError(
          String(
            authResult.error
          )
        );

        return;
      }

      await updateUserProfile(
        user.uid,
        {
          displayName:
            trimmed,
        }
      );

      setProfile(
        (currentProfile) => ({
          ...(currentProfile || {}),
          displayName:
            trimmed,
        })
      );


      setNameInput(
        trimmed
      );

      setIsEditingName(
        false
      );


      Alert.alert(
        'Profile updated',
        'Your name has been updated.'
      );


    } catch (error) {
      console.error(
        'Failed to save name:',
        error
      );


      setNameError(
        'Unable to update your name. Please try again.'
      );


      logErrorToCrashlytics(
        error,
        'ProfileScreen - Failed to save name'
      );


    } finally {
      setSavingName(false);
    }
  };


  const handleSignOut = async () => {
    if (signingOut) {
      return;
    }
    try {
      setSigningOut(true);
      console.log(
        'Signing out...'
      );
      logButtonClick(
        'sign_out',
        'ProfileScreen'
      );
      const result =
        await signOutUser();


      if (result?.error) {
        Alert.alert(
          'Sign out failed',
          String(
            result.error
          )
        );
        return;
      }
      console.log(
        'Sign out successful'
      );
    } catch (error) {
      console.error(
        'Sign out failed:',
        error
      );


      logErrorToCrashlytics(
        error,
        'ProfileScreen - Sign out failed'
      );


      Alert.alert(
        'Sign out failed',
        'Unable to sign out. Please try again.'
      );


    } finally {
      setSigningOut(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView
        style={
          styles.safeArea
        }
      >
        <ScreenHeader
          title="Profile"
        />

        <View
          style={
            styles.centered
          }
        >
          <Text
            style={
              styles.emptyText
            }
          >
            Sign in to manage
            your profile
          </Text>
        </View>
      </SafeAreaView>
    );
  }


  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >

      <ScreenHeader
        title="Profile"
      />


      <KeyboardAvoidingView
        style={{
          flex: 1,
        }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        <ScrollView
          contentContainerStyle={
            styles.content
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >

          {photoURL ? (
            <Image
              source={{
                uri: photoURL,
              }}
              style={
                styles.avatarImage
              }
            />
          ) : (
            <View
              style={
                styles.avatarFallback
              }
            >
              <Text
                style={
                  styles.avatarInitials
                }
              >
                {initials}
              </Text>
            </View>
          )}

          {isEditingName ? (

            <View
              style={
                styles.editNameBlock
              }
            >

              <CustomInput
                placeholder="Your name"
                value={nameInput}
                onChangeText={
                  setNameInput
                }
                error={
                  nameError
                }
                editable={
                  !savingName
                }
              />


              <View
                style={
                  styles.editNameActions
                }
              >

                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    savingName &&
                      styles.buttonDisabled,
                  ]}
                  onPress={
                    cancelEditingName
                  }
                  disabled={
                    savingName
                  }
                  activeOpacity={0.8}
                >

                  <Text
                    style={
                      styles.secondaryButtonText
                    }
                  >
                    Cancel
                  </Text>

                </TouchableOpacity>


                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    savingName &&
                      styles.buttonDisabled,
                  ]}
                  onPress={
                    saveName
                  }
                  disabled={
                    savingName
                  }
                  activeOpacity={0.8}
                >

                  {savingName ? (

                    <ActivityIndicator
                      color="#fff"
                    />

                  ) : (

                    <Text
                      style={
                        styles.primaryButtonText
                      }
                    >
                      Save
                    </Text>

                  )}

                </TouchableOpacity>

              </View>

            </View>

          ) : (

            <View
              style={
                styles.nameRow
              }
            >

              <Text
                style={
                  styles.name
                }
              >
                {loadingProfile
                  ? 'Loading...'
                  : displayName}
              </Text>


              <TouchableOpacity
                onPress={
                  startEditingName
                }
                hitSlop={8}
                style={
                  styles.editIcon
                }
                activeOpacity={0.7}
              >

                <Text
                  style={
                    styles.editIconText
                  }
                >✎</Text>

              </TouchableOpacity>

            </View>

          )}
          
          {email ? (
            <Text
              style={
                styles.email
              }
            >
              {email}
            </Text>
          ) : null}

          {joinDate ? (
            <Text
              style={
                styles.joinDate
              }
            >
              Member since  - {' '}
              {joinDate}
            </Text>
          ) : null}


          <View
            style={
              styles.divider
            }
          />

          <View
            style={
              styles.statsRow
            }
          >

            <View
              style={
                styles.statItem
              }
            >

              <Text
                style={
                  styles.statValue
                }
              >
                {orders?.length ||
                  0}
              </Text>

              <Text
                style={
                  styles.statLabel
                }
              >
                Orders
              </Text>

            </View>


            <View
              style={
                styles.statDivider
              }
            />


            <View
              style={
                styles.statItem
              }
            >

              <Text
                style={
                  styles.statValue
                }
              >
                {favoriteIds?.length ||
                  0}
              </Text>

              <Text
                style={
                  styles.statLabel
                }
              >
                Favorites
              </Text>

            </View>

          </View>


          <View
            style={
              styles.divider
            }
          />

          <View
            style={
              styles.signOutWrap
            }
          >

            <CustomButton
              title="Sign Out"
              onPress={
                handleSignOut
              }
              loading={
                signingOut
              }
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
    flex: 1,
    backgroundColor:
      COLORS.background,
  },


  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal:
      SPACING.lg,
    paddingTop:
      SPACING.xl,
    paddingBottom:
      SPACING.xl,
  },


  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent:
      'center',
    paddingHorizontal:
      SPACING.lg,
  },


  avatarImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom:
      SPACING.md,
  },


  avatarFallback: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor:
      COLORS.primaryLight,
    alignItems: 'center',
    justifyContent:
      'center',
    marginBottom:
      SPACING.md,
  },


  avatarInitials: {
    fontSize:
      FONT_SIZES.xxl,
    fontWeight: '700',
    color:
      COLORS.primary,
  },


  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },


  name: {
    fontSize:
      FONT_SIZES.xl,
    fontWeight: '700',
    color:
      COLORS.text,
  },


  editIcon: {
    marginLeft: SPACING.sm,
    color: COLORS.primary,
    fontWeight: 'bold',
  },


  editIconText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: 'bold',
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
    borderColor:
      COLORS.inputBorder,
    backgroundColor:
      COLORS.surface || '#fff',
    alignItems: 'center',
    justifyContent:
      'center',
    marginRight:
      SPACING.sm,
  },


  secondaryButtonText: {
    fontSize:
      FONT_SIZES.md,
    fontWeight: '600',
    color:
      COLORS.textMuted,
  },


  primaryButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor:
      COLORS.primary,
    alignItems: 'center',
    justifyContent:
      'center',
  },


  primaryButtonText: {
    fontSize:
      FONT_SIZES.md,
    fontWeight: '600',
    color: '#fff',
  },


  buttonDisabled: {
    opacity: 0.6,
  },


  email: {
    fontSize:
      FONT_SIZES.md,
    color:
      COLORS.textMuted,
    marginTop: 2,
  },


  joinDate: {
    fontSize:
      FONT_SIZES.sm,
    color:
      COLORS.textFaint,
    marginTop:
      SPACING.xs,
  },


  divider: {
    height: 1,
    width: '100%',
    backgroundColor:
      COLORS.inputBorder,
    marginVertical:
      SPACING.lg,
  },


  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:
      'center',
    width: '100%',
  },


  statItem: {
    flex: 1,
    alignItems: 'center',
  },


  statDivider: {
    width: 1,
    height: 32,
    backgroundColor:
      COLORS.inputBorder,
  },


  statValue: {
    fontSize:
      FONT_SIZES.xl,
    fontWeight: '700',
    color:
      COLORS.text,
  },


  statLabel: {
    fontSize:
      FONT_SIZES.sm,
    color:
      COLORS.textMuted,
    marginTop: 2,
  },


  signOutWrap: {
    width: '100%',
    marginTop:
      SPACING.md,
  },


  emptyText: {
    fontSize:
      FONT_SIZES.md,
    color:
      COLORS.textMuted,
    textAlign: 'center',
  },

});


export default ProfileScreen;
