import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

function CursorEffects() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const trailX = useSpring(mouseX, { stiffness: 120, damping: 25 });
  const trailY = useSpring(mouseY, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const handleMove = (event) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    window.addEventListener('mousemove', handleMove);

    return () => {
      window.removeEventListener('mousemove', handleMove);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 h-5 w-5 rounded-full bg-orange-400/90 shadow-[0_0_30px_rgba(245,130,13,0.5)] blur-sm"
        style={{ x: trailX, y: trailY, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 h-10 w-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl"
        animate={{ x: mouseX, y: mouseY }}
        style={{ translateX: '-50%', translateY: '-50%' }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
      />
    </>
  );
}

export default CursorEffects;
