import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { FiSearch, FiSliders, FiX } from 'react-icons/fi';

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Read filter values from URL search parameters
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || '';
  const maxRentParam = searchParams.get('maxRent') || '';

  // Local state for search & max rent slider to prevent excessive API requests
  const [localSearch, setLocalSearch] = useState(searchParam);
  const [localMaxRent, setLocalMaxRent] = useState(maxRentParam || '50');

  useEffect(() => {
    setLocalSearch(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (categoryParam) queryParams.set('category', categoryParam);
        if (searchParam) queryParams.set('search', searchParam);
        if (sortParam) queryParams.set('sort', sortParam);

        const { data } = await API.get(`/products?${queryParams.toString()}`);
        
        // Frontend filtering for rent range
        let filtered = data;
        if (maxRentParam) {
          filtered = filtered.filter(p => p.monthlyRent <= Number(maxRentParam));
        }

        setProducts(filtered);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, searchParam, sortParam, maxRentParam]);

  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateFilters('search', localSearch);
  };

  const handleRentSliderChange = (e) => {
    setLocalMaxRent(e.target.value);
  };

  const applyRentFilter = () => {
    updateFilters('maxRent', localMaxRent);
  };

  const resetFilters = () => {
    setSearchParams({});
    setLocalSearch('');
    setLocalMaxRent('50');
  };

  const categories = [
    'Bed', 'Sofa', 'Table', 'Chair', 'Wardrobe',
    'Refrigerator', 'Washing Machine', 'Television', 'Microwave', 'Air Conditioner'
  ];

  const sidebarFilters = (
    <div className="space-y-6 text-sm">
      {/* Category Filter */}
      <div>
        <h3 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Categories</h3>
        <div className="space-y-2">
          <button
            onClick={() => updateFilters('category', '')}
            className={`block w-full text-left py-1 text-xs transition-colors ${!categoryParam ? 'text-brand-400 font-bold' : 'text-dark-400 hover:text-white'}`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilters('category', cat)}
              className={`block w-full text-left py-1 text-xs transition-colors ${categoryParam === cat ? 'text-brand-400 font-bold' : 'text-dark-400 hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rent Filter Slider */}
      <div className="border-t border-dark-800 pt-6">
        <h3 className="font-bold text-white mb-3 text-xs uppercase tracking-wider">Max Monthly Rent</h3>
        <div className="space-y-3">
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={localMaxRent}
            onChange={handleRentSliderChange}
            className="w-full accent-brand-500 bg-dark-800 rounded-lg appearance-none h-1.5"
          />
          <div className="flex justify-between text-xs text-dark-450 font-semibold">
            <span>$10</span>
            <span className="text-brand-400">${localMaxRent}/mo</span>
            <span>$100</span>
          </div>
          <button
            onClick={applyRentFilter}
            className="w-full bg-dark-800 hover:bg-dark-700 text-xs font-semibold py-1.5 rounded-lg border border-dark-700 transition-colors"
          >
            Apply Price Filter
          </button>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="w-full rounded-xl bg-rose-950/20 text-rose-400 border border-rose-900/30 hover:bg-rose-950/30 font-semibold py-2.5 text-xs transition-all"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="bg-dark-900 text-white min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top bar (Search and Sort) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Rental Catalog</h1>
            <p className="text-xs text-dark-450 mt-1">
              Showing {products.length} products
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <form onSubmit={handleSearchSubmit} className="flex overflow-hidden rounded-xl border border-dark-800 bg-dark-950 p-1 focus-within:border-brand-500 max-w-sm">
              <input
                type="text"
                placeholder="Search catalog..."
                className="bg-transparent border-0 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-0 placeholder-dark-500"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
              <button
                type="submit"
                className="rounded-lg bg-dark-850 px-3 text-xs hover:bg-dark-800 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Sort */}
            <select
              value={sortParam}
              onChange={(e) => updateFilters('sort', e.target.value)}
              className="rounded-xl border border-dark-800 bg-dark-950 px-3 py-2 text-xs font-medium focus:border-brand-500 focus:outline-none focus:ring-0"
            >
              <option value="">Sort: Default</option>
              <option value="rent-asc">Rent: Low to High</option>
              <option value="rent-desc">Rent: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>

            {/* Mobile Filter toggle */}
            <button
              onClick={() => setShowFiltersMobile(true)}
              className="md:hidden flex items-center justify-center gap-2 rounded-xl border border-dark-800 bg-dark-950 px-3 py-2 text-xs font-medium hover:bg-dark-800"
            >
              <FiSliders />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex gap-8 items-start">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0 p-6 rounded-2xl border border-dark-800 bg-dark-950/40 backdrop-blur-xs">
            {sidebarFilters}
          </aside>

          {/* Catalog Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-80 w-full animate-pulse rounded-2xl bg-dark-850" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-dashed border-dark-800 bg-dark-950/20 p-8">
                <p className="text-dark-400 font-semibold mb-2">No products found matching filters.</p>
                <p className="text-xs text-dark-500 mb-6">Try resetting filters or checking your search query.</p>
                <button
                  onClick={resetFilters}
                  className="rounded-xl bg-brand-650 hover:bg-brand-600 text-white font-semibold py-2 px-6 text-xs transition-all"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showFiltersMobile && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-80 h-full bg-dark-900 border-l border-dark-800 p-6 flex flex-col justify-between overflow-y-auto animate-slide-in">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-dark-800 mb-6">
                <h2 className="text-lg font-bold">Filter Options</h2>
                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="p-1 rounded-lg hover:bg-dark-800 text-dark-400 hover:text-white"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              {sidebarFilters}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
