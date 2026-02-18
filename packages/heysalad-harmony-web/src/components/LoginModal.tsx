import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const OAUTH_BASE_URL = 'https://oauth.heysalad.app';

type AuthMode = 'magic_link' | 'email_otp';
type Screen = 'input' | 'magic_link_sent' | 'otp_verify';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('magic_link');
  const [screen, setScreen] = useState<Screen>('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setAuthMode('magic_link');
      setScreen('input');
      setError('');
      setOtpCode(['', '', '', '', '', '']);
      setResendTimer(0);
    }
  }, [isOpen]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSendMagicLink = async () => {
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const redirectUrl = window.location.origin + '/auth/callback';
      const response = await fetch(`${OAUTH_BASE_URL}/api/auth/send-magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirectUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setScreen('magic_link_sent');
        setResendTimer(30);
      } else {
        setError(data.message || 'Failed to send magic link');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailOTP = async () => {
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${OAUTH_BASE_URL}/api/auth/send-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setScreen('otp_verify');
        setResendTimer(30);
        setOtpCode(['', '', '', '', '', '']);
      } else {
        setError(data.message || 'Failed to send code');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (code: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${OAUTH_BASE_URL}/api/auth/verify-email-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        await login(data.token);
        onClose();
      } else {
        setError(data.message || 'Invalid code');
        setOtpCode(['', '', '', '', '', '']);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...otpCode];
    newCode[index] = value;
    setOtpCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }

    // Auto-submit when complete
    if (newCode.every(d => d) && newCode.join('').length === 6) {
      handleVerifyOTP(newCode.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...otpCode];
    pasted.split('').forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });
    setOtpCode(newCode);
    if (pasted.length === 6) {
      handleVerifyOTP(pasted);
    }
  };

  const handleSubmit = () => {
    if (authMode === 'magic_link') {
      handleSendMagicLink();
    } else {
      handleSendEmailOTP();
    }
  };

  const goBack = () => {
    setScreen('input');
    setError('');
    setOtpCode(['', '', '', '', '', '']);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-8">
          <img 
            src="/heysalad-white-logo.svg" 
            alt="HeySalad" 
            className="h-10 mb-4"
          />
          <h2 className="text-2xl font-bold text-white mb-2">Sign in to Harmony</h2>
          <p className="text-zinc-400 text-sm">
            Global team collaboration platform
          </p>
        </div>

        {/* Input Screen */}
        {screen === 'input' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#E01D1D] focus:border-transparent"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                autoFocus
              />
            </div>
            
            <p className="text-sm text-zinc-400">
              {authMode === 'magic_link' 
                ? "We'll send you a magic link" 
                : "We'll send you a 6-digit code"}
            </p>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button 
              className="w-full py-3 bg-[#E01D1D] hover:bg-[#c91919] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Sending...' : authMode === 'magic_link' ? 'Send Magic Link' : 'Send Code'}
            </button>

            <button 
              className="w-full py-2 text-sm text-zinc-400 hover:text-white transition-colors"
              onClick={() => setAuthMode(authMode === 'magic_link' ? 'email_otp' : 'magic_link')}
            >
              {authMode === 'magic_link' ? 'Send me a code instead' : 'Send me a magic link instead'}
            </button>
          </div>
        )}

        {/* Magic Link Sent Screen */}
        {screen === 'magic_link_sent' && (
          <div className="space-y-4">
            <button 
              className="text-sm text-zinc-400 hover:text-white transition-colors mb-4"
              onClick={goBack}
            >
              ← Back
            </button>
            
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">✉️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Check your email</h3>
              <p className="text-zinc-400 text-sm">
                We sent a magic link to <strong className="text-white">{email}</strong>
              </p>
              <p className="text-zinc-500 text-xs mt-2">
                Click the link in the email to sign in. The link expires in 15 minutes.
              </p>
            </div>
            
            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-zinc-500">Resend email in {resendTimer}s</p>
              ) : (
                <button 
                  className="text-sm text-[#E01D1D] hover:text-[#c91919] transition-colors"
                  onClick={handleSendMagicLink} 
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Resend email'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* OTP Verify Screen */}
        {screen === 'otp_verify' && (
          <div className="space-y-4">
            <button 
              className="text-sm text-zinc-400 hover:text-white transition-colors mb-4"
              onClick={goBack}
            >
              ← Back
            </button>
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Enter verification code</h3>
              <p className="text-zinc-400 text-sm">
                We sent a 6-digit code to <strong className="text-white">{email}</strong>
              </p>
            </div>
            
            <div className="flex gap-2 justify-center mb-4" onPaste={handleOtpPaste}>
              {otpCode.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  className={`w-12 h-14 text-center text-2xl font-semibold bg-zinc-800 border ${
                    error ? 'border-red-500' : 'border-zinc-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#E01D1D] focus:border-transparent`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpInput(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  inputMode="numeric"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            
            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-zinc-500">Resend code in {resendTimer}s</p>
              ) : (
                <button 
                  className="text-sm text-[#E01D1D] hover:text-[#c91919] transition-colors"
                  onClick={handleSendEmailOTP} 
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Resend code'}
                </button>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E01D1D]"></div>
          </div>
        )}

        <p className="text-center text-xs text-zinc-500 mt-8">
          HeySalad OÜ · Reg. 17327633
        </p>
      </div>
    </div>
  );
}
