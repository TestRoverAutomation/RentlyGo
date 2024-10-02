import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { FaSearch, FaMapMarkedAlt, FaUserPlus, FaSignInAlt, FaPlus } from 'react-icons/fa'; // Import icons

const Header = () => {
  const [isSearchFocused, setIsSearchFocused] = useState(false); 

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  return (
    <header className='bg-cyan-400 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>

        {/* Logo */}
        {!isSearchFocused && (
          <Link to="/" className='font-bold font-sans text-sm sm:text-3xl'>
            <span className='text-slate-700'>RentlyGo</span>
          </Link>
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
          <div className='relative'>
            <FaMapMarkedAlt className='absolute left-3 top-2.5 text-slate-600' aria-label='Map Icon' />
            <input
              type='text'
              placeholder='Add postcode or location'
              className='bg-transparent focus:outline-none w-full border  border-slate-400 pl-10 p-2'
              aria-label='Add postcode or location'
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
          </div>
          <button type='submit' className='flex items-center bg-slate-600 rounded-r-lg hover:bg-slate-700 h-10 px-4'>
            <FaSearch className='text-white h-full' aria-label='Search' />
          </button>
        </form>

        {/* Desktop: Combined Signup/Login and Post Buttons */}
        {!isSearchFocused && (
          <div className='hidden md:flex space-x-4'>
           {/* Signup/Login Button */}
            <Link to="/login" className='flex justify-center items-center bg-slate-600 text-white px-4 h-10 rounded-lg hover:bg-slate-700'>
                Signup/Login
            </Link>

         {/* Post Button */}
            <Link to="/listing" className='flex justify-center items-center bg-slate-600 text-white px-4 h-10 rounded-lg hover:bg-slate-700'>
                Post
            </Link>
          </div>
        )}

        {/* Mobile: Login and Post Buttons */}
        {!isSearchFocused && (
          <div className='flex md:hidden space-x-2'>
            <button className='bg-slate-600 text-white px-4 h-10 rounded-lg  hover:bg-slate-700' aria-label='Signup/Login'>
            <FaUserPlus className='text-xl' /> {/* Signup/Login Icon */}
            </button>
            <button className='bg-slate-600 text-white px-4 h-10 rounded-lg hover:bg-slate-700' aria-label='Post'>
            <FaPlus className='text-xl' /> {/* Post Icon */}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
