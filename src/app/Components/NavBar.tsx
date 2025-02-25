'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
          <Link href="/">ThemNotes</Link>
        </div>
        <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul>
            <li><Link href="/File">Files</Link></li>
            <li><Link href="/CreateNotes">Create Notes</Link></li> 
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/LoginPage">Login</Link></li>
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
