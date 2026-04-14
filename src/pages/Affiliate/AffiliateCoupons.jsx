import React, { useContext, useState, useEffect } from 'react';
import { Gift, Plus, Edit, Trash2, Copy, X } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { getCoupons, createCoupon, updateCoupon, deleteCoupon, copyToClipboard, formatDate } from '../../api/affiliateApi';
import toast from 'react-hot-toast';

const AffiliateCoupons = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
  const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discount_percentage: '',
    start_date: '',
    end_date: '',
    is_active: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getCoupons();
      setCoupons(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error('Error fetching coupons:', error);
      toast.error('Failed to load coupons');
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingId(coupon.id);
      setFormData({
        code: coupon.code,
        discount_percentage: coupon.discount_percentage,
        start_date: coupon.start_date?.split('T')[0] || '',
        end_date: coupon.end_date?.split('T')[0] || '',
        is_active: coupon.is_active
      });
    } else {
      setEditingId(null);
      setFormData({
        code: '',
        discount_percentage: '',
        start_date: '',
        end_date: '',
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      code: '',
      discount_percentage: '',
      start_date: '',
      end_date: '',
      is_active: true
    });
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.discount_percentage || !formData.start_date || !formData.end_date) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate discount percentage (max 50%)
    const discount = parseFloat(formData.discount_percentage);
    if (discount < 0 || discount > 50) {
      toast.error('Discount percentage must be between 0 and 50');
      return;
    }

    try {
      setSubmitLoading(true);
      const couponData = {
        code: formData.code.toUpperCase(),
        discount_percentage: discount,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
        is_active: formData.is_active
      };

      if (editingId) {
        await updateCoupon(editingId, couponData);
        toast.success('Coupon updated successfully!');
      } else {
        await createCoupon(couponData);
        toast.success('Coupon created successfully!');
      }

      handleCloseModal();
      await fetchCoupons();
    } catch (error) {
      console.error('Error saving coupon:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Failed to save coupon';
      toast.error(errorMsg);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (couponId) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await deleteCoupon(couponId);
      toast.success('Coupon deleted successfully!');
      await fetchCoupons();
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    }
  };

  const handleCopyCode = async (code) => {
    const success = await copyToClipboard(code);
    if (success) {
      toast.success('Coupon code copied!');
    } else {
      toast.error('Failed to copy');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Coupons</h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Create and manage coupon codes for your referrals
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Create Coupon
        </button>
      </div>

      {/* Coupons Grid */}
      {coupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon.id} className={`${bgColor} rounded-xl border ${borderColor} p-6 hover:shadow-lg transition-all`}>
              {/* Coupon Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Gift size={24} className="text-purple-500" />
                  </div>
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Coupon Code</p>
                    <p className="text-2xl font-bold">{coupon.code}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  coupon.is_active && !coupon.is_expired ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                }`}>
                  {coupon.is_expired ? 'Expired' : coupon.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Discount */}
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'} mb-4`}>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Discount</p>
                <p className="text-3xl font-bold text-purple-500">{coupon.discount_percentage}%</p>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Expiry</p>
                  <p className="font-semibold">{formatDate(coupon.end_date)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Usage</p>
                  <p className="font-semibold">{coupon.usage_count || 0} times</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button 
                  onClick={() => handleCopyCode(coupon.code)}
                  className="flex-1 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-500 font-semibold hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Copy size={16} />
                  Copy
                </button>
                <button 
                  onClick={() => handleOpenModal(coupon)}
                  className="flex-1 px-3 py-2 rounded-lg bg-gray-500/20 text-gray-400 font-semibold hover:bg-gray-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(coupon.id)}
                  className="flex-1 px-3 py-2 rounded-lg bg-red-500/20 text-red-500 font-semibold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`${bgColor} rounded-xl border ${borderColor} p-12 text-center`}>
          <Gift size={48} className="mx-auto mb-4 text-gray-400" />
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No coupons yet. Create one to get started!</p>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`${bgColor} rounded-xl border ${borderColor} p-8 max-w-md w-full max-h-96 overflow-y-auto`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">{editingId ? 'Edit Coupon' : 'Create Coupon'}</h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  Coupon Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g., SAVE20"
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                />
              </div>

              <div>
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  Discount % * (Max 50%)
                </label>
                <input
                  type="number"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                  placeholder="e.g., 20"
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                  min="0"
                  max="50"
                />
              </div>

              <div>
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                />
              </div>

              <div>
                <label className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} block mb-2`}>
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <label htmlFor="is_active" className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Active
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCloseModal}
                className={`flex-1 px-4 py-2 rounded-lg border ${borderColor} font-semibold hover:bg-gray-700/50 transition-colors`}
              >
                Cancel
              </button>
              <button
                disabled={submitLoading}
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {submitLoading ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateCoupons;
