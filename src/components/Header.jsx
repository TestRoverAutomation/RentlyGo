import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { FaSearch, FaMapMarkedAlt, FaBars } from 'react-icons/fa';

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false); // State to track if search is focused
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State to toggle mobile menu

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className='bg-cyan-400 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>

        {/* Logo, Login, and Post Buttons */}
        {!isSearchFocused && (
          <>
            {/* Logo */}
            <Link to="/" className='font-bold text-sm sm:text-3xl'>
              <span className='text-slate-800'>RentlyGo</span>
            </Link>

            {/* Search and Post Button in mobile */}
            <div className="flex md:hidden space-x-2">
             <div></div>
              <button className='bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700'>
                Login
              </button>
              <button className='bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700'>
                Post
              </button>
            </div>
          </>
        )}

        {/* Search Form */}
        <form className='bg-slate-200 rounded-lg flex items-center flex-grow mx-4 max-w-3xl relative' onSubmit={(e) => e.preventDefault()}>
          <input
            type='text'
            placeholder='Search RentlyGo'
            className='bg-transparent focus:outline-none w-full border border-slate-400 rounded-l-lg p-2'
            aria-label='Search RentlyGo'
            onFocus={handleSearchFocus}
            onBlur={handleSearchBlur}
          />
              <div className='relative '>
                <FaMapMarkedAlt className='absolute left-3 top-2.5 text-slate-600' aria-label='Map Icon' />
                <input
                  type='text'
                  placeholder='Add postcode or location'
                  className='bg-transparent focus:outline-none w-full border border-slate-400 pl-10 p-2'
                  aria-label='Add postcode or location'
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
              </div>
        </form>

        {/* Login and Post Buttons in Desktop */}
        {!isSearchFocused && (
          <div className='hidden md:flex space-x-2'>
            <button className='bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700'>
              Login
            </button>
            <button className='bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700'>
              Post
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;