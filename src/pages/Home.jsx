import React from "react";
import { Link } from "react-router-dom";
import image from "../images/hero_images/RentlyGo2.jpeg";
import {
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
  { name: "Properties", icon: <FaHome />, path: "/properties" },
  {
    name: "Clothing & Accessories",
    icon: <FaTshirt />,
    path: "/clothing-accessories",
  },
  {
    name: "Electronics & Gadgets",
    icon: <FaLaptop />,
    path: "/electronics-gadgets",
  },
  {
    name: "Outdoor & Adventure",
    icon: <FaCampground />,
    path: "/outdoor-adventure",
  },
  { name: "Vehicles", icon: <FaCar />, path: "/vehicles" },
  { name: "Tools & Equipments", icon: <FaTools />, path: "/tools-equipments" },
  { name: "Home & Furniture", icon: <FaCouch />, path: "/home-furniture" },
  { name: "Miscellaneous", icon: <FaBox />, path: "/miscellaneous" },
];

const Home = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <img
          src={image}
          alt="Hero"
          className="w-full h-auto max-h-[500px] object-cover"
        />
      </section>

      <h2 className="text-3xl font-semibold text-center py-8">
        Browse Categories
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 p-4">
        {categories.map((category) => (
          <Link to={category.path} key={category.name}>
            <div className="border rounded-lg p-4 text-center shadow-md hover:shadow-lg transition bg-white cursor-pointer">
              <div className="text-4xl mb-2">{category.icon}</div>
              <h3 className="font-semibold text-lg">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
