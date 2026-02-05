import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../features/auth';
import { useAuthStore } from '../features/auth/hooks';

export function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return <LoginForm onSwitchToRegister={handleSwitchToRegister} />;
}
