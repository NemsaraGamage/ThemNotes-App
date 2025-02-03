'use client'
import NavBarComp from "./Components/NavBar";
import { motion } from 'framer-motion';
import { useState, useEffect } from "react";

export default function Home() {
  const text = "ThemNotes";
  const [displayedText, setDisplayedText] = useState("");
  const [showContent3, setShowContent3] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayedText(""); 

    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1)); 
      i++;

      if (i === text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setShowContent3(true);
          setTimeout(() => setShowButton(true), 500); // Show button 0.5s after Content 3
        }, 500); 
      }
    }, 100); // Typing speed

    return () => clearInterval(interval);
  }, []);

  return (
    <>

    {/* Navbar */}
    <NavBarComp />

    {/* Introduction content */}
    <div className="notepad-background">
      <div className="content1">
        <p>WELCOME TO</p>
      </div>

      <div className="content2">
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.5 }}
        >
          {displayedText}
        </motion.p>
      </div>

      {showContent3 && (
        <motion.div 
          className="content3"
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          - All your thoughts and notes at one place -
        </motion.div>
      )}

      {showButton && (
        <motion.button 
          className="cta-button"
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          Get Started
        </motion.button>
      )}
    </div>

    <div>

      

    </div>

    </>
  );
}
