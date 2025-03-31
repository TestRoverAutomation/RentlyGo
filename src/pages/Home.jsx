import React from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import image1 from "../images/hero_images/RentlyGo2.jpeg";
import image2 from "../images/hero_images/appartment.jpeg";
import image3 from "../images/hero_images/bikes.jpeg";
import image4 from "../images/hero_images/dress.jpeg";
import image5 from "../images/hero_images/RentlyGoMan.jpeg";
import image6 from "../images/hero_images/RentlyGoMan2.jpeg";
import image7 from "../images/hero_images/RentlyGoWoman.jpeg";
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

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
};

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
      {/* Hero Slider */}
      <section className="relative overflow-hidden">
        <Slider {...sliderSettings}>
          {[image1, image2, image3, image6, image4, image7].map(
            (img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`Hero ${index + 1}`}
                  className="w-full h-auto max-h-[500px] object-cover"
                />
              </div>
            ),
          )}
        </Slider>
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
