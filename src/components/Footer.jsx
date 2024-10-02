import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa'; // Social media icons

const Footer = () => {
  return (
    <footer className="bg-cyan-400 text-white py-8 mt-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 p-4">

        {/* About Us Section */}
        <div>
          <h4 className="font-semibold text-xl mb-4 text-slate-800">About Us</h4>
          <p className="text-sm text-slate-700">
            RentlyGo helps you find rentals easily and efficiently. Learn more about our mission.
          </p>
          <a href="/about-us" className="text-white mt-2 inline-block hover:text-slate-300">
            Read More
          </a>
        </div>

        {/* Help & Contact Section */}
        <div>
          <h4 className="font-semibold text-xl mb-4 text-slate-800">Help & Contact</h4>
          <ul className="text-sm text-slate-700 space-y-2">
            <li><a href="/help" className="hover:text-slate-300">FAQs</a></li>
            <li><a href="/contact" className="hover:text-slate-300">Contact Us</a></li>
            <li><a href="/support" className="hover:text-slate-300">Support</a></li>
          </ul>
        </div>

        {/* More From Us Section */}
        <div>
          <h4 className="font-semibold text-xl mb-4 text-slate-800">More From Us</h4>
          <ul className="text-sm text-slate-700 space-y-2">
            <li><a href="/blog" className="hover:text-slate-300">Blog</a></li>
            <li><a href="/careers" className="hover:text-slate-300">Careers</a></li>
            <li><a href="/news" className="hover:text-slate-300">Newsroom</a></li>
          </ul>
        </div>

        {/* Upcoming Mobile Apps Section */}
        <div>
          <h4 className="font-semibold text-xl mb-4 text-slate-800">Upcoming Mobile Apps</h4>
          <p className="text-sm text-slate-700">Our mobile apps for iOS and Android are coming soon!</p>
          <div className="flex space-x-4 mt-4">
            {/* Placeholder for App Store badges */}
            <a href="#">
              <img src="/path-to-apple-store-badge.png" alt="Apple Store" className="h-8" />
            </a>
            <a href="#">
              <img src="/path-to-google-play-badge.png" alt="Google Play Store" className="h-8" />
            </a>
          </div>
        </div>
      </div>

      {/* Social Media Icons */}
      <div className="mt-8 border-t border-slate-600 pt-4 text-center">
        <div className="flex justify-center space-x-6">
          <a href="#" className="hover:text-slate-300"><FaFacebookF /></a>
          <a href="#" className="hover:text-slate-300"><FaTwitter /></a>
          <a href="#" className="hover:text-slate-300"><FaInstagram /></a>
        </div>
        <p className="text-sm text-slate-700 mt-4">&copy; 2024 RentlyGo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
