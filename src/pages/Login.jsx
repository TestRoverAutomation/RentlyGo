import React, { useState, useEffect } from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { auth, googleProvider, facebookProvider } from "../auth/firebase";
import { signInWithPopup, onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { useNavigate } from "react-router-dom"; // For navigation

const LoginSignup = ({ setUser }) => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Monitor auth state changes and set user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set the user in the parent component
      } else {
        setUser(null); // Reset user if no one is logged in
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, [setUser]);

  const toggleForm = (loginState) => {
    setIsLogin(loginState);
  };

  // Google Sign-In with Persistence
  const handleGoogleSignIn = async () => {
    try {
      // Set persistence to local (keep user logged in after page refresh)
      await setPersistence(auth, browserLocalPersistence);
      
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("User signed in:", user);
      setUser(user); // Set the user in the parent component
      navigate("/"); // Redirect to the home page
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  // Facebook Sign-In with Persistence
  const handleFacebookSignIn = async () => {
    try {
      // Set persistence to local (keep user logged in after page refresh)
      await setPersistence(auth, browserLocalPersistence);

      const result = await signInWithPopup(auth, facebookProvider);
      const user = result.user;
      console.log("User signed in:", user);
      setUser(user); // Set the user in the parent component
      navigate("/"); // Redirect to the home page
    } catch (error) {
      console.error("Error during Facebook sign-in:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6 border-b border-gray-300 pb-4">
          <button
            onClick={() => toggleForm(true)}
            className={`w-1/2 py-2 font-semibold ${isLogin ? "text-cyan-600 border-b-2 border-cyan-600" : "text-gray-500"}`}
            style={{ backgroundColor: isLogin ? "#e0f7fa" : "transparent" }}
          >
            Login
          </button>
          <button
            onClick={() => toggleForm(false)}
            className={`w-1/2 py-2 font-semibold ${!isLogin ? "text-cyan-600 border-b-2 border-cyan-600" : "text-gray-500"}`}
            style={{ backgroundColor: !isLogin ? "#e0f7fa" : "transparent" }}
          >
            Sign Up
          </button>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">Welcome to RentlyGo</h2>
          <p className="text-sm text-gray-600 mt-2">
            Sign in or Register to:
            <ul className="list-disc text-left ml-6 mt-2">
              <li>Rent items from listed vendors</li>
              <li>Send and receive messages</li>
              <li>Post and manage your ads</li>
              <li>Rate other users</li>
              <li>Favourite ads to check them out later</li>
              <li>Set alerts for your searches and never miss a new ad in your area</li>
            </ul>
          </p>
        </div>

        <hr className="border-t border-gray-300 mb-6" />

        <h2 className="text-2xl font-semibold text-center mb-6">
          {isLogin ? "Login to RentlyGo" : "Sign up for RentlyGo"}
        </h2>

        <div className="flex justify-center gap-4 mb-4">
          <button
            type="button"
            onClick={handleFacebookSignIn}
            className="flex items-center justify-center w-full bg-slate-600 shadow-md text-white py-2 rounded hover:bg-cyan-500 transition duration-200"
          >
            <FaFacebookF className="mr-2" /> Facebook
          </button>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center w-full bg-slate-600 shadow-md text-white py-2 rounded hover:bg-cyan-500 transition duration-200"
          >
            <FaGoogle className="mr-2" /> Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
