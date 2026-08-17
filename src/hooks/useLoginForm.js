import { useState } from 'react';
import { signInWithEmail } from '../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function useLoginForm(onSuccess) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!email) newErrors.email = 'Email is required';
        else if (!EMAIL_REGEX.test(email)) newErrors.email = 'Enter a valid email';

        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Minimum 6 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setLoading(true);
        const { user, error } = await signInWithEmail(email, password);
        setLoading(false);
        if (error) {
            setErrors({ form: error });
            return;
        }
        onSuccess && onSuccess(user);
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        errors,
        loading,
        handleSubmit,
    };
}
