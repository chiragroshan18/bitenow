import { motion } from 'framer-motion';

function SectionReveal({ children, className = '' }) {
  // Use mount animation instead of whileInView to avoid elements staying hidden
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default SectionReveal;
