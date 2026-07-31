import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

function BlobCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const blobX = useSpring(mouseX, { stiffness: 150, damping: 30 });
  const blobY = useSpring(mouseY, { stiffness: 150, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 h-24 w-24 rounded-full bg-white/5 blur-2xl mix-blend-screen"
      style={{ x: blobX, y: blobY, translateX: '-50%', translateY: '-50%' }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

export default BlobCursor;
