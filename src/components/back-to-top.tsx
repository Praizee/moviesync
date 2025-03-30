"use client";

import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const scrollThreshold = 300; // Adjust this value based on when you want the button to appear 😏

    setIsVisible(scrollY > scrollThreshold);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      className={`fixed z-50 bottom-6 right-6 bg-primary hover:bg-primary/80 duration-300 transition-colors p-3 rounded-full cursor-pointer ${
        isVisible ? "opacity-100" : "opacity-0"
      } transition-opacity ease-in-out duration-300`}
      onClick={scrollToTop}
      aria-label="Scroll to Top"
    >
      <ChevronUp className="text-white size-6" />
    </button>
  );
};

export default BackToTopButton;

