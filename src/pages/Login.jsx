import React, { useState, useEffect } from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { auth, googleProvider, facebookProvider } from "../auth/firebase";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
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
        navigate("/login"); // Ensure the user is on the login page if logged out
      }
    });

    // Cleanup the subscription on component unmount
    return () => unsubscribe();
  }, [setUser, navigate]);

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
      navigate("/manage-ads"); // Redirect to the manage ads page
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
      navigate("/manage-ads"); // Redirect to the home page
    } catch (error) {
      console.error("Error during Facebook sign-in:", error);
    }
  };

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      setUser(null); // Reset the user state in the parent component
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090f] px-4 py-16">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-xs font-black">RG</span>
          </div>
          <span className="text-xl font-black tracking-tight text-white">
            <span className="gradient-text">Rently</span>Go
          </span>
        </div>

        <div className="glass-card rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex mb-7 border-b border-white/[0.08]">
            <button
              onClick={() => toggleForm(true)}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                isLogin
                  ? "text-white border-b-2 border-indigo-500"
                  : "text-gray-600 hover:text-gray-400"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => toggleForm(false)}
              className={`flex-1 pb-3 text-sm font-semibold transition-colors ${
                !isLogin
                  ? "text-white border-b-2 border-indigo-500"
                  : "text-gray-600 hover:text-gray-400"
              }`}
            >
              Create account
            </button>
          </div>

          <div className="mb-6">
            <h2 className="text-white font-bold text-lg mb-1">
              {isLogin ? "Welcome back" : "Get started"}
            </h2>
            <p className="text-gray-600 text-sm">
              {isLogin
                ? "Sign in to manage your listings and rentals."
                : "Create a free account to start renting and listing."}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-2.5 w-full glass-card border border-white/10 hover:border-white/20 text-white py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/[0.04]"
            >
              <FaGoogle className="text-sm" /> Continue with Google
            </button>
            <button
              type="button"
              onClick={handleFacebookSignIn}
              className="flex items-center justify-center gap-2.5 w-full glass-card border border-white/10 hover:border-white/20 text-white py-3 rounded-xl text-sm font-medium transition-all hover:bg-white/[0.04]"
            >
              <FaFacebookF className="text-sm" /> Continue with Facebook
            </button>
          </div>

          <p className="text-gray-700 text-xs text-center mt-6">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
