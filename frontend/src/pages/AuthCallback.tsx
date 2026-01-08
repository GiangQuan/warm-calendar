import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';

export default function AuthCallback() {
  const { setUser } = useAuth() as any; // Ép kiểu tạm thời nếu AuthContext chưa export setUser
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.getCurrentUser();
        if (response.user) {
          // Lưu user vào state và quay về calendar
          setUser(response.user);
          navigate('/calendar');
        } else {
          navigate('/auth?error=session_failed');
        }
      } catch (error) {
        console.error('Failed to fetch user after Google login', error);
        navigate('/auth?error=callback_error');
      }
    };

    fetchUser();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
      <p className="text-muted-foreground font-medium">Finalizing login...</p>
    </div>
  );
}
