import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { FiSearch, FiArrowRight, FiTruck, FiTool, FiCheckCircle } from 'react-icons/fi';
import { MdOutlineWeekend, MdTv } from 'react-icons/md';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await API.get('/products');
        // Slice top 4 as featured
        setFeaturedProducts(data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/products');
    }
  };

  const categories = [
    { name: 'Bed', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=200&auto=format&fit=crop&q=60', label: 'Beds' },
    { name: 'Sofa', image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=200&auto=format&fit=crop&q=60', label: 'Sofas' },
    { name: 'Table', image: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=200&auto=format&fit=crop&q=60', label: 'Tables' },
    { name: 'Chair', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&auto=format&fit=crop&q=60', label: 'Chairs' },
    { name: 'Wardrobe', image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=200&auto=format&fit=crop&q=60', label: 'Wardrobes' },
    { name: 'Refrigerator', image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=200&auto=format&fit=crop&q=60', label: 'Refrigerators' },
    { name: 'Washing Machine', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=200&auto=format&fit=crop&q=60', label: 'Washers' },
    { name: 'Television', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=200&auto=format&fit=crop&q=60', label: 'TVs' },
    { name: 'Microwave', image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=200&auto=format&fit=crop&q=60', label: 'Microwaves' },
    { name: 'Air Conditioner', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&auto=format&fit=crop&q=60', label: 'ACs' },
  ];

  return (
    <div className="bg-dark-900 text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 border-b border-dark-800 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-950/40 via-dark-900 to-dark-900">
        {/* Glow effect */}
        <div className="absolute top-1/4 right-1/4 h-[350px] w-[350px] rounded-full bg-brand-500/10 blur-[80px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-950/30 px-4 py-1.5 text-xs text-brand-400 font-semibold tracking-wide">
              <span className="flex h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
              Flexible Furniture & Appliance Rentals
            </div>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Furnish Your Space, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-300">
                Without the Commitment
              </span>
            </h1>
            
            <p className="text-dark-300 text-sm sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Rent premium beds, sofas, refrigerators, air conditioners, and more on your own terms. Free delivery, free maintenance, and hassle-free returns.
            </p>

            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-8 flex max-w-xl mx-auto overflow-hidden rounded-2xl border border-dark-700 bg-dark-950/80 p-1.5 shadow-glass backdrop-blur-md focus-within:border-brand-500 transition-colors">
              <div className="flex flex-1 items-center px-3 text-dark-400">
                <FiSearch className="h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search beds, washing machines, sofas..."
                  className="w-full bg-transparent border-0 px-3 py-2 text-white placeholder-dark-500 text-sm focus:outline-none focus:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-neon hover:bg-brand-500 transition-all"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-dark-950/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Browse Categories</h2>
            <p className="text-xs sm:text-sm text-dark-400 max-w-md mx-auto">
              Select a category to filter our high-quality rental products.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-dark-800 bg-dark-900 shadow-glass transition-all hover:border-brand-500 hover:bg-brand-950/10 hover:shadow-glass-hover"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden mb-3 transition-all shadow-inner">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <span className="text-xs font-semibold text-dark-300 group-hover:text-white transition-colors">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4">
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Featured Collections</h2>
              <p className="text-xs sm:text-sm text-dark-400 max-w-md">
                Our most popular furniture and appliance plans rent out fast. Lock yours today!
              </p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 transition-colors group"
            >
              <span>Explore All Products</span>
              <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-80 w-full animate-pulse rounded-2xl bg-dark-800" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services/Trust Section */}
      <section className="py-20 border-t border-dark-850 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-brand-950/20 via-dark-900 to-dark-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4 p-6 rounded-2xl border border-dark-800 bg-dark-900/50 backdrop-blur-xs">
              <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
                <FiTruck className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Free Delivery & Setup</h3>
                <p className="text-xs text-dark-400 leading-relaxed">
                  Relax while our professional logistics team delivers and installs your items right at your doorstep, free of charge.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl border border-dark-800 bg-dark-900/50 backdrop-blur-xs">
              <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
                <FiTool className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Complimentary Maintenance</h3>
                <p className="text-xs text-dark-400 leading-relaxed">
                  Is something not working? Just submit a ticket. We cover full maintenance and repair costs during the rental tenure.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl border border-dark-800 bg-dark-900/50 backdrop-blur-xs">
              <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400">
                <FiCheckCircle className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-sm">Hassle-Free Tenure Upgrades</h3>
                <p className="text-xs text-dark-400 leading-relaxed">
                  Want to keep it longer? Extend your rental duration online easily. Want to return it? We pickup without questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
