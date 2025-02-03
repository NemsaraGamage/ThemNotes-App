'use client';

import React, { useState } from 'react';
import '../globals.css'; 

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <a href="">ThemNotes</a>
        </div>
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><a href="">Home</a></li>
            <li><a href="/about">Files</a></li>
            <li><a href="/features">Notes</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>
        <div className="burger" onClick={toggleMobileMenu}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
