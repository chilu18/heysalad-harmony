import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get('token');
      
      if (!token) {
        setError('No authentication token received');
        return;
      }

      try {
        // Immediate login without delays
        await login(token);
        // Immediate navigation
        navigate('/', { replace: true });
      } catch (err) {
        setError('Failed to authenticate. Please try again.');
      }
    };

    // Execute immediately
    handleCallback();
  }, [searchParams, login, navigate]);

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          backgroundColor: '#1a1a1a',
          borderRadius: '12px',
          maxWidth: '400px',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ color: '#fff', marginBottom: '1rem' }}>Authentication Failed</h2>
          <p style={{ color: '#999', marginBottom: '2rem' }}>{error}</p>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: '#E01D1D',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600',
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid #333',
          borderTopColor: '#E01D1D',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem',
        }} />
        <p style={{ color: '#fff', fontSize: '18px' }}>Signing you in...</p>
      </div>
    </div>
  );
}
