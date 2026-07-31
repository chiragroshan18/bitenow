import { motion } from 'framer-motion';

function GridMotion() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 opacity-20">
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[length:40px_40px]"
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

export default GridMotion;
