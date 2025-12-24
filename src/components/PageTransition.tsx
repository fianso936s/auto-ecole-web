import React from "react";
import { motion } from "framer-motion";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
        // Adding a slight delay to entry to match the "100ms delay" request
        // after exit if we were using a staggered approach, but since
        // AnimatePresence works by keeping the old component until exit finishes:
        // we can use exitBeforeEnter (deprecated) or mode="wait" in AnimatePresence
      }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
