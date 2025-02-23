import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import PostAd from "./PostAds"; // Assuming PostAd component is in the same folder
import LoginSignup from "../../pages/Login"; // Import LoginSignup component

const Ads = ({ user, setUser }) => {
  const [showPostAd, setShowPostAd] = useState(false);
  const navigate = useNavigate(); // Initialize navigate function

  // Check if the user is logged out and perform redirection
  useEffect(() => {
    if (!user) {
      navigate("/login"); // Redirect to login page when the user is logged out
    }
  }, [user, navigate]); // Depend on user and navigate for re-evaluation

  // Toggle the "Post an Ad" form visibility
  const togglePostAd = () => {
    if (!user) {
      // If user is not logged in, redirect to login
      navigate("/login");
    } else {
      setShowPostAd(!showPostAd); // Toggle the form visibility
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {user ? (
        <p className="text-lg mb-4">
          Welcome, <strong>{user.displayName || user.email}!</strong>
        </p>
      ) : (
        <p className="text-lg mb-4">Please log in to post an ad.</p>
      )}

      {/* Button to toggle the "Post an Ad" form, only show if logged in */}
      {user && (
        <button
          onClick={togglePostAd}
          className="mb-4 bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700"
        >
          {showPostAd ? "Cancel Posting" : "Post a New Ad"}
        </button>
      )}

      {/* Conditionally show the PostAd form or LoginSignup form */}
      {user ? (
        showPostAd && (
          <div className="mt-4">
            <PostAd />
          </div>
        )
      ) : (
        <div className="mt-4">
          <LoginSignup setUser={setUser} /> {/* Pass setUser prop to LoginSignup */}
        </div>
      )}

      {/* Ads management functionalities would go here, such as listing ads */}
      <div>
        <p className="text-gray-600">
          Your current ads will be displayed here...
        </p>
      </div>
    </div>
  );
};

export default Ads;
