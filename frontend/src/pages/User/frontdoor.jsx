import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FrontDoor() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  function goLogin() {
    navigate("/user/login");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#E8E3D6" }}>
      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-6 relative z-50">
        
        {/* LOGO */}
        <div className="flex items-center space-x-3 cursor-pointer">
          <div className="relative w-16 h-16"></div>
          <div>
            <h1 className="text-2xl font-serif text-amber-700 tracking-wide">AUREVRA</h1>
            <p className="text-xs tracking-widest text-amber-700">JEWELRY</p>
          </div>
        </div>

        {/* NAV */}
        <nav className="hidden md:flex items-center space-x-8">
          <button onClick={goLogin} className="text-gray-800 hover:text-amber-700 font-medium">SHOP</button>
          <button onClick={goLogin} className="text-gray-800 hover:text-amber-700 font-medium">ABOUT US</button>
          <button onClick={goLogin} className="text-gray-800 hover:text-amber-700 font-medium">COLLECTIONS</button>
          <button onClick={goLogin} className="text-gray-800 hover:text-amber-700 font-medium">CONTACTS</button>
        </nav>

        {/* ICONS */}
        <div className="flex items-center space-x-4">
          <button onClick={goLogin}>🔍</button>
          <button onClick={goLogin}>🛒</button>
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "✖️" : "☰"}
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-24 left-0 right-0 bg-white px-8 py-6">
          <nav className="flex flex-col space-y-4">
            <button onClick={goLogin} className="py-2">SHOP</button>
            <button onClick={goLogin} className="py-2">ABOUT US</button>
            <button onClick={goLogin} className="py-2">COLLECTIONS</button>
            <button onClick={goLogin} className="py-2">CONTACTS</button>
          </nav>
        </div>
      )}

      {/* HERO */}
      <div className="text-center mt-20">
        <h2 className="text-5xl font-serif text-gray-900">DISCOVER TIMELESS ELEGANCE</h2>
        <button
          className="mt-8 px-6 py-3 bg-amber-700 text-white rounded-full"
          onClick={goLogin}
        >
          SHOP NOW
        </button>
      </div>
    </div>
  );
}
