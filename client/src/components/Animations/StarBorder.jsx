import { motion } from 'framer-motion';

function StarBorder({ children, className = '', onClick }) {
  return (
    <motion.button
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 opacity-0 hover:opacity-100 transition-opacity duration-300 blur-md" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

export default StarBorder;