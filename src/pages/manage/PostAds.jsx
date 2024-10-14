import React, { useState } from "react";

const PostAd = () => {
    const categories = [
        {
          name: "Properties",
          subcategories: ["Residential Rentals", "Commercial Rentals"],
        },
        {
          name: "Clothing & Accessories",
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
          subcategories: ["Power Tools", "Builder tools", "Garden tools"],
        },
        {
          name: "Home & Furniture",
          subcategories: ["Furniture", "Kitchen Appliances"],
        },
        {
          name: "Miscellaneous",
          subcategories: ["Events", "Community", "Services", "Jobs", "Freebies"],
        }
      ];

  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  // Handle input change and filter categories for the dropdown
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);

    if (value) {
      const filtered = categories
        .map((category) => ({
          ...category,
          subcategories: category.subcategories.filter((subcategory) =>
            subcategory.toLowerCase().includes(value.toLowerCase())
          ),
        }))
        .filter((category) => category.subcategories.length > 0);
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Post an Ad</h2>
      <form>
        {/* Category Input with Auto-dropdown */}
        <label className="block mb-2 text-sm font-medium">Category</label>
        <input
          type="text"
          value={selectedCategory}
          onChange={handleCategoryChange}
          placeholder="e.g. Car, Sofa, Xbox"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />

        {filteredCategories.length > 0 && (
          <div className="bg-white border border-gray-300 rounded-lg p-2">
            <ul>
              {filteredCategories.map((category) => (
                <li key={category.name}>
                  <strong>{category.name}</strong>
                  <ul>
                    {category.subcategories.map((subcategory) => (
                      <li key={subcategory}>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory(subcategory)}
                          className="block w-full text-left py-1 hover:bg-gray-100"
                        >
                          {subcategory}
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Title Input */}
        <label className="block mb-2 text-sm font-medium">Title</label>
        <input
          type="text"
          placeholder="Enter a title for your ad"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        />

        {/* Description */}
        <label className="block mb-2 text-sm font-medium">Description</label>
        <textarea
          placeholder="Describe your item"
          className="w-full border border-gray-300 rounded-lg p-2 mb-4"
        ></textarea>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-slate-600 text-white py-2 rounded-lg hover:bg-slate-700"
        >
          Post Ad
        </button>
      </form>
    </div>
  );
};

export default PostAd;
