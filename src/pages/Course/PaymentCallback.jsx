import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BookOpen, GraduationCap } from 'lucide-react';

const PaymentCallback = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <Helmet><title>Payment – MSK Institute</title></Helmet>
      <div className="text-center max-w-md bg-gray-800 p-8 rounded-2xl border border-gray-700">
        <GraduationCap className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Payment Status</h2>
        <p className="text-gray-400 mb-6">Payment processing is currently unavailable in offline mode.</p>
        <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all">
          <BookOpen className="w-5 h-5" />
          Browse Courses
        </Link>
      </div>
    </div>
  );
};

export default PaymentCallback;

