import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const categories = [
  {
    name: 'Properties',
    subcategories: ['Residential Rentals', 'Commercial Rentals'],
  },
  {
    name: 'Clothing & Accessories',
    subcategories: ['Mens Wear', 'Womens Wear', 'Kids Wear', 'Shoes', 'Bags', 'Party Costumes', 'Accessories'],
  },
  {
    name: 'Electronics & Gadgets',
    subcategories: ['Cameras', 'Camcorders','Studio Equipments','Sound System', 'Party lightings', 'Instruments', 'Game Consoles', 'Projectors', 'Laptops', 'Mobile & Tab'],
  },
  {
    name: 'Outdoor & Adventure',
    subcategories: ['Party Decoration','Camping Gear', 'Marquee', 'Bouncy Castle', 'Garden Furniture','Bicycles', 'Boats', 'Barbecue-Grills'],
  },
  {
    name: 'Vehicles',
    subcategories: ['Cars', 'Van', 'Caravan', 'Motorbikes', 'Scooters', 'E-Bikes'],
  },
  {
    name: 'Tools & Equipment',
    subcategories: ['Power Tools', 'Builder tools', 'Garden tools'],
  },
  {
    name: 'Home & Furniture',
    subcategories: ['Furniture', 'Kitchen Appliances'],
  },
  {
    name: 'Miscellaneous',
    subcategories: ['Events', 'Community', 'Services', 'Jobs', 'Freebies'],
  },
];

const SubNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCategory = (category) => setActiveCategory(activeCategory === category ? null : category);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-slate-300 shadow-md">
      {/* Desktop View */}
      <div className="hidden md:block max-w-6xl mx-auto p-4">
        <div className="flex space-x-4">
          {categories.map((category) => (
            <div key={category.name} className="relative group">
              <button className="focus:outline-none text-slate-800 hover:text-slate-600">
                {category.name}
              </button>
              <div className="absolute left-0 z-10 hidden group-hover:block bg-white shadow-lg p-4 rounded-lg">
                <ul>
                  {category.subcategories.map((subcategory) => (
                    <li key={subcategory} className="py-1 hover:text-slate-600 cursor-pointer">
                      <Link to={`/${subcategory.toLowerCase().replace(/ /g, '-')}`}>
                        {subcategory}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View with Burger Menu */}
      <div className="block md:hidden p-4">
        <button onClick={toggleMenu} className="text-slate-800 hover:text-slate-600 focus:outline-none">
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Burger Menu Dropdown */}
        {isMenuOpen && (
          <div className="bg-slate-200 mt-2 p-4 rounded-lg shadow-lg">
            {categories.map((category) => (
              <div key={category.name} className="border-b border-slate-400 py-2">
                <button
                  className="w-full text-left text-slate-800 hover:text-slate-600 focus:outline-none py-2 font-semibold flex justify-between items-center"
                  onClick={() => toggleCategory(category.name)}
                >
                  {category.name}
                  <span className="text-slate-600">{activeCategory === category.name ? '-' : '+'}</span>
                </button>

                {/* Subcategory Dropdown */}
                {activeCategory === category.name && (
                  <ul className="pl-4 mt-2 space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory} className="py-1 hover:text-slate-600 cursor-pointer">
                        <Link 
                          to={`/${subcategory.toLowerCase().replace(/ /g, '-')}`}
                          onClick={closeMenu}  
                        >
                          {subcategory}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default SubNav;
