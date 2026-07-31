import { motion } from 'framer-motion';

function RotatingText({ words = [], className = '' }) {
  return (
    <motion.div
      className={`relative inline-flex h-16 w-16 items-center justify-center ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
    >
      {words.map((word, index) => (
        <span
          key={word}
          className="absolute text-[11px] text-white/80 uppercase tracking-[0.24em]"
          style={{ transform: `rotate(${index * (360 / words.length)}deg) translate(0, -32px)` }}
        >
          {word}
        </span>
      ))}
    </motion.div>
  );
}

export default RotatingText;
