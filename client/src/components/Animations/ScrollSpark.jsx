import { motion } from 'framer-motion';

function ScrollSpark({ className = '' }) {
  return (
    <motion.div
      className={`pointer-events-none absolute left-1/2 top-0 h-16 w-16 -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-300/40 to-orange-500/20 blur-2xl ${className}`}
      animate={{ y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default ScrollSpark;
