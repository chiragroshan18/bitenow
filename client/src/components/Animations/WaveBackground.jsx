import { motion } from 'framer-motion';

function WaveBackground() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-60 overflow-hidden -z-10">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent"
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]"
        animate={{ x: [0, -120, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 h-20 bg-[radial-gradient(circle,rgba(255,162,0,0.18),transparent_60%)]"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}

export default WaveBackground;
