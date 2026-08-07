import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import GoogleButton from '../components/GoogleButton';
import AuthHeaderText from '../components/AuthHeaderText';
import AuthFooterLink from '../components/AuthFooterLink';
import useSignupForm from '../hooks/useSignupForm';
import useGoogleSignIn from '../hooks/useGoogleSignIn';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const SignupScreen = ({ navigation }) => {
  const goToShop = () => {
    // Account created, users/{uid} written, "products" seeded if this was
    // the very first sign-up. Send them straight into the shop.
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    loading,
    handleSubmit,
  } = useSignupForm(goToShop);

  const {
    handleGoogleSignIn,
    loading: googleLoading,
    error: googleError,
  } = useGoogleSignIn(goToShop);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.backArrow}>{'\u2190'}</Text>
          </TouchableOpacity>

          <AuthHeaderText title="Sign Up" />

          <Text style={styles.subtitle}>Create your Account</Text>

          {(errors.form || googleError) && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errors.form || googleError}</Text>
            </View>
          )}

          <CustomInput
            placeholder="Enter Your Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
          />

          <CustomInput
            placeholder="Enter Your Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
          />

          <CustomInput
            placeholder="Enter Your Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            error={errors.confirmPassword}
          />

          <CustomButton title="S I G N  U P" onPress={handleSubmit} loading={loading} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleButton onPress={handleGoogleSignIn} loading={googleLoading} />

          <AuthFooterLink
            promptText="Already have an account?"
            actionText="Sign In"
            onPress={() => navigation.navigate('Login')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    justifyContent: 'center',
  },
  backButton: {
    marginBottom: SPACING.lg,
  },
  backArrow: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  errorBanner: {
    backgroundColor: COLORS.discountBg,
    borderRadius: 10,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  errorBannerText: {
    color: COLORS.discountText,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.inputBorder,
  },
  dividerText: {
    marginHorizontal: SPACING.sm,
    color: COLORS.textMuted,
    fontSize: FONT_SIZES.sm,
  },
});

export default SignupScreen;