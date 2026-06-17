import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu } from 'react-icons/fi';
import { MdOutlineWeekend } from 'react-icons/md';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    const checkCart = () => {
      try {
        const localCart = localStorage.getItem('cartCount');
        if (localCart) {
          setCartCount(Number(localCart));
        } else {
          setCartCount(0);
        }
      } catch (e) {
        setCartCount(0);
      }
    };
    checkCart();
    window.addEventListener('storage', checkCart);
    window.addEventListener('cart-updated', checkCart);
    return () => {
      window.removeEventListener('storage', checkCart);
      window.removeEventListener('cart-updated', checkCart);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-dark-800 bg-dark-900/80 backdrop-blur-md shadow-glass">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-brand-500 font-extrabold text-2xl tracking-wider hover:text-brand-400 transition-colors">
              <MdOutlineWeekend className="text-3xl" />
              <span>RentEase</span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6 text-sm font-medium">
              <Link to="/" className="text-dark-300 hover:text-white transition-colors px-3 py-2">Home</Link>
              <Link to="/products" className="text-dark-300 hover:text-white transition-colors px-3 py-2">Products</Link>
              {user && (
                <>
                  {!isAdmin ? (
                    <Link to="/dashboard" className="text-dark-300 hover:text-white transition-colors px-3 py-2">Dashboard</Link>
                  ) : (
                    <Link to="/admin" className="text-brand-400 hover:text-brand-300 font-semibold transition-colors px-3 py-2">Admin Panel</Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {!isAdmin && (
                  <Link to="/cart" className="relative p-2 text-dark-300 hover:text-white transition-colors rounded-full hover:bg-dark-800">
                    <FiShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                <div className="flex items-center space-x-2">
                  <Link
                    to={isAdmin ? "/admin" : "/dashboard"}
                    className="flex items-center space-x-2 text-dark-200 hover:text-white px-3 py-1.5 rounded-lg border border-dark-800 bg-dark-900 transition-all hover:border-brand-500"
                  >
                    <FiUser className="h-4 w-4 text-brand-500" />
                    <span className="text-xs font-semibold">{user.name.split(' ')[0]}</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="p-2 text-dark-400 hover:text-rose-500 transition-colors rounded-full hover:bg-dark-800"
                    title="Logout"
                  >
                    <FiLogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-dark-300 hover:text-white px-3 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg shadow-neon transition-all hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
