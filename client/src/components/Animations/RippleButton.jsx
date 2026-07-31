import { motion } from 'framer-motion';

function RippleButton({ children, className = '', ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      className={`ripple-button relative overflow-hidden ${className}`}
      {...props}
    >
      {children}
      <span className="ripple absolute inset-0 rounded-full bg-white/10 opacity-0" />
    </motion.button>
  );
}

export default RippleButton;
