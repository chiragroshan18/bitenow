import { motion } from 'framer-motion';
import WaveBackground from '@/components/Animations/WaveBackground';
import GridMotion from '@/components/Animations/GridMotion';

function Aurora({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a0e00] via-[#0d0d0d] to-[#0d0d0d]">
        <motion.div
          className="absolute top-0 left-0 w-full h-full"
          animate={{
            background: [
              'radial-gradient(ellipse at 20% 50%, rgba(255, 100, 0, 0.15) 0%, transparent 50%)',
              'radial-gradient(ellipse at 80% 50%, rgba(255, 100, 0, 0.2) 0%, transparent 50%)',
              'radial-gradient(ellipse at 50% 80%, rgba(255, 100, 0, 0.1) 0%, transparent 50%)',
              'radial-gradient(ellipse at 20% 50%, rgba(255, 100, 0, 0.15) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-full h-full"
          animate={{
            background: [
              'radial-gradient(ellipse at 80% 80%, rgba(200, 80, 0, 0.1) 0%, transparent 40%)',
              'radial-gradient(ellipse at 20% 20%, rgba(200, 80, 0, 0.15) 0%, transparent 40%)',
              'radial-gradient(ellipse at 80% 80%, rgba(200, 80, 0, 0.1) 0%, transparent 40%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <WaveBackground />
        <GridMotion />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default Aurora;