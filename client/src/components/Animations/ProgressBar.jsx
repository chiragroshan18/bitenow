import { motion, useScroll } from 'framer-motion';

function ProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 h-1 bg-transparent">
      <motion.div
        style={{ scaleX: scrollYProgress }}
        className="origin-left h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-300 shadow-xl shadow-orange-500/20"
      />
    </div>
  );
}

export default ProgressBar;
