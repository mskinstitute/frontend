import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { House, Info, Mail, GraduationCap, Sun, Moon, Notebook } from "lucide-react";
import { CiStreamOn } from "react-icons/ci";

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const themeClasses =
    theme === "dark"
      ? "bg-gray-900 text-white border-gray-700"
      : "bg-white text-gray-900 border-gray-200";

  const hoverTextClass =
    theme === "dark" ? "hover:text-blue-400" : "hover:text-blue-600";

  return (
    <header className={`shadow-md sticky top-0 z-50 transition-colors duration-300 ${themeClasses} border-b`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link
          to="/"
          className={`text-xl font-bold tracking-wide transition-colors duration-300 ${theme === "dark" ? "text-white hover:text-blue-400" : "text-gray-900 hover:text-blue-600"}`}
        >
          MSK
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className={`flex items-center gap-1 transition-colors duration-300 ${hoverTextClass}`}>
            <House className="h-4 w-4" /> Home
          </Link>
          <Link to="/courses" className={`flex items-center gap-1 transition-colors duration-300 ${hoverTextClass}`}>
            <GraduationCap className="h-4 w-4" /> Courses
          </Link>
          <Link to="/notes" className={`flex items-center gap-1 transition-colors duration-300 ${hoverTextClass}`}>
            <Notebook className="h-4 w-4" /> Notes
          </Link>
          <Link to="/about" className={`flex items-center gap-1 transition-colors duration-300 ${hoverTextClass}`}>
            <Info className="h-4 w-4" /> About
          </Link>
          <Link to="/contact" className={`flex items-center gap-1 transition-colors duration-300 ${hoverTextClass}`}>
            <Mail className="h-4 w-4" /> Contact
          </Link>
        </nav>

        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors duration-300 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
      </div>

      {/* Fixed Bottom Navigation - Mobile Only */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-50 ${themeClasses} border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]`}>
        <div className="flex justify-around items-center py-2 pb-safe">
          <Link to="/" className={`flex flex-col items-center gap-0.5 px-3 py-1 ${hoverTextClass}`}>
            <House className="h-5 w-5" />
            <span className="text-[10px]">Home</span>
          </Link>
          <Link to="/courses" className={`flex flex-col items-center gap-0.5 px-3 py-1 ${hoverTextClass}`}>
            <GraduationCap className="h-5 w-5" />
            <span className="text-[10px]">Courses</span>
          </Link>
          <Link to="/notes" className={`flex flex-col items-center gap-0.5 px-3 py-1 ${hoverTextClass}`}>
            <Notebook className="h-5 w-5" />
            <span className="text-[10px]">Notes</span>
          </Link>
          <Link to="/about" className={`flex flex-col items-center gap-0.5 px-3 py-1 ${hoverTextClass}`}>
            <Info className="h-5 w-5" />
            <span className="text-[10px]">About</span>
          </Link>
          <Link to="/contact" className={`flex flex-col items-center gap-0.5 px-3 py-1 ${hoverTextClass}`}>
            <Mail className="h-5 w-5" />
            <span className="text-[10px]">Contact</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
