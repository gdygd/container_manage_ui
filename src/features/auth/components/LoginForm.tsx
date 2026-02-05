import { useState, type FormEvent } from 'react';
import { useLogin } from '../hooks';
import { createApiError } from '../../../api/error';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const { mutateAsync: login, isPending, error } = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    try {
      await login({ username, password });
    } catch (err) {
      const apiError = createApiError(err);
      setLocalError(apiError.message);
    }
  };

  const displayError = localError || (error ? createApiError(error).message : null);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Container Manager</h1>
          <p>Sign in to your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {displayError && (
            <div className="auth-error">{displayError}</div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              disabled={isPending}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={isPending}
            />
          </div>

          <button type="submit" className="auth-btn" disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don&apos;t have an account?{' '}
            <button className="link-btn" onClick={onSwitchToRegister}>
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
