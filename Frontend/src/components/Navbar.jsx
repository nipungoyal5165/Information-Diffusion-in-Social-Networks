import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Title */}
        <h1 className="text-3xl font-bold text-white hover:text-gray-200 transition-all duration-300 ease-in-out">
          Information Diffusion
        </h1>

        {/* Navigation Links */}
        <div className="space-x-6 hidden md:flex">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-yellow-300 transition-all duration-300 ease-in-out"
          >
            Dataset
          </a>
          <a
            href="https://docs.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-yellow-300 transition-all duration-300 ease-in-out"
          >
            Report
          </a>
          <a
            href="https://www.canva.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-yellow-300 transition-all duration-300 ease-in-out"
          >
            Presentation
          </a>
        </div>

        {/* Mobile Menu (Hamburger) */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Links */}
      <div className="md:hidden bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 p-4">
        <div className="space-y-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-white hover:text-yellow-300 transition-all duration-300 ease-in-out"
          >
            Dataset
          </a>
          <a
            href="https://docs.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-white hover:text-yellow-300 transition-all duration-300 ease-in-out"
          >
            Report
          </a>
          <a
            href="https://www.canva.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-white hover:text-yellow-300 transition-all duration-300 ease-in-out"
          >
            Presentation
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
