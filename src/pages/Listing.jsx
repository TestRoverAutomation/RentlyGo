import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PostAd from "./manage/PostAds"; // Ensure correct import of PostAd component

const Ads = ({ user, logout }) => {
  const [showPostAd, setShowPostAd] = useState(false);
  const navigate = useNavigate();

  // Use useEffect to check user state and hide form on logout
  useEffect(() => {
    if (!user) {
      setShowPostAd(false); // Hide form if user logs out
    }
  }, [user]); // Dependency on user, re-evaluate when user changes

  // Handle click on "Post a New Ad" button
  const handlePostAdClick = () => {
    if (!user) {
      // Redirect to login if user is not authenticated
      navigate("/login");
    } else {
      // Toggle the "Post an Ad" form visibility if user is authenticated
      setShowPostAd(!showPostAd);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    logout(); // Call the passed logout function to handle the actual logout logic
    // Stay on the current page (in this case, Listings page) after logout
    navigate("/listings"); // Redirect to listings page after logout
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {user && (
        <p className="text-lg mb-4">
          Welcome, <strong>{user.displayName || user.email}!</strong>
          <button
            onClick={handleLogout}
            className="ml-4 bg-red-600 text-white py-1 px-3 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </p>
      )}

      {/* Button to toggle the "Post an Ad" form or redirect to login */}
      <button
        onClick={handlePostAdClick}
        className="mb-4 bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700"
      >
        {showPostAd ? "Cancel Posting" : "Post a New Ad"}
      </button>

      {/* Conditionally show the PostAd form */}
      {showPostAd && user && (
        <div className="mt-4">
          <PostAd />
        </div>
      )}

      {/* Ads management functionalities would go here */}
      <div>
        <p className="text-gray-600">
          Your current ads will be displayed here...
        </p>
      </div>
    </div>
  );
};

export default Ads;
