// eslint-disable-next-line no-unused-vars
import React from "react";
import { useAuth } from "../AuthenticationContext";

const Footer = () => {
  const { user } = useAuth();
  const isUser = Boolean(user);

  return (
    <footer className="bg-slate-800 text-white px-6 py-10 sm:px-4 md:px-6 lg:px-8 ">
      <div className="max-w-6xl mx-auto grid grid-cols-1 gap-10 md:grid-cols-3">
        {/* About Unity Shop */}
        <div>
          <h2 className="text-xl font-semibold mb-4">About Unity Shop</h2>
          <p className="text-gray-300">
            Unity Shop is a collaborative shopping platform that allows users
            to join group purchases and get amazing deals. Our goal is to help
            people save money while building a stronger community.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2">
            <li className="cursor-pointer hover:underline"><a href="/">Home</a></li>
            <li className="cursor-pointer hover:underline"><a href="/about">About</a></li>
            <li className="cursor-pointer hover:underline"><a href="/contact">Contact</a></li>
            {isUser && (
              <li className="cursor-pointer hover:underline"><a href="/dashboard">Dashboard</a></li>
            )}
          </ul>
        </div>

        {/* Sponsors */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Our Sponsors</h2>
          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <img
              src="/techChantier.png"
              alt="Sponsor 1"
              className="w-20 h-auto object-contain rounded-sm"
            />
            <img
              src="/nkwa.jpg"
              alt="Sponsor 2"
              className="w-20 h-auto object-contain rounded-sm"
            />
            <img
              src="/buyam.jpg"
              alt="Sponsor 3"
              className="w-20 h-auto object-contain rounded-sm"
            />
            <img
              src="/afrovision.jpg"
              alt="Sponsor 4"
              className="w-20 h-auto object-contain rounded-sm"
            />
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Unity Shop. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

