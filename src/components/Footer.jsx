import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaBolt } from "react-icons/fa";

const sections = [
  {
    key: "company",
    label: "Company",
    items: [
      { label: "About Us",  href: "/about" },
      { label: "Careers",   href: "/careers" },
      { label: "Newsroom",  href: "/news" },
      { label: "Blog",      href: "/blog" },
    ],
  },
  {
    key: "support",
    label: "Support",
    items: [
      { label: "Help Center",        href: "/help" },
      { label: "Contact Us",         href: "/contact" },
      { label: "Safety",             href: "/safety" },
      { label: "Trust & Verification", href: "/trust" },
    ],
  },
  {
    key: "legal",
    label: "Legal",
    items: [
      { label: "Privacy Policy",  href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy",   href: "/cookies" },
    ],
  },
];

const socials = [
  { icon: FaFacebookF,  href: "#", label: "Facebook" },
  { icon: FaTwitter,    href: "#", label: "Twitter" },
  { icon: FaInstagram,  href: "#", label: "Instagram" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
];

const Footer = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setActiveSection(null);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer className="bg-[#060610] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-14">

          {/* Brand col */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <FaBolt className="text-white text-sm" />
              </div>
              <span className="text-xl font-black tracking-tight">
                <span className="gradient-text">Rently</span>
                <span className="text-white">Go</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
              The future of peer-to-peer rentals. Rent anything, anywhere, from
              real people near you — fast, safe, and frictionless.
            </p>
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 glass-card rounded-xl flex items-center justify-center text-gray-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all text-sm"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {sections.map(({ key, label, items }) => (
            <div key={key}>
              <button
                className="w-full text-left flex items-center justify-between text-white font-semibold text-sm mb-4"
                onClick={() => isMobile && setActiveSection(activeSection === key ? null : key)}
              >
                {label}
                <span className="md:hidden text-gray-600 text-xs">
                  {activeSection === key ? "−" : "+"}
                </span>
              </button>
              <ul
                className={`space-y-2.5 ${
                  activeSection === key || !isMobile ? "block" : "hidden"
                }`}
              >
                {items.map(({ label: l, href }) => (
                  <li key={l}>
                    <a
                      href={href}
                      className="text-sm text-gray-500 hover:text-cyan-400 transition-colors"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App download CTA */}
        <div className="glass-card rounded-2xl p-6 md:p-8 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-bold text-lg mb-1">Get the RentlyGo App</h3>
            <p className="text-gray-500 text-sm">Available on iOS & Android — launching 2030.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button className="glass-card border border-white/10 hover:border-white/25 hover:scale-105 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
              App Store
            </button>
            <button className="glass-card border border-white/10 hover:border-white/25 hover:scale-105 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
              Google Play
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600 border-t border-white/5 pt-8">
          <span>© 2030 RentlyGo. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Built for the future ·
            <span className="gradient-text font-semibold ml-1">2030</span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
