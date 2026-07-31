import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

function CountUpText({ value = 0, duration = 1.5, className = '', format = (v) => Math.round(v) }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { stiffness: 120, damping: 25, duration });
  const [displayValue, setDisplayValue] = useState(format(0));

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(format(latest));
    });

    motionValue.set(value);
    return unsubscribe;
  }, [motionValue, springValue, value, format]);

  return <motion.span className={className}>{displayValue}</motion.span>;
}

export default CountUpText;
