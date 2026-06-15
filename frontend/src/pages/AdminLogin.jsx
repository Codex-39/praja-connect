import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(formData);
      if (user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        // Log them out if they are not admin but logging into admin panel
        logout();
        setError('Access denied: Unauthorized credentials');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 -mt-16">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-10 rounded-2xl shadow-2xl border border-slate-700">
        <div>
          <div className="bg-indigo-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <ShieldCheck className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Portal Administrator
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Secure sign in for municipal authorities
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-lg flex items-center gap-3 border border-red-500/20">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Admin Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-700 bg-slate-950 placeholder-slate-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                placeholder="admin@prajaconnect.gov"
                value={formData.email}
                onChange={onChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Security Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-700 bg-slate-950 placeholder-slate-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                placeholder="••••••••"
                value={formData.password}
                onChange={onChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 shadow-lg"
            >
              {loading ? 'Verifying Credentials...' : 'Admin Sign In'}
            </button>
          </div>
        </form>
        <div className="text-center border-t border-slate-700/50 pt-4">
          <p className="text-xs text-slate-500">
            Citizen logging in?{' '}
            <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
              Go to Citizen Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
