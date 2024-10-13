import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaMapMarkedAlt } from "react-icons/fa"; // Import icons
import { signOut } from "firebase/auth"; // Import signOut from Firebase
import { auth } from "../auth/firebase"; // Import your Firebase auth configuration

const Header = ({ user, setUser }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      setUser(null); // Reset the user state
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="bg-cyan-400 shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto p-3">
        {/* Top Section: Logo and Search */}
        <div className="flex flex-col md:flex-row items-center w-full">
          {/* Logo */}
          <Link to="/" className="font-bold font-sans text-lg md:text-3xl mb-2 md:mb-0">
            <span className="text-slate-700">RentlyGo</span>
          </Link>

          {/* Search Form (hidden on mobile) */}
          <form
            className="hidden md:flex bg-slate-200 rounded-lg flex-grow mx-4 max-w-3xl relative"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="Search RentlyGo"
              className="bg-transparent focus:outline-none w-full border border-slate-400 rounded-l-lg p-2"
              aria-label="Search RentlyGo"
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            <div className="relative">
              <FaMapMarkedAlt
                className="absolute left-3 top-2.5 text-slate-600"
                aria-label="Map Icon"
              />
              <input
                type="text"
                placeholder="Add postcode or location"
                className="bg-transparent focus:outline-none w-full border border-slate-400 pl-10 p-2"
                aria-label="Add postcode or location"
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
            </div>
            <button
              type="submit"
              className="flex items-center bg-slate-600 rounded-r-lg hover:bg-slate-700 h-10 px-4"
            >
              <FaSearch className="text-white h-full" aria-label="Search" />
            </button>
          </form>
        </div>

        {/* Bottom Section: User Actions in one line */}
        <div className="flex flex-col md:flex-row items-center mt-2 md:mt-0 space-y-2 md:space-y-0 md:space-x-4 w-full">
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="flex items-center text-slate-600 font-semibold">
                  Welcome, {user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex justify-center items-center bg-red-600 text-white px-4 h-10 rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex justify-center items-center bg-slate-600 text-white px-4 h-10 rounded-lg hover:bg-slate-700"
              >
                Signup/Login
              </Link>
            )}
            <Link
              to="/listing"
              className="flex justify-center items-center bg-slate-600 text-white px-4 h-10 rounded-lg hover:bg-slate-700"
            >
              Post
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
