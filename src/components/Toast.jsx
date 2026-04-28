import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ toast, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  const icons = {
    success: <CheckCircle className="text-success" size={20} />,
    error: <XCircle className="text-red-500" size={20} />,
    info: <Info className="text-primary" size={20} />
  };

  const bgColors = {
    success: 'border-success/20 bg-success/5',
    error: 'border-red-500/20 bg-red-500/5',
    info: 'border-primary/20 bg-primary/5'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.8, transition: { duration: 0.2 } }}
      layout
      className={`pointer-events-auto flex items-center gap-4 min-w-[300px] p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${bgColors[toast.type] || bgColors.info}`}
    >
      <div className="flex-shrink-0">
        {icons[toast.type] || icons.info}
      </div>
      
      <div className="flex-grow">
        <p className="text-sm font-bold text-white">{toast.message}</p>
        {toast.description && (
          <p className="text-xs text-white/40 mt-0.5">{toast.description}</p>
        )}
      </div>

      <button 
        onClick={onRemove}
        className="text-white/20 hover:text-white transition-colors"
      >
        <X size={16} />
      </button>

      {/* Progress bar */}
      <motion.div 
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 4, ease: "linear" }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 origin-left"
      />
    </motion.div>
  );
};

export default Toast;
