import { useState, useRef, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import {
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { variantsContext } from "../context/motionContext";
import { useContext } from "react";
import { AnimatePresence, delay, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const sharedData = useContext(variantsContext);
  const { sectionVariant, textvariant } = sharedData;

  const { user, isLoggedIn, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const NavItems = [
    { id: 1, title: "Home", link: "/" },
    { id: 2, title: "About", link: "/about" },
    { id: 5, title: "Resources", link: "/resources" },
    ...(isLoggedIn
      ? [
          { id: 3, title: "Practice", link: "/interview/setup" },
          { id: 4, title: "Dashboard", link: "/dashboard" },
          { id: 8, title: "Profile", link: "/profile" },
        ]
      : [
          { id: 6, title: "Login", link: "/login" },
          { id: 7, title: "Sign Up", link: "/signup" },
        ]),
  ];

  // motions variants
  const cardContainer = {
    hidden: { width: 0, opacity: 0 },
    visible: {
      width: "auto",
      opacity: 1,
      transition: {
        when: "beforeChildren",
        duration: 0.3,
        delayChildren: 0.2,
        staggerChildren: 0.1,
        staggerDirection: 1,
        ease: "easeInOut",
      },
    },
    exit: {
      width: 0,
      opacity: 0,
      transition: {
        when: "afterChildren",
        duration: 0.3,
        staggerChildren: 0.1,
        staggerDirection: -1,
        ease: "easeInOut",
      },
    },
  };
  const cardVariant = {
    hidden: { x: -80, y: -80, opacity: 0 },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { ease: "easeOut" },
    },
    exit: { x: -80, y: -80, opacity: 0, transition: { ease: "easeOut" } },
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
    setIsDropdownOpen(false);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const NavLinks = () => (
    <motion.div
      variants={cardVariant}
      className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8"
    >
      <Link
        to="/"
        className="px-4 py-2 rounded transition-all duration-200 text-gray-700 hover:text-cyan-500 hover:bg-white/40 hover:scale-105"
      >
        Home
      </Link>
      <Link
        to="/about"
        className="px-4 py-2 rounded transition-all duration-200 text-gray-700 hover:text-cyan-500 hover:bg-white/40 hover:scale-105"
      >
        About
      </Link>
      {isLoggedIn && (
        <Link
          to="/interview/setup"
          className="px-4 py-2 rounded transition-all duration-200 text-gray-700 hover:text-cyan-500 hover:bg-white/40 hover:scale-105"
        >
          Practice
        </Link>
      )}
      {isLoggedIn && (
        <Link
          to="/dashboard"
          className="px-4 py-2 rounded transition-all duration-200 text-gray-700 hover:text-cyan-500 hover:bg-white/40 hover:scale-105"
        >
          Dashboard
        </Link>
      )}
      <Link
        to="/resources"
        className="px-4 py-2 rounded transition-all duration-200 text-gray-700 hover:text-cyan-500 hover:bg-white/40 hover:scale-105"
      >
        Resources
      </Link>
    </motion.div>
  );

  return (
    <>
      <motion.header
        initial="hidden"
        animate="visible"
        variants={sectionVariant}
        className="sticky top-0 z-50 backdrop-blur-md bg-white/60 border-b border-white/30 shadow-sm transition-colors duration-300"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/logo.png"
                  alt="PrepEdge AI Logo"
                  className="w-9 h-9"
                />
                <motion.span
                  initial="hidden"
                  animate="visible"
                  variants={textvariant}
                  className="text-xl font-semibold text-gray-900"
                >
                  PrepEdge AI
                </motion.span>
              </Link>
            </div>

            <nav className="hidden md:flex">
              <NavLinks />
            </nav>

            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <FaTimes size={20} />
                ) : (
                  <FaBars size={20} />
                )}
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded transition-all duration-200 text-gray-700 hover:text-cyan-500 hover:bg-white/40 hover:scale-105"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/40 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white text-xl font-bold">
                          {getInitials(user.email)}
                        </span>
                      )}
                    </div>
                    <FaChevronDown
                      className={`w-3 h-3 text-gray-500 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white/40 transition-colors duration-300"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <FaUser className="w-4 h-4 mr-3 text-gray-400" />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-white/40 transition-colors duration-300 text-left"
                        >
                          <FaSignOutAlt className="w-4 h-4 mr-3 text-gray-400" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <AnimatePresence mode="wait">
            {isMobileMenuOpen && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={cardContainer}
                className="absolute left-2 right-2 top-14 bg-white z-30 md:hidden mt-2 space-y-3 py-4 px-4 flex flex-col mx-auto border-b border-blue-600 shadow-pink-500 rounded-b-4xl"
              >
                {NavItems?.map(({ id, title, link }) => (
                  <motion.div
                    variants={cardVariant}
                    key={id}
                    onClick={() => {
                      navigate(link);
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 rounded transition-all duration-200 text-gray-700 hover:text-cyan-500 hover:bg-white/40 hover:scale-105"
                  >
                    {title}
                  </motion.div>
                ))}
                {/* <NavLinks />
              {!isLoggedIn ? (
                <motion.div 
                 initial='hidden'
                 animate='visible'
                 exit='exit'
                 variants={cardContainer}
                className="space-y-2 pt-2">
                  <Link to="/login" className="block px-4 py-2 rounded transition-all duration-200 text-gray-700 hover:text-cyan-500 hover:bg-white/40 hover:scale-105">Log in</Link>
                  <Link to="/signup" className="block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Sign up</Link>
                </motion.div>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link to="/profile" className="block px-4 py-2 rounded transition-all duration-200 text-gray-700 hover:text-cyan-500 hover:bg-white/40 hover:scale-105">Profile</Link>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 rounded transition-colors duration-300 text-gray-700 hover:text-cyan-500 hover:bg-white/40">Logout</button>
                </div> 
              )
              } */}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-2 text-gray-900">
              Confirm Logout
            </h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to log out?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
