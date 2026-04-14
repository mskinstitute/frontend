import React from 'react';
import { X } from 'lucide-react';

const FeeHistoryModal = ({ open, onClose, feeHistories = [], theme }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`relative w-full max-w-2xl p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close fee history"
        >
          <X className="h-6 w-6" />
        </button>

        <h3 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Fee History</h3>

        <div className="max-h-80 overflow-y-auto">
          {feeHistories.length === 0 ? (
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>No fee history found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <th className="text-left py-2">Paid At</th>
                  <th className="text-left py-2">Amount</th>
                  <th className="text-left py-2">Method</th>
                  <th className="text-left py-2">Gateway</th>
                </tr>
              </thead>
              <tbody>
                {feeHistories.map((h) => (
                  <tr key={h.id} className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} border-t`}> 
                    <td className="py-2">{h.paid_at ? new Date(h.paid_at).toLocaleString() : '-'}</td>
                    <td className="py-2">₹{parseFloat(h.amount).toFixed(2)}</td>
                    <td className="py-2">{h.payment_method}</td>
                    <td className="py-2">{h.payment_gateway}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'}`}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeeHistoryModal;
