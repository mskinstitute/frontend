import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Building } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <footer className={`transition-colors duration-300 ${isDark
      ? 'bg-gray-900 text-gray-300'
      : 'bg-gray-100 text-gray-800'
      }`}>
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="space-y-4">
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>MSK Institute</div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              Empowering students with quality education in computer science, programming, and digital skills.
              Join our community of learners today.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/mskinstitute" target="_blank" rel="noopener noreferrer" className={`hover:text-blue-500 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com/mskinstitute" target="_blank" rel="noopener noreferrer" className={`hover:text-pink-500 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <Instagram size={20} />
              </a>
              <a href="https://youtube.com/mskinstitute" target="_blank" rel="noopener noreferrer" className={`hover:text-red-500 transition-colors ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className={`hover:text-white transition-colors ${isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'}`}>All Courses</Link>
              </li>
              <li>
                <Link to="/live-courses" className={`hover:text-white transition-colors ${isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'}`}>Live Courses</Link>
              </li>
              <li>
                <Link to="/about" className={`hover:text-white transition-colors ${isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'}`}>About Us</Link>
              </li>
              <li>
                <Link to="/contact" className={`hover:text-white transition-colors ${isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'}`}>Contact Us</Link>
              </li>
              {/* <li>
                <Link to="/affiliate-program" className={`hover:text-white transition-colors ${isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'}`}>Affiliate Program</Link>
              </li> */}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Info</h3>
            <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                MSK Institute, Gali No. 3, Near Gyan Jyoti Public School, Shikohabad, Firozabad, UP-283135
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} />
                <a href="tel:+918393042166" className={`hover:text-white transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>+91 8393042166</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                <a href="mailto:mskshikohabad@gmail.com" className={`hover:text-white transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>mskshikohabad@gmail.com</a>
              </li>
              <li className="flex items-center gap-2">
                <Building size={16} />
                Hours: Mon-Sat, 9:00 AM - 6:00 PM
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Newsletter</h3>
            <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>Subscribe to our newsletter for updates, offers, and tech tips.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-2 rounded border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${isDark
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
              />
              <button
                type="submit"
                className="w-full px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${isDark ? 'border-gray-800' : 'border-gray-300'}`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm">
              © {new Date().getFullYear()} MSK Institute. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy-policy" className={`hover:text-white transition-colors ${isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'}`}>Privacy Policy</Link>
              <Link to="/terms" className={`hover:text-white transition-colors ${isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'}`}>Terms of Service</Link>
              <Link to="/refund-policy" className={`hover:text-white transition-colors ${isDark ? 'text-gray-300 hover:text-gray-100' : 'text-gray-700 hover:text-gray-900'}`}>Refund Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;