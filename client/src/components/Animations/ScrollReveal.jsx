import { motion } from 'framer-motion';

function ScrollReveal({ children, className = '' }) {
  // Avoid IntersectionObserver dependency for critical UI visibility.
  // Use a simple mount animation so elements are visible immediately.
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;