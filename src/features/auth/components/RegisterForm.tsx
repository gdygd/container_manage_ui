import { useState, type FormEvent, type ChangeEvent } from 'react';
import { useRegister } from '../hooks';
import { createApiError } from '../../../api/error';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

interface FormData {
  username: string;
  password: string;
  confirmPassword: string;
  full_name: string;
  email: string;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const { mutateAsync: register, isPending, error } = useRegister();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    email: '',
  });
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('Password must be at least 6 characters');
      return;
    }

    try {
      const result = await register({
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name,
        email: formData.email,
      });

      if (result.success) {
        setSuccess(true);
      } else {
        setLocalError(result.message || 'Registration failed');
      }
    } catch (err) {
      const apiError = createApiError(err);
      setLocalError(apiError.message);
    }
  };

  const displayError = localError || (error ? createApiError(error).message : null);

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h1>Registration Successful</h1>
            <p>Your account has been created</p>
          </div>
          <div className="auth-success">
            <p>You can now sign in with your credentials.</p>
            <button className="auth-btn" onClick={onSwitchToLogin}>
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Container Manager</h1>
          <p>Create a new account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {displayError && (
            <div className="auth-error">{displayError}</div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={isPending}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={isPending}>
            {isPending ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <button className="link-btn" onClick={onSwitchToLogin}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
