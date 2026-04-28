import React from 'react';
import { motion } from 'framer-motion';

const PrimaryButton = ({ 
  children, 
  onClick, 
  icon: Icon, 
  className = '', 
  variant = 'primary',
  fullWidth = false,
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center gap-3 rounded-full font-black uppercase tracking-widest transition-all duration-300 transition-transform shadow-xl hover:scale-105 active:scale-95";
  
  const variants = {
    primary: "gradient-bg text-white shadow-primary/30",
    secondary: "bg-white/5 text-white border border-white/10 hover:bg-white/10",
    outline: "bg-transparent text-primary border border-primary/30 hover:bg-primary/5"
  };

  const widthStyle = fullWidth ? "w-full" : "px-16";
  const sizeStyle = "p-4 text-sm";

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${sizeStyle} ${className}`}
      {...props}
    >
      {children}
      {Icon && <Icon size={20} />}
    </motion.button>
  );
};

export default PrimaryButton;
