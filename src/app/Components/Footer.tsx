'use client';

import React from "react";
import { Facebook, Instagram, Linkedin, MessagesSquare, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Section 1 */}
      <div className="footer-section1">

        <p>ThemNotes</p>
        
        <div className="social-icons">
          <Facebook />
          <Twitter />
          <Instagram />
          <Linkedin />
          <MessagesSquare />
        </div>
      </div>

      {/* Section 2 */}
      <div className="footer-section2">

        <div className="footer-list">
          <p className="footer-title">Resources</p>
          <p>News</p>
          <p>Help & Learning</p>
          <p>Careers</p>
          <p>Contact Us</p>
          <p>Developers</p>
          <p>Forum</p>
        </div>

        <div className="footer-list">
          <p className="footer-title">Solution</p>
          <p>Why ThemNotes</p>
          <p>Note Taking</p>
          <p>Productivity</p>
          <p>Teams</p>
          <p>Students</p>
        </div>

        <div className="footer-list">
          <p className="footer-title">Get Started</p>
          <p>Login</p>
          <p>Sign up for free</p>
          <p>Download</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
