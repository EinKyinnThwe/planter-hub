import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import GoogleButton from '../components/GoogleButton';
import AuthHeaderText from '../components/AuthHeaderText';
import AuthFooterLink from '../components/AuthFooterLink';
import useLoginForm from '../hooks/useLoginForm';
import useGoogleSignIn from '../hooks/useGoogleSignIn';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';

const LoginScreen = ({ navigation }) => {
  const goToShop = () => {
    // Firestore user doc already exists (or was just created) by this point.
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    loading,
    handleSubmit,
  } = useLoginForm(goToShop);

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
          <AuthHeaderText title="Login" />

          <Text style={styles.subtitle}>Login to your Account</Text>

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

          <CustomButton title="S I G N  I N" onPress={handleSubmit} loading={loading} />

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <GoogleButton onPress={handleGoogleSignIn} loading={googleLoading} />

          <AuthFooterLink
            promptText="Don't have an account?"
            actionText="Sign Up"
            onPress={() => navigation.navigate('Signup')}
          />
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
  container: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    justifyContent: 'center',
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

export default LoginScreen;
