import { useState } from 'react';
import { Mail, Lock, UserCircle, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { auth, db } from '../../config/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Role } from '../../types';

interface LoginPageProps {
  onBackToHome?: () => void;
}

const LoginPage = ({ onBackToHome }: LoginPageProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const roles: Role[] = ['HR Manager', 'Operations Manager', 'Warehouse Staff'];

  const toggleRole = (role: Role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter(r => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (selectedRoles.length === 0) {
          setError('Please select at least one role');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          email: user.email,
          name: name,
          roles: selectedRoles,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });
      }
    } catch (err: any) {
      const errorMessage = err.code === 'auth/user-not-found' 
        ? 'No account found with this email'
        : err.code === 'auth/wrong-password'
        ? 'Incorrect password'
        : err.code === 'auth/email-already-in-use'
        ? 'An account with this email already exists'
        : err.code === 'auth/weak-password'
        ? 'Password should be at least 6 characters'
        : err.code === 'auth/invalid-email'
        ? 'Invalid email address'
        : 'Authentication failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {onBackToHome && (
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-gray-600 hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </button>
        )}

        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-4 shadow-lg p-2 border border-gray-100">
            <img 
              src="/bereit-icon.svg" 
              alt="bereit" 
              className="w-full h-full"
            />
          </div>
          <h1 className="text-4xl font-bold text-secondary mb-2">bereit</h1>
          <p className="text-gray-600">Welcome to your HR platform</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl border-2 border-gray-100 p-8 animate-slide-up">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-3 text-center font-semibold transition-all ${
                isLogin
                  ? 'text-primary border-b-3 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-3 text-center font-semibold transition-all ${
                !isLogin
                  ? 'text-primary border-b-3 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="John Doe"
                    required={!isLogin}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  minLength={6}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Select Your Role(s)
                </label>
                <div className="space-y-2">
                  {roles.map((role) => (
                    <label
                      key={role}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedRoles.includes(role)
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role)}
                        onChange={() => toggleRole(role)}
                        className="w-5 h-5 text-primary rounded-md focus:ring-primary"
                        disabled={loading}
                      />
                      <span className="ml-3 text-sm font-semibold text-gray-700">
                        {role}
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  You can select multiple roles to access different dashboards
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 relative"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : isLogin ? (
                'Login to Dashboard'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {isLogin }
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          © 2025 Bereit • Professional HR Platform
        </p>
      </div>
    </div>
  );
};

export default LoginPage;