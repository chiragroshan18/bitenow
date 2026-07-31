import { motion } from 'framer-motion';

function FallingText({ text, className = '' }) {
  return (
    <div className={`inline-flex flex-wrap gap-0 ${className}`}>
      {Array.from(text).map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          initial={{ opacity: 0, y: -30, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.45, delay: index * 0.03, ease: 'easeOut' }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </div>
  );
}

export default FallingText;
