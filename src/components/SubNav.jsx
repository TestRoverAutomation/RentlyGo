import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaMapMarkedAlt,
  FaHome,
  FaTshirt,
  FaLaptop,
  FaCampground,
  FaCar,
  FaTools,
  FaCouch,
  FaBox,
} from "react-icons/fa";

const categories = [
  {
    name: "Properties",
    path: "properties",
    icon: <FaHome />,
    subcategories: ["Residential Rentals", "Commercial Rentals"],
  },
  {
    name: "Clothing & Accessories",
    path: "clothing-accessories",
    icon: <FaTshirt />,
    subcategories: [
      "Mens Wear",
      "Womens Wear",
      "Kids Wear",
      "Shoes",
      "Bags",
      "Party Costumes",
      "Accessories",
    ],
  },
  {
    name: "Electronics & Gadgets",
    path: "electronics-gadgets",
    icon: <FaLaptop />,
    subcategories: [
      "Cameras",
      "Camcorders",
      "Studio Equipments",
      "Sound System",
      "Party lightings",
      "Instruments",
      "Game Consoles",
      "Projectors",
      "Laptops",
      "Mobile & Tab",
    ],
  },
  {
    name: "Outdoor & Adventure",
    path: "outdoor-adventure",
    icon: <FaCampground />,
    subcategories: [
      "Party Decoration",
      "Camping Gear",
      "Marquee",
      "Bouncy Castle",
      "Garden Furniture",
      "Bicycles",
      "Boats",
      "Barbecue-Grills",
    ],
  },
  {
    name: "Vehicles",
    path: "vehicles",
    icon: <FaCar />,
    subcategories: [
      "Cars",
      "Van",
      "Caravan",
      "Motorbikes",
      "Scooters",
      "E-Bikes",
    ],
  },
  {
    name: "Tools & Equipment",
    path: "tools-equipments",
    icon: <FaTools />,
    subcategories: ["Power Tools", "Builder tools", "Garden tools"],
  },
  {
    name: "Home & Furniture",
    path: "home-furniture",
    icon: <FaCouch />,
    subcategories: ["Furniture", "Kitchen Appliances"],
  },
  {
    name: "Miscellaneous",
    path: "miscellaneous",
    icon: <FaBox />,
    subcategories: ["Events", "Community", "Services", "Jobs", "Freebies"],
  },
];

const SubNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCategory = (category) =>
    setActiveCategory(activeCategory === category ? null : category);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setActiveCategory(null);
  };

  return (
    <nav className="bg-slate-300 shadow-md">
      <div className="hidden md:block max-w-6xl mx-auto p-4">
        <div className="flex space-x-4">
          {categories.map((category) => (
            <div key={category.name} className="relative group">
              <button className="focus:outline-none font-sans font-semibold text-sm text-slate-800 hover:text-slate-600 flex items-center">
                {category.icon}
                <span className="ml-1">{category.name}</span>
              </button>
              <div className="absolute left-0 z-10 hidden group-hover:block bg-white shadow-lg p-4 rounded-lg">
                <ul>
                  {category.subcategories.map((subcategory) => (
                    <li
                      key={subcategory}
                      className="py-1 hover:text-slate-600 cursor-pointer"
                    >
                      <Link
                        to={`/${category.path.toLowerCase().replace(/ /g, "-")}/${subcategory.toLowerCase().replace(/ /g, "-")}`}
                      >
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

      <div className="block md:hidden p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleMenu}
            className="text-slate-800 hover:text-slate-600 focus:outline-none"
          >
            {isMenuOpen ? <FaTimes size={38} /> : <FaBars size={38} />}
          </button>
          <form className="flex items-center space-x-2 ml-2 flex-grow">
            <div className="flex items-center bg-slate-200 rounded-lg p-2 flex-grow">
              <FaSearch className="text-slate-600 mr-2" />
              <input
                type="text"
                placeholder="Search RentlyGo"
                className="bg-transparent focus:outline-none w-full"
                aria-label="Search RentlyGo"
              />
            </div>
            <div className="flex items-center bg-slate-200 rounded-lg p-2 flex-grow">
              <FaMapMarkedAlt className="text-slate-600 mr-2" />
              <input
                type="text"
                placeholder="Add postcode or location"
                className="bg-transparent focus:outline-none w-full"
                aria-label="Add postcode or location"
              />
            </div>
          </form>
        </div>

        {isMenuOpen && (
          <div className="bg-slate-200 mt-2 p-4 rounded-lg shadow-lg">
            {categories.map((category) => (
              <div
                key={category.name}
                className="border-b border-slate-400 py-2"
              >
                <button
                  className="w-full text-left text-slate-800 hover:text-slate-600 focus:outline-none py-2 font-semibold flex items-center justify-start"
                  onClick={() => toggleCategory(category.name)}
                >
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                  <span className="ml-auto text-slate-600">
                    {activeCategory === category.name ? "-" : "+"}
                  </span>
                </button>
                {activeCategory === category.name && (
                  <ul className="pl-4 mt-2 space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <li
                        key={subcategory}
                        className="py-1 hover:text-slate-600 cursor-pointer"
                      >
                        <Link
                          to={`/${category.path.toLowerCase().replace(/ /g, "-")}/${subcategory.toLowerCase().replace(/ /g, "-")}`}
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
