// src/components/Navbar.jsx
import React, { useState } from "react";
import { HiSun, HiMoon } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { RiSettings3Fill } from "react-icons/ri";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="nav flex items-center justify-between px-[100px] h-[90px] border-b border-gray-800 bg-inherit">
      <div className="logo">
        <h3 className="text-[25px] font-[700] sp-text">GenUI</h3>
      </div>
      <div className="icons flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-700 transition"
          title="Toggle theme"
        >
          {darkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
        </button>

        <button
          className="p-2 rounded-full hover:bg-gray-700 transition"
          title="User"
        >
          <FaUser size={18} />
        </button>

        <button
          className="p-2 rounded-full hover:bg-gray-700 transition"
          title="Settings"
        >
          <RiSettings3Fill size={18} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
