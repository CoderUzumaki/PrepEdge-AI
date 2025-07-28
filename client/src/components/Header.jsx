import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaUser, FaSignOutAlt, FaChevronDown, FaBars, FaTimes } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"

export default function Header() {
  const { user, isLoggedIn, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    logout()
    setIsDropdownOpen(false)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const NavLinks = () => (
    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
      <Link to="/" className="text-black transition-all duration-200 ease-in-out hover:underline active:underline underline-offset-4 decoration-2 hover:text-opacity-90 hover:scale-105">Home</Link>
      <Link to="/about" className="text-black transition-all duration-200 ease-in-out hover:underline active:underline underline-offset-4 decoration-2 hover:text-opacity-90 hover:scale-105">About</Link>
      {isLoggedIn && (
        <Link to="/interview/setup" className="text-black transition-all duration-200 ease-in-out hover:underline active:underline underline-offset-4 decoration-2 hover:text-opacity-90 hover:scale-105">Practice</Link>
      )}
      {isLoggedIn && (
        <Link to="/dashboard" className="text-black transition-all duration-200 ease-in-out hover:underline active:underline underline-offset-4 decoration-2 hover:text-opacity-90 hover:scale-105">Dashboard</Link>
      )}
      <Link to="/resources" className="text-black transition-all duration-200 ease-in-out hover:underline active:underline underline-offset-4 decoration-2 hover:text-opacity-90 hover:scale-105">Resources</Link>
    </div>
  )

  return (
    <header className="bg-white/70 backdrop-blur-md shadow-md border-b border-white/30 fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="PrepEdge AI Logo" className="w-9 h-9" />
              <span className="text-xl font-semibold text-gray-900">PrepEdge AI</span>
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
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">Log in</Link>
                <Link to="/signup" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors">Sign up</Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xl font-bold">{getInitials(user.email)}</span>
                    )}
                  </div>
                  <FaChevronDown className={`w-3 h-3 text-gray-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => setIsDropdownOpen(false)}>
                        <FaUser className="w-4 h-4 mr-3 text-gray-400" />
                        Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left">
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

        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 space-y-2 pb-4">
            <NavLinks />
            {!isLoggedIn ? (
              <div className="space-y-2 pt-2">
                <Link to="/login" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">Log in</Link>
                <Link to="/signup" className="block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Sign up</Link>
              </div>
            ) : (
              <div className="space-y-2 pt-2">
                <Link to="/profile" className="block text-gray-700 hover:bg-gray-100 rounded-md">Profile</Link>
                <button onClick={handleLogout} className="w-full text-left text-gray-700 hover:bg-gray-100 rounded-md">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
