import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../features/auth';

export function RegisterPage() {
  const navigate = useNavigate();

  const handleSwitchToLogin = () => {
    navigate('/login');
  };

  return <RegisterForm onSwitchToLogin={handleSwitchToLogin} />;
}
