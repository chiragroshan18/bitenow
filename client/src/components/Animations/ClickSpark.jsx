import { motion } from 'framer-motion';
import { useState } from 'react';

function ClickSpark({ children }) {
  const [sparks, setSparks] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    const newSpark = { id, x, y };
    setSparks((prev) => [...prev, newSpark]);

    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== id));
    }, 800);
  };

  return (
    <div className="relative w-full" onClick={handleClick}>
      {children}
      {sparks.map((spark) => (
        <motion.div
          key={spark.id}
          initial={{ scale: 0, opacity: 1, x: spark.x, y: spark.y }}
          animate={{ scale: 2, opacity: 0, x: spark.x - 50, y: spark.y - 50 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute w-2 h-2 bg-orange-400 rounded-full pointer-events-none"
          style={{ left: spark.x, top: spark.y }}
        />
      ))}
    </div>
  );
}

export default ClickSpark;