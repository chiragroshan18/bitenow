import { motion } from 'framer-motion';
import { useState } from 'react';

function GlitchReveal({ children, className = '' }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      className={`inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        x: isHovered ? [0, -2, 2, -1, 1, 0] : 0,
        skewX: isHovered ? [0, 2, -2, 1, -1, 0] : 0,
      }}
      transition={{ duration: 0.3, repeat: isHovered ? 1 : 0 }}
    >
      {children}
    </motion.span>
  );
}

export default GlitchReveal;