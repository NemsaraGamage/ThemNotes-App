'use client'
import NavBarComp from "./Components/NavBar";
import { motion, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const text = "ThemNotes";
  const [displayedText, setDisplayedText] = useState("");
  const [showContent3, setShowContent3] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showContent4, setShowContent4] = useState(false);

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
          setTimeout(() => {
            setShowButton(true);
            setTimeout(() => setShowContent4(true), 500); // Show content4 0.5s after button
          }, 500); // Show button 0.5s after Content 3
        }, 500); 
      }
    }, 100); // Typing speed

    return () => clearInterval(interval);
  }, []);

  const scrollRef = useRef(null);
  const isInView = useInView(scrollRef, { once: true });

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
            suppressHydrationWarning
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
            suppressHydrationWarning
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
            suppressHydrationWarning
          >
            Get Started
          </motion.button>
        )}

        {showContent4 && (
          <motion.div 
            className="content4"
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            suppressHydrationWarning
          >
            Already have an account? Log in
          </motion.div>
        )}

      </div>

      {/* Scroll Animation Section */}
      <div className="scroll-section-background" ref={scrollRef}>

        <motion.div        
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          suppressHydrationWarning
        >

          <div className="scroll-content">
            <p>One and only stop for your creativity</p>

            <div>
              <p>Organize your thoughts, create categories, 
              and make your note-taking experience seamless by having it all at one place.</p>
            </div>

            {showButton && (
              <motion.button 
                className="get-started-button"
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, ease: "easeOut" }}
                suppressHydrationWarning
              >
                See More
              </motion.button>
            )}
          </div>
          
        </motion.div>

      </div>
    </>
  );
}
