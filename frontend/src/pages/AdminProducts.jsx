import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import API from '../services/api';
import { FiPlus, FiEdit, FiTrash2, FiX, FiCheck, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null); // null means adding new
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/products');
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products catalogue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditProduct(null);
    reset({
      name: '',
      description: '',
      category: 'Bed',
      image: '',
      monthlyRent: '',
      securityDeposit: '',
      stock: 10,
      availability: true
    });
    setSuccessMsg('');
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditProduct(product);
    setValue('name', product.name);
    setValue('description', product.description);
    setValue('category', product.category);
    setValue('image', product.image);
    setValue('monthlyRent', product.monthlyRent);
    setValue('securityDeposit', product.securityDeposit);
    setValue('stock', product.stock);
    setValue('availability', product.availability);
    setSuccessMsg('');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      setError('Failed to delete product.');
    }
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    setSuccessMsg('');
    try {
      const payload = {
        ...data,
        monthlyRent: Number(data.monthlyRent),
        securityDeposit: Number(data.securityDeposit),
        stock: Number(data.stock),
        availability: data.availability === 'true' || data.availability === true
      };

      if (editProduct) {
        // Update
        const res = await API.put(`/products/${editProduct._id}`, payload);
        setProducts(products.map((p) => (p._id === editProduct._id ? res.data : p)));
        setSuccessMsg('Product updated successfully!');
      } else {
        // Create
        const res = await API.post('/products', payload);
        setProducts([res.data, ...products]);
        setSuccessMsg('Product created successfully!');
      }

      setTimeout(() => {
        setShowModal(false);
        reset();
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to save product changes.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    'Bed', 'Sofa', 'Table', 'Chair', 'Wardrobe',
    'Refrigerator', 'Washing Machine', 'Television', 'Microwave', 'Air Conditioner'
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-900 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-dark-900 text-white min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between border-b border-dark-800 pb-6">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="p-2 rounded-lg bg-dark-850 hover:bg-dark-800 text-dark-400 hover:text-white transition-colors">
              <FiArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Product Catalogue Management</h1>
              <p className="text-xs text-dark-450">Add, edit, or remove furniture and appliance inventory items.</p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 py-2.5 px-4 text-xs font-bold text-white shadow-neon transition-all hover:scale-105"
          >
            <FiPlus />
            <span>Add New Product</span>
          </button>
        </div>

        {error && (
          <p className="text-rose-500 text-xs font-semibold">{error}</p>
        )}

        {/* Data Table */}
        <div className="overflow-hidden rounded-2xl border border-dark-800 bg-dark-950/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-dark-800 bg-dark-900 text-dark-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Item Details</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Monthly Rent</th>
                  <th className="p-4 text-right">Deposit</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4 text-center">Availability</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b border-dark-850 hover:bg-dark-900/40 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-10 w-10 object-cover rounded-lg bg-dark-800 shrink-0"
                      />
                      <span className="font-bold text-white line-clamp-1">{p.name}</span>
                    </td>
                    <td className="p-4 text-dark-300 font-semibold">{p.category}</td>
                    <td className="p-4 text-right font-extrabold text-white">${p.monthlyRent}</td>
                    <td className="p-4 text-right font-semibold text-dark-350">${p.securityDeposit}</td>
                    <td className="p-4 text-center font-bold text-white">{p.stock}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                        p.availability ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-rose-950/40 text-rose-400 border border-rose-900/30'
                      }`}>
                        {p.availability ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 rounded-lg border border-dark-800 bg-dark-900 hover:border-brand-500 hover:text-brand-400 text-dark-400 transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="p-1.5 rounded-lg border border-dark-800 bg-dark-900 hover:border-rose-500 hover:text-rose-400 text-dark-400 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in">
          <div className="max-w-xl w-full rounded-3xl border border-dark-800 bg-dark-900 p-6 space-y-6 shadow-glass relative my-8 animate-scale-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-dark-800 text-dark-500 hover:text-white"
            >
              <FiX className="h-5 w-5" />
            </button>

            <h2 className="text-base font-bold text-white">
              {editProduct ? 'Edit Catalog Product' : 'Add New Catalog Product'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-semibold">
              {successMsg && (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-950/40 border border-emerald-900/30 p-4 text-xs text-emerald-400">
                  <FiCheck className="h-4 w-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] text-dark-400">Product Name</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 text-white focus:border-brand-500 focus:outline-none focus:ring-0"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && <p className="text-[9px] text-rose-450">{errors.name.message}</p>}
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-400">Category</label>
                  <select
                    className="w-full rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 text-white focus:border-brand-500 focus:outline-none focus:ring-0"
                    {...register('category')}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Image URL */}
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-400">Image URL</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 text-white focus:border-brand-500 focus:outline-none focus:ring-0"
                    {...register('image', { required: 'Image link is required' })}
                  />
                  {errors.image && <p className="text-[9px] text-rose-450">{errors.image.message}</p>}
                </div>

                {/* Monthly Rent */}
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-400">Monthly Rent ($)</label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 text-white focus:border-brand-500 focus:outline-none focus:ring-0"
                    {...register('monthlyRent', { required: 'Monthly rent is required', min: 1 })}
                  />
                  {errors.monthlyRent && <p className="text-[9px] text-rose-450">{errors.monthlyRent.message}</p>}
                </div>

                {/* Security Deposit */}
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-400">Security Deposit ($)</label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 text-white focus:border-brand-500 focus:outline-none focus:ring-0"
                    {...register('securityDeposit', { required: 'Deposit is required', min: 1 })}
                  />
                  {errors.securityDeposit && <p className="text-[9px] text-rose-450">{errors.securityDeposit.message}</p>}
                </div>

                {/* Stock */}
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-400">Warehouse Stock Count</label>
                  <input
                    type="number"
                    className="w-full rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 text-white focus:border-brand-500 focus:outline-none focus:ring-0"
                    {...register('stock', { required: 'Stock count is required', min: 0 })}
                  />
                  {errors.stock && <p className="text-[9px] text-rose-450">{errors.stock.message}</p>}
                </div>

                {/* Availability */}
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-400">Is Available</label>
                  <select
                    className="w-full rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 text-white focus:border-brand-500 focus:outline-none focus:ring-0"
                    {...register('availability')}
                  >
                    <option value="true">Yes, Available</option>
                    <option value="false">No, Out of stock</option>
                  </select>
                </div>

                {/* Description */}
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[10px] text-dark-400">Description</label>
                  <textarea
                    rows="3"
                    className="w-full rounded-xl border border-dark-800 bg-dark-950 px-3 py-2.5 text-white focus:border-brand-500 focus:outline-none focus:ring-0"
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && <p className="text-[9px] text-rose-455">{errors.description.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 py-3 text-xs font-bold text-white shadow-neon transition-all disabled:opacity-50"
              >
                {submitting ? 'Saving changes...' : 'Save Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
