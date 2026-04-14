import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { ThemeContext } from '../context/ThemeContext';
import { Phone, Mail } from 'lucide-react';

const RefundPolicy = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <Helmet>
        <title>Refund Policy - MSK Institute</title>
        <meta name="description" content="Refund Policy for MSK Institute courses and services." />
        <link rel="canonical" href="https://msk.shikohabad.in/refund-policy" />
      </Helmet>

      <div className={`min-h-screen py-16 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Refund Policy</h1>

          <div className={`prose dark:prose-invert max-w-none p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}`}>
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-4">Refund Terms</h2>
                <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  REFUNDED AMOUNT WILL BE CREDITED IN 3-4 WORKING DAYS IN ORIGINAL PAYMENT MODE.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Mobile Number</p>
                      <a 
                        href="tel:+919528185934" 
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        +91 9528185934
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Email ID</p>
                      <a 
                        href="mailto:sumit952818@gmail.com" 
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        sumit952818@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-blue-900/30 border border-blue-800' : 'bg-blue-50 border border-blue-200'}`}>
                <p className="text-sm">
                  For any refund-related queries or to initiate a refund request, please contact us using the information provided above. 
                  Our team will process your request and ensure the refunded amount is credited within 3-4 working days in your original payment mode.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RefundPolicy;
