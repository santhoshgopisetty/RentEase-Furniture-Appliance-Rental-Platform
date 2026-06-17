import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';
import { MdOutlineWeekend } from 'react-icons/md';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setApiError('');
    setSubmitting(true);
    const result = await login(data.email, data.password);
    setSubmitting(false);

    if (result.success) {
      // In AuthContext, user role is updated. Redirect appropriately.
      // We can fetch profile or redirect immediately. Let's do a redirect.
      // Wait: AuthContext will set the user state. Let's read user data.
      // For safety, let's navigate to a landing route that redirects, or wait 100ms.
      // Let's redirect to check role and send them to the dashboard/admin.
      const token = localStorage.getItem('token');
      if (token) {
        // Fetch profile to see if they're admin
        try {
          // Check role from AuthContext user if populated or check token details.
          // Let's decode or simply navigate to dashboard. The dashboard page itself has protected checks.
          // Let's redirect to `/dashboard` for standard users, or `/admin` if it's admin@rentease.com.
          if (data.email.toLowerCase() === 'admin@rentease.com') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } catch (e) {
          navigate('/dashboard');
        }
      }
    } else {
      setApiError(result.message);
    }
  };

  return (
    <div className="bg-dark-900 text-white min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[350px] rounded-full bg-brand-600/10 blur-[80px] -z-10" />

      <div className="max-w-md w-full space-y-8 p-8 rounded-3xl border border-dark-800 bg-dark-950/40 shadow-glass backdrop-blur-xs">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 text-brand-500 font-extrabold text-3xl tracking-wider">
            <MdOutlineWeekend />
            <span>RentEase</span>
          </Link>
          <h2 className="mt-6 text-xl font-bold">Sign in to your account</h2>
          <p className="mt-2 text-xs text-dark-500">
            Welcome back! Furnish your life with premium appliances.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {apiError && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-950/30 border border-rose-900/30 p-4 text-xs text-rose-400">
              <FiAlertCircle className="h-4 w-4 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-dark-400">Email Address</label>
              <div className="relative rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 focus-within:border-brand-500 transition-colors flex items-center gap-3">
                <FiMail className="text-dark-500 h-4 w-4" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="bg-transparent border-0 p-0 text-xs w-full text-white placeholder-dark-550 focus:outline-none focus:ring-0"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-[10px] text-rose-400 font-semibold">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-dark-400">Password</label>
                <a href="#" className="text-[10px] font-semibold text-brand-400 hover:text-brand-350 transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 focus-within:border-brand-500 transition-colors flex items-center gap-3">
                <FiLock className="text-dark-500 h-4 w-4" />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="bg-transparent border-0 p-0 text-xs w-full text-white placeholder-dark-550 focus:outline-none focus:ring-0"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
              </div>
              {errors.password && (
                <p className="text-[10px] text-rose-400 font-semibold">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={submitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-xs font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-500 shadow-neon transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-dark-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              Sign up today
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
