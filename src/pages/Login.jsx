import React, { useState } from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa"; // Import Facebook and Google icons

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup

  // Toggle between Login and Signup
  const toggleForm = (loginState) => {
    setIsLogin(loginState);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      {/* Container for the form */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        
        {/* Toggle Header at the Top */}
        <div className="flex justify-center mb-6 border-b border-gray-300 pb-4">
          <button
            onClick={() => toggleForm(true)}
            className={`w-1/2 py-2 font-semibold ${
              isLogin ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-500"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => toggleForm(false)}
            className={`w-1/2 py-2 font-semibold ${
              !isLogin ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">Welcome to RentlyGo</h2>
          <p className="text-sm text-gray-600 mt-2">
            Sign in or Register to:
            <ul className="list-disc text-left ml-6 mt-2">
              <li>Rent item from listed vendor</li>
              <li>Send and receive messages</li>
              <li>Post and manage your ads</li>
              <li>Rate other users</li>
              <li>Favourite ads to check them out later</li>
              <li>Set alerts for your searches and never miss a new ad in your area</li>
            </ul>
          </p>
        </div>

        {/* Partition Line */}
        <hr className="border-t border-gray-300 mb-6" />

        {/* Form for Login or Signup */}
        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? "Login to RentlyGo" : "Sign up for RentlyGo"}
        </h2>

        {/* Social Login Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            type="button"
            className="flex items-center justify-center w-full bg-cyan-400 shadow-md text-white py-2 rounded hover:bg-slate-600 transition duration-200"
            aria-label={isLogin ? "Login with Facebook" : "Sign up with Facebook"}
          >
            <FaFacebookF className="mr-2" /> Facebook
          </button>

          <button
            type="button"
            className="flex items-center justify-center w-full bg-cyan-400 shadow-md text-white py-2 rounded hover:bg-slate-600 transition duration-200"
            aria-label={isLogin ? "Login with Google" : "Sign up with Google"}
          >
            <FaGoogle className="mr-2" /> Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
