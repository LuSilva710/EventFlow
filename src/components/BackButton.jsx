import React from 'react';
import { ChevronLeft } from 'lucide-react';

const BackButton = ({ onClick, text = "Voltar", className = "" }) => {
  return (
    <div style={{ marginTop: '48px', display: 'flex', alignItems: 'center' }} className={className}>
      <button 
        onClick={onClick} 
        style={{ 
          padding: '10px 20px', 
          borderRadius: '9999px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: 'rgba(255,255,255,0.7)', 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(255, 255, 255, 0.1)', 
          cursor: 'pointer', 
          textTransform: 'uppercase', 
          fontSize: '12px', 
          fontWeight: 'bold', 
          letterSpacing: '0.1em', 
          transition: 'all 0.3s', 
          width: 'fit-content' 
        }}
        onMouseEnter={(e) => { 
          e.currentTarget.style.color = 'white'; 
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; 
        }}
        onMouseLeave={(e) => { 
          e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; 
          e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; 
        }}
      >
        <ChevronLeft size={16} /> {text}
      </button>
    </div>
  );
};

export default BackButton;
