import React from "react";

// Define the categories and their corresponding icons
const categories = [
  {
    name: "Properties",
    icon: "🏡",
  },
  {
    name: "Clothing & Accessories",
    icon: "👗",
  },
  {
    name: "Electronics & Gadgets",
    icon: "💻",
  },
  {
    name: "Outdoor & Adventure",
    icon: "🏕️",
  },
  {
    name: "Vehicles",
    icon: "🚗",
  },
  {
    name: "Tools & Equipment",
    icon: "🛠️",
  },
  {
    name: "Home & Furniture",
    icon: "🛋️",
  },
  {
    name: "Miscellaneous",
    icon: "📦",
  },
];

const Home = () => {
  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <img
          src="/images/hero_images/RentlyGo2.jpeg" // Adjust the path as needed
          alt="Hero"
          className="w-full h-auto max-h-[500px] object-cover" // Changed to object-cover
        />
      </section>

      <h2 className="text-3xl font-semibold text-center py-8">Browse Categories</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 p-4">
        {categories.map((category) => (
          <div
            key={category.name}
            className="border rounded-lg p-4 text-center shadow-md hover:shadow-lg transition bg-white"
          >
            <div className="text-4xl mb-2">{category.icon}</div>
            <h3 className="font-semibold text-lg">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
