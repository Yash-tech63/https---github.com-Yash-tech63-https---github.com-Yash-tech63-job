import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#C6A15B] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#C6A15B] shrink-0" />,
    error: <XCircle className="w-5 h-5 text-[#202124] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#C6A15B] shrink-0" />
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-[#E9E6DF] bg-[#FFFFFF] shadow-2xl text-[#202124] text-sm max-w-md"
      >
        {icons[type] || icons.info}
        <p className="flex-1 font-medium text-xs leading-relaxed">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[#666666] hover:text-[#202124] p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Toast;
