import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { FiArrowLeft, FiPlus, FiMinus, FiShoppingCart, FiShield, FiRotateCcw, FiTruck } from 'react-icons/fi';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [quantity, setQuantity] = useState(1);
  const [selectedTenure, setSelectedTenure] = useState(3); // default to 3
  const [cartAdding, setCartAdding] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        if (data.tenureOptions && data.tenureOptions.length > 0) {
          setSelectedTenure(data.tenureOptions[0]); // default to first option
        }
      } catch (err) {
        setError('Failed to fetch product details. It might have been deleted.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setCartAdding(true);
    setSuccessMsg('');
    try {
      const { data } = await API.post('/cart/add', {
        productId: product._id,
        quantity,
        selectedTenure
      });

      // Calculate total cart items for badge
      const count = data.products.reduce((acc, curr) => acc + curr.quantity, 0);
      localStorage.setItem('cartCount', count.toString());

      // Trigger custom event to update navbar badge
      window.dispatchEvent(new Event('cart-updated'));

      setSuccessMsg('Product successfully added to cart!');
      setTimeout(() => {
        setSuccessMsg('');
        navigate('/cart');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add product to cart');
    } finally {
      setCartAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-900 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-dark-900 text-white min-h-screen py-20">
        <div className="mx-auto max-w-xl text-center px-4">
          <p className="text-rose-500 font-semibold mb-4">{error || 'Product not found'}</p>
          <Link to="/products" className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300">
            <FiArrowLeft />
            <span>Back to Products</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-900 text-white min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link to="/products" className="inline-flex items-center gap-2 text-xs font-semibold text-dark-400 hover:text-white mb-8 transition-colors">
          <FiArrowLeft className="h-4 w-4" />
          <span>Back to products catalog</span>
        </Link>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left: Product Image */}
          <div className="overflow-hidden rounded-3xl border border-dark-800 bg-dark-950/40 p-4 shadow-glass">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-dark-800">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>

          {/* Right: Product Actions & Description */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="rounded-full bg-brand-950/40 border border-brand-500/20 px-3 py-1 text-xs font-semibold tracking-wide text-brand-400">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{product.name}</h1>
            </div>

            {/* Price Cards */}
            <div className="grid grid-cols-2 gap-6 bg-dark-950/30 border border-dark-800 p-5 rounded-2xl">
              <div>
                <p className="text-dark-500 text-xs font-semibold uppercase tracking-wider">Monthly Rent</p>
                <p className="mt-1 text-2xl font-black text-white">
                  ${product.monthlyRent}
                  <span className="text-sm font-normal text-dark-400">/mo</span>
                </p>
              </div>
              <div>
                <p className="text-dark-500 text-xs font-semibold uppercase tracking-wider">Refundable Deposit</p>
                <p className="mt-1 text-2xl font-black text-dark-200">
                  ${product.securityDeposit}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-dark-300">Description</h3>
              <p className="text-xs text-dark-450 leading-relaxed font-light">{product.description}</p>
            </div>

            {/* Custom tenure selector options */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-dark-300">Select Rental Tenure</h3>
              <div className="grid grid-cols-4 gap-3">
                {product.tenureOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setSelectedTenure(opt)}
                    className={`rounded-xl border py-3 text-xs font-bold transition-all ${
                      selectedTenure === opt
                        ? 'border-brand-500 bg-brand-950/20 text-brand-400 shadow-neon'
                        : 'border-dark-800 bg-dark-950/30 text-dark-400 hover:border-dark-700 hover:text-white'
                    }`}
                  >
                    {opt} Months
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-dark-500 leading-normal">
                * Longer tenure selections offer optimal long-term rental rates.
              </p>
            </div>

            {/* Quantity and Checkout Add Buttons */}
            <div className="border-t border-dark-800 pt-6 flex flex-wrap gap-4 items-center">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-dark-400 block">Quantity</span>
                <div className="flex items-center space-x-1.5 rounded-xl border border-dark-800 bg-dark-950 p-1">
                  <button
                    onClick={handleDecrement}
                    className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
                  >
                    <FiMinus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="p-2 text-dark-400 hover:text-white rounded-lg hover:bg-dark-800 transition-colors"
                  >
                    <FiPlus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 space-y-1.5 pt-5">
                {product.stock > 0 ? (
                  <button
                    onClick={handleAddToCart}
                    disabled={cartAdding}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 py-3 text-xs font-bold text-white shadow-neon transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    <FiShoppingCart />
                    <span>{cartAdding ? 'Adding to Cart...' : 'Add to Rental Cart'}</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full rounded-xl bg-dark-800 text-dark-500 py-3 text-xs font-bold cursor-not-allowed border border-dark-700"
                  >
                    Temporarily Out of Stock
                  </button>
                )}
              </div>
            </div>

            {/* Error & Success Messages */}
            {successMsg && (
              <p className="text-xs font-semibold text-emerald-400 animate-pulse">{successMsg}</p>
            )}
            {error && (
              <p className="text-xs font-semibold text-rose-400">{error}</p>
            )}

            {/* Safety Banner */}
            <div className="grid grid-cols-3 gap-4 border-t border-dark-800 pt-6 text-center text-[10px] text-dark-450">
              <div className="flex flex-col items-center">
                <FiShield className="h-5 w-5 text-brand-500 mb-2" />
                <span className="font-semibold text-white">Full Cover Insurance</span>
                <span className="mt-1 leading-normal text-dark-500">We cover damages and minor wears.</span>
              </div>
              <div className="flex flex-col items-center">
                <FiRotateCcw className="h-5 w-5 text-brand-500 mb-2" />
                <span className="font-semibold text-white">Easy Returns</span>
                <span className="mt-1 leading-normal text-dark-500">Cancel or return anytime after tenure.</span>
              </div>
              <div className="flex flex-col items-center">
                <FiTruck className="h-5 w-5 text-brand-500 mb-2" />
                <span className="font-semibold text-white">24hr Quick Support</span>
                <span className="mt-1 leading-normal text-dark-500">Fast maintenance response at door.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
