import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FiTrash2, FiShoppingBag, FiArrowRight, FiShield, FiTruck } from 'react-icons/fi';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchCart = async () => {
    try {
      const { data } = await API.get('/cart');
      setCart(data);
      
      // Update local storage count
      const count = data.products.reduce((acc, curr) => acc + curr.quantity, 0);
      localStorage.setItem('cartCount', count.toString());
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      setError('Failed to fetch cart. Please log in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (productId, selectedTenure) => {
    setDeletingId(`${productId}-${selectedTenure}`);
    try {
      const { data } = await API.delete('/cart/remove', {
        data: { productId, selectedTenure }
      });
      setCart(data);

      const count = data.products.reduce((acc, curr) => acc + curr.quantity, 0);
      localStorage.setItem('cartCount', count.toString());
      window.dispatchEvent(new Event('cart-updated'));
    } catch (err) {
      console.error(err);
      setError('Failed to remove item from cart.');
    } finally {
      setDeletingId(null);
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

  // Calculate totals
  const totalRent = hasItems ? cart.products.reduce((sum, item) => sum + (item.product?.monthlyRent * item.quantity), 0) : 0;
  const totalDeposit = hasItems ? cart.products.reduce((sum, item) => sum + (item.product?.securityDeposit * item.quantity), 0) : 0;

  return (
    <div className="bg-dark-900 text-white min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">Shopping Cart</h1>

        {error && (
          <p className="text-rose-500 text-xs font-semibold mb-6">{error}</p>
        )}

        {!hasItems ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-dark-800 bg-dark-950/20 p-8">
            <div className="p-4 rounded-full bg-dark-850/50 inline-block text-dark-500 mb-4">
              <FiShoppingBag className="h-10 w-10" />
            </div>
            <p className="text-dark-400 font-semibold mb-2">Your cart is currently empty.</p>
            <p className="text-xs text-dark-500 mb-6">Choose from our premium collection of home items.</p>
            <Link
              to="/products"
              className="rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 px-6 text-xs transition-all shadow-neon inline-block"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.products.map((item) => (
                <div
                  key={`${item.product?._id}-${item.selectedTenure}`}
                  className="p-5 rounded-2xl border border-dark-800 bg-dark-950/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="h-20 w-20 object-cover rounded-xl bg-dark-800"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white leading-normal">{item.product?.name}</h3>
                      <p className="text-[10px] text-brand-400 font-semibold mt-0.5">{item.product?.category}</p>
                      <div className="flex gap-4 mt-2 text-[10px] text-dark-450 font-medium">
                        <span>Tenure: <span className="text-white font-semibold">{item.selectedTenure} Months</span></span>
                        <span>Quantity: <span className="text-white font-semibold">{item.quantity}</span></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto border-t sm:border-0 border-dark-850 pt-3 sm:pt-0">
                    <div className="text-right">
                      <p className="text-[10px] text-dark-500 font-medium uppercase">Monthly Rent</p>
                      <p className="text-sm font-extrabold text-white">${item.product?.monthlyRent * item.quantity}</p>
                      <p className="text-[9px] text-dark-500 mt-0.5">Dep: ${item.product?.securityDeposit * item.quantity}</p>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.product?._id, item.selectedTenure)}
                      disabled={deletingId === `${item.product?._id}-${item.selectedTenure}`}
                      className="mt-2 text-dark-500 hover:text-rose-500 transition-colors p-1.5 rounded-lg hover:bg-dark-850"
                      title="Remove product"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary Card */}
            <div className="p-6 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs space-y-6">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Rental Bill Details</h2>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-dark-450 font-semibold">
                  <span>Monthly Rental Outlay</span>
                  <span className="text-white">${totalRent}/mo</span>
                </div>
                <div className="flex justify-between text-dark-450 font-semibold">
                  <span>Refundable Security Deposit</span>
                  <span className="text-white">${totalDeposit}</span>
                </div>
                <div className="flex justify-between text-dark-450 font-semibold">
                  <span>Delivery & Installation</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="border-t border-dark-800 pt-3 flex justify-between font-bold text-sm">
                  <span>Total Payable Now</span>
                  <span className="text-brand-400">${totalDeposit}</span>
                </div>
              </div>

              {/* Security info */}
              <div className="flex items-center gap-2 p-3 bg-brand-950/20 border border-brand-900/20 rounded-xl text-[10px] text-brand-400">
                <FiShield className="h-4 w-4 shrink-0" />
                <span>Security deposit will be completely refunded on item return.</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 py-3 text-xs font-bold text-white shadow-neon transition-all hover:scale-[1.01]"
              >
                <span>Proceed to Checkout</span>
                <FiArrowRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
