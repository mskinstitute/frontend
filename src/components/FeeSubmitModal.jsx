import React, { useState } from 'react';
import api from '../api/axios';

const FeeSubmitModal = ({ open, onClose, course, onSubmitted, theme }) => {
  const [amount, setAmount] = useState(course?.total_due_amount || '');
  const [paymentMethod, setPaymentMethod] = useState('offline');
  const [note, setNote] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!open) return null;

  const handleFile = (e) => {
    setScreenshot(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setError(null);
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (paymentMethod === 'offline' && !screenshot) {
      setError('Please upload payment screenshot for offline/online bank transfer');
      return;
    }

    setLoading(true);
    try {
      // Submit fee request to backend
      // Endpoint may vary; using a reasonable default and graceful error handling
      const form = new FormData();
      // prefer sending enrollment_id when available (backend will resolve if only course_id provided)
      if (course.enrollment_id) {
        form.append('enrollment_id', course.enrollment_id);
      } else if (course.id) {
        form.append('course_id', course.id);
      }
      form.append('amount', amount);
      form.append('payment_gateway', paymentMethod === 'online' ? 'bank_transfer' : 'offline');
      form.append('payment_method', paymentMethod);
      form.append('gateway_note', note);
      if (screenshot) form.append('proof_image', screenshot);

      const res = await api.post('/courses/enrollment-fee-submit-requests/', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      onSubmitted && onSubmitted(res.data);
      onClose();
    } catch (err) {
      console.error('Fee submit failed', err);
      setError(err.response?.data?.detail || err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className={`relative w-full max-w-2xl p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
        <h3 className="text-lg font-semibold mb-3">Submit Fee Payment</h3>
        <p className="text-sm text-gray-500 mb-4">Upload payment proof and request admin verification.</p>

        {error && <div className="mb-3 text-sm text-red-500">{error}</div>}

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Amount (₹)</label>
            <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full px-3 py-2 rounded border" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select value={paymentMethod} onChange={(e)=>setPaymentMethod(e.target.value)} className="w-full px-3 py-2 rounded border">
              <option value="offline">Offline / Bank Transfer (Upload screenshot)</option>
              <option value="online">Online (Bank transfer / UPI — upload screenshot)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Note (optional)</label>
            <input type="text" value={note} onChange={(e)=>setNote(e.target.value)} className="w-full px-3 py-2 rounded border" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Screenshot</label>
            <input type="file" accept="image/*" onChange={handleFile} />
            {screenshot && <p className="text-sm mt-1">Selected: {screenshot.name}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancel</button>
          <button disabled={loading} onClick={handleSubmit} className="px-4 py-2 rounded bg-blue-600 text-white">{loading ? 'Submitting...' : 'Submit Request'}</button>
        </div>
      </div>
    </div>
  );
};

export default FeeSubmitModal;
