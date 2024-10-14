import React from 'react';

const Ads = ({ user }) => {
  return (
    <div>
      <h2>Manage Ads</h2>
      {user && (
        <p>Welcome, {user.displayName || user.email}!</p>
      )}
      {/* Add ads management functionalities here */}
    </div>
  );
};

export default Ads;
