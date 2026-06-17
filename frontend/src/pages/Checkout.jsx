import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import API from '../services/api';
import { FiCalendar, FiMapPin, FiCreditCard, FiAlertCircle } from 'react-icons/fi';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      deliveryDate: '',
      paymentMethod: 'card',
      cardNumber: '',
      expiry: '',
      cvv: ''
    }
  });

  // Calculate default date (today + 3 days) as minimum
  const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toISOString().split('T')[0];
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await API.get('/cart');
        setCart(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const onSubmit = async (data) => {
    setApiError('');
    setSubmitting(true);
    try {
      await API.post('/rentals', {
        deliveryDate: data.deliveryDate
      });

      // Clear local storage cart count
      localStorage.setItem('cartCount', '0');
      window.dispatchEvent(new Event('cart-updated'));

      setOrderConfirmed(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.message || 'Checkout failed. Please check availability.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-900 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  const hasItems = cart && cart.products && cart.products.length > 0;
  const totalRent = hasItems ? cart.products.reduce((sum, item) => sum + (item.product?.monthlyRent * item.quantity), 0) : 0;
  const totalDeposit = hasItems ? cart.products.reduce((sum, item) => sum + (item.product?.securityDeposit * item.quantity), 0) : 0;

  if (orderConfirmed) {
    return (
      <div className="bg-dark-900 text-white min-h-[80vh] flex items-center justify-center py-20">
        <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl border border-dark-800 bg-dark-950/40 shadow-glass">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold">Order Confirmed!</h2>
          <p className="text-xs text-dark-500 leading-relaxed">
            Your rental booking was processed successfully. Our logistics team will deliver your products on the scheduled date.
          </p>
          <p className="text-[10px] text-brand-400 animate-pulse font-bold">Redirecting you to dashboard...</p>
        </div>
      </div>
    );
  }

  if (!hasItems) {
    return (
      <div className="bg-dark-900 text-white min-h-screen py-20">
        <div className="mx-auto max-w-xl text-center px-4">
          <p className="text-rose-500 font-semibold mb-4">No items in cart to checkout.</p>
          <Link to="/products" className="bg-brand-600 hover:bg-brand-500 text-white py-2 px-6 rounded-xl text-xs font-bold shadow-neon">
            Explore products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-900 text-white min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">Checkout Checkout</h1>

        {apiError && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-950/30 border border-rose-900/30 p-4 text-xs text-rose-400 mb-6 max-w-3xl">
            <FiAlertCircle className="h-4 w-4 shrink-0" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Scheduling */}
            <div className="p-6 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-4">
              <div className="flex items-center gap-3">
                <FiCalendar className="text-brand-500 h-5 w-5" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Schedule Delivery Date</h2>
              </div>
              <p className="text-xs text-dark-500 leading-normal">
                Choose when you want our logistics team to deliver and assemble your items.
              </p>
              <div className="relative rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 focus-within:border-brand-500 transition-colors max-w-xs">
                <input
                  type="date"
                  min={getMinDate()}
                  className="bg-transparent border-0 p-0 text-xs w-full text-white focus:outline-none focus:ring-0"
                  {...register('deliveryDate', { required: 'Please select a delivery date' })}
                />
              </div>
              {errors.deliveryDate && (
                <p className="text-[10px] text-rose-400 font-semibold">{errors.deliveryDate.message}</p>
              )}
            </div>

            {/* Delivery address details */}
            <div className="p-6 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-4">
              <div className="flex items-center gap-3">
                <FiMapPin className="text-brand-500 h-5 w-5" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Shipping & Billing Address</h2>
              </div>
              <p className="text-xs text-dark-550 leading-relaxed font-light">
                RentEase will deliver orders directly to this address. (You can modify this address in your profile dashboard).
              </p>
              <div className="p-4 rounded-xl border border-dark-800 bg-dark-950/80 text-xs leading-relaxed font-medium">
                <p className="font-bold text-white">{user?.name}</p>
                <p className="mt-1 text-dark-400">{user?.address}</p>
                <p className="mt-1 text-dark-500">Phone: {user?.phone}</p>
              </div>
            </div>

            {/* Payment Method Mock Details */}
            <div className="p-6 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-4">
              <div className="flex items-center gap-3">
                <FiCreditCard className="text-brand-500 h-5 w-5" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">Payment Information</h2>
              </div>
              <p className="text-xs text-dark-550 leading-normal">
                Confirm your payment option. Card details are validated in a mock checkout mode.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      value="card"
                      className="accent-brand-500"
                      {...register('paymentMethod')}
                    />
                    <span>Credit / Debit Card</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-dark-850 pt-4">
                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[10px] font-semibold text-dark-400">Card Number</label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      className="w-full rounded-xl border border-dark-800 bg-dark-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-0 placeholder-dark-550"
                      {...register('cardNumber', {
                        required: 'Card number is required',
                        pattern: {
                          value: /^\d{16}$/,
                          message: 'Card number must be 16 digits'
                        }
                      })}
                    />
                    {errors.cardNumber && (
                      <p className="text-[10px] text-rose-400 font-semibold">{errors.cardNumber.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-dark-400">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      placeholder="12/28"
                      className="w-full rounded-xl border border-dark-800 bg-dark-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-0 placeholder-dark-550"
                      {...register('expiry', {
                        required: 'Expiry is required',
                        pattern: {
                          value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                          message: 'Format must be MM/YY'
                        }
                      })}
                    />
                    {errors.expiry && (
                      <p className="text-[10px] text-rose-400 font-semibold">{errors.expiry.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-semibold text-dark-400">CVV</label>
                    <input
                      type="password"
                      placeholder="***"
                      maxLength="3"
                      className="w-full rounded-xl border border-dark-800 bg-dark-950 px-3 py-2 text-xs text-white focus:border-brand-500 focus:outline-none focus:ring-0 placeholder-dark-550"
                      {...register('cvv', {
                        required: 'CVV is required',
                        pattern: {
                          value: /^\d{3}$/,
                          message: 'CVV must be 3 digits'
                        }
                      })}
                    />
                    {errors.cvv && (
                      <p className="text-[10px] text-rose-400 font-semibold">{errors.cvv.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Summary sidebar */}
          <div className="p-6 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Order Summary</h2>

            <div className="space-y-4 max-h-48 overflow-y-auto pr-1">
              {cart.products.map(item => (
                <div key={item.product?._id} className="flex justify-between items-center text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-white truncate">{item.product?.name}</p>
                    <p className="text-[10px] text-dark-500">{item.quantity} Qty • {item.selectedTenure} mo tenure</p>
                  </div>
                  <span className="font-bold text-dark-300 shrink-0">${item.product?.monthlyRent * item.quantity}/mo</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dark-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-dark-450">
                <span>Refundable Deposits</span>
                <span className="text-white">${totalDeposit}</span>
              </div>
              <div className="flex justify-between text-dark-450">
                <span>Monthly Rent Total</span>
                <span className="text-white">${totalRent}/mo</span>
              </div>
              <div className="flex justify-between text-dark-450">
                <span>Installation Services</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>
              <div className="border-t border-dark-850 pt-3 flex justify-between font-bold text-sm">
                <span>Total Payable Now</span>
                <span className="text-brand-400">${totalDeposit}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 py-3 text-xs font-bold text-white shadow-neon transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {submitting ? 'Confirming Order...' : 'Pay Refundable Deposit & Rent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
