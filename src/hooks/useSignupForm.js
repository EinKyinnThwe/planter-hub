import { useState } from 'react';
import { signUpWithEmail } from '../services/authService';
import { ensureUserProfile } from '../services/userService';
import { seedProductsIfEmpty } from '../services/productService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function useSignupForm(onSuccess) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
	const newErrors = {};
	if (!email) newErrors.email = 'Email is required';
	else if (!EMAIL_REGEX.test(email)) newErrors.email = 'Enter a valid email';

	if (!password) newErrors.password = 'Password is required';
	else if (password.length < 6) newErrors.password = 'Minimum 6 characters';

	if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
	else if (confirmPassword !== password) newErrors.confirmPassword = 'Passwords do not match';

	setErrors(newErrors);
	return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
	if (!validate()) return;

	setLoading(true);

	const { user, error } = await signUpWithEmail(email, password);
	if (error) {
	  setLoading(false);
	  setErrors({ form: error });
	  return;
	}

	try {
	  const { isNewUser } = await ensureUserProfile(user);
	  if (isNewUser) {
		await seedProductsIfEmpty();
	  }
	  onSuccess && onSuccess(user);
	} catch (err) {
	  setErrors({ form: 'Account created, but setup failed. Please try logging in.' });
	} finally {
	  setLoading(false);
	}
  };

  return {
	email,
	setEmail,
	password,
	setPassword,
	confirmPassword,
	setConfirmPassword,
	errors,
	loading,
	handleSubmit,
  };
}
