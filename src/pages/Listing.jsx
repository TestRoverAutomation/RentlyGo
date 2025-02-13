import React, { useState } from "react";
import PostAd from "./manage/PostAds"; // Assuming PostAd component is in the same folder

const Ads = ({ user }) => {
  const [showPostAd, setShowPostAd] = useState(false);

  // Toggle the "Post an Ad" form visibility
  const togglePostAd = () => setShowPostAd(!showPostAd);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {user && (
        <p className="text-lg mb-4">
          Welcome, <strong>{user.displayName || user.email}!</strong>
        </p>
      )}

      {/* Button to toggle the "Post an Ad" form */}
      <button
        onClick={togglePostAd}
        className="mb-4 bg-slate-600 text-white py-2 px-4 rounded-lg hover:bg-slate-700"
      >
        {showPostAd ? "Cancel Posting" : "Post a New Ad"}
      </button>

      {/* Conditionally show the PostAd form */}
      {showPostAd && (
        <div className="mt-4">
          <PostAd />
        </div>
      )}

      {/* Ads management functionalities would go here, such as listing ads */}
      <div>
        {/* You can add a table or cards displaying the user's ads here */}
        <p className="text-gray-600">
          Your current ads will be displayed here...
        </p>
      </div>
    </div>
  );
};

export default Ads;
