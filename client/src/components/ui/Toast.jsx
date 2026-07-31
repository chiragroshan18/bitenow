import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { clearToast } from '@/store/slices/uiSlice';

const variants = {
  hidden: { opacity: 0, x: 50, y: 0 },
  visible: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 50, y: 0 },
};

function Toast() {
  const toast = useSelector((state) => state.ui.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => {
      dispatch(clearToast());
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [toast, dispatch]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="pointer-events-auto max-w-xl w-full rounded-2xl border border-white/10 bg-[#111111]/95 px-5 py-4 shadow-2xl shadow-black/40 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-3 w-3 rounded-full ${
                  toast.type === 'success'
                    ? 'bg-emerald-400'
                    : toast.type === 'error'
                    ? 'bg-rose-400'
                    : 'bg-orange-400'
                }`}
              />
              <p className="text-sm text-white/90">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Toast;
