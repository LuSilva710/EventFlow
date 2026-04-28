import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock } from 'lucide-react';

const SeatPicker = ({ onConfirm, category }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [busy] = useState(new Set(['L2', 'A3', 'A4', 'B2', 'C6', 'R1', 'D5', 'D6', 'E1', 'E2', 'F9', 'F10', 'H4', 'H5']));
  const [zoom, setZoom] = useState(1);
  const [pulsingSeats, setPulsingSeats] = useState(new Set());

  // Simulação de atividade em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      const busyArray = Array.from(busy);
      const randomCount = Math.floor(Math.random() * 3) + 1;
      const newPulsing = new Set();
      for(let i=0; i<randomCount; i++) {
        newPulsing.add(busyArray[Math.floor(Math.random() * busyArray.length)]);
      }
      setPulsingSeats(newPulsing);
    }, 3000);
    return () => clearInterval(interval);
  }, [busy]);

  const toggleSeat = (id) => {
    if (busy.has(id)) return;
    if (selectedSeats.includes(id)) {
      setSelectedSeats(selectedSeats.filter(s => s !== id));
    } else {
      setSelectedSeats([...selectedSeats, id]);
    }
  };

  const renderSeat = (id, type = 'Pista') => {
    const isBusy = busy.has(id);
    const isSelected = selectedSeats.includes(id);
    const isVIP = type === 'VIP';
    const isPulsing = pulsingSeats.has(id);

    return (
      <motion.button
        key={id}
        whileHover={!isBusy ? { scale: 1.2, zIndex: 10 } : {}}
        whileTap={!isBusy ? { scale: 0.9 } : {}}
        onClick={() => !isBusy && toggleSeat(id)}
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: '800',
          transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
          cursor: isBusy ? 'not-allowed' : 'pointer',
          position: 'relative',
          background: isBusy ? 'rgba(239, 68, 68, 0.05)' : isSelected ? (isVIP ? '#eab308' : '#6366f1') : (isVIP ? 'rgba(234, 179, 8, 0.05)' : 'rgba(255,255,255,0.03)'),
          color: isBusy ? 'rgba(239, 68, 68, 0.5)' : isSelected ? (isVIP ? '#1a1b23' : 'white') : (isVIP ? '#eab308' : 'rgba(255,255,255,0.7)'),
          border: isBusy ? '1px solid rgba(239, 68, 68, 0.2)' : isSelected ? `1px solid ${isVIP ? '#eab308' : '#6366f1'}` : `1px solid ${isVIP ? 'rgba(234, 179, 8, 0.3)' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: isSelected ? `0 0 15px ${isVIP ? 'rgba(234, 179, 8, 0.4)' : 'rgba(99, 102, 241, 0.4)'}` : 'none'
        }}
      >
        {isBusy ? (
          <motion.div
            animate={isPulsing ? { 
              scale: [1, 1.2, 1],
              opacity: [0.4, 1, 0.4]
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ color: isPulsing ? '#ef4444' : 'inherit' }}
          >
            <Lock size={12} />
          </motion.div>
        ) : (
          id.replace(/[A-Z]/g, '')
        )}
        
        {/* Efeito de brilho pulsante para simular compra recente */}
        {isBusy && isPulsing && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 0.15, 0], scale: [0.8, 1.8, 2.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-red-500 rounded-lg pointer-events-none"
          />
        )}

        {isSelected && (
          <motion.div 
            layoutId={`glow-${id}`}
            className="absolute inset-0 rounded-lg"
            style={{ 
              boxShadow: isVIP ? '0 0 15px #eab308' : '0 0 15px #6366f1',
              border: `2px solid ${isVIP ? '#eab308' : '#6366f1'}`,
              zIndex: 5
            }}
          />
        )}
      </motion.button>
    );
  };

  return (
    <div className="relative w-full h-[650px] bg-[#0d0e14] rounded-[32px] border border-white/5 overflow-hidden">
      
      {/* SEAT MAP CONTAINER - FIXED POSITION, NO DRAG */}
      <div className="absolute inset-0 overflow-auto flex justify-center pt-32 pb-96">
        <motion.div
          animate={{ scale: zoom }}
          className="flex flex-col items-center origin-top h-fit"
        >
          {/* STAGE DESIGN (SYMPLA STYLE) */}
          <div className="mb-24 flex flex-col items-center relative">
            {/* Projection / Glow into the audience */}
            <div 
              style={{ 
                position: 'absolute',
                top: '60px',
                width: '600px',
                height: '300px',
                background: 'radial-gradient(50% 50% at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 100%)',
                pointerEvents: 'none',
                zIndex: 0
              }} 
            />

            {/* The Stage Structure */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Proscenium Line (Technical boundary) */}
              <div className="w-[580px] h-[1px] bg-white/20 mb-2" />
              
              <div className="relative">
                {/* Main Stage Body + Wings Unified */}
                <div className="flex items-end">
                  {/* Left Wing */}
                  <div 
                    className="w-16 h-20 bg-[#0a0b10] border-l border-b border-white/10"
                    style={{ 
                      clipPath: 'polygon(0% 20%, 100% 0%, 100% 100%, 0% 100%)',
                      marginRight: '-1px' // Remove gap
                    }}
                  />

                  {/* Center Stage (Trapezoid) */}
                  <div 
                    className="relative flex items-center justify-center"
                    style={{
                      width: '400px',
                      height: '100px',
                      backgroundColor: '#0a0b10',
                      borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                      borderTop: '4px solid #6366f1',
                      clipPath: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)',
                    }}
                  >
                    <span className="text-[12px] font-black tracking-[1.2em] text-white/60 uppercase pl-[1.2em]">
                      Palco
                    </span>
                  </div>

                  {/* Right Wing */}
                  <div 
                    className="w-16 h-20 bg-[#0a0b10] border-r border-b border-white/10"
                    style={{ 
                      clipPath: 'polygon(0% 0%, 100% 20%, 100% 100%, 0% 100%)',
                      marginLeft: '-1px' // Remove gap
                    }}
                  />
                </div>
              </div>
              
              {/* Stage Depth Glow / Foundation */}
              <div 
                className="w-[480px] h-[6px] bg-white/5 rounded-b-full blur-[1px]" 
                style={{ marginTop: '-2px' }}
              />

              {/* Stage Lights / Projectors */}
              <div className="flex gap-16 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
                ))}
              </div>
            </div>
          </div>

          {/* SEATS GRID */}
          <div className="flex flex-col gap-12">
            {/* VIP SECTION */}
            <div className="flex flex-col items-center gap-4 p-8 rounded-[40px] border border-yellow-500/10 bg-yellow-500/5 backdrop-blur-sm">
              <span className="text-[10px] font-black tracking-[0.3em] text-yellow-500/50 uppercase mb-2">Setor Premium VIP</span>
              <div className="flex gap-4">
                 <div className="flex flex-col gap-3">
                    {['L1', 'L2', 'L3'].map(id => renderSeat(id, 'VIP'))}
                 </div>
                 <div className="flex flex-col gap-3 justify-center">
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5, 6].map(col => renderSeat(`A${col}`, 'VIP'))}
                    </div>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5, 6].map(col => renderSeat(`B${col}`, 'VIP'))}
                    </div>
                 </div>
                 <div className="flex flex-col gap-3">
                    {['R1', 'R2', 'R3'].map(id => renderSeat(id, 'VIP'))}
                 </div>
              </div>
            </div>

            {/* GENERAL SECTION */}
            <div className="flex flex-col items-center gap-4 p-8 rounded-[40px] border border-white/5 bg-white/[0.02]">
              <span className="text-[10px] font-black tracking-[0.3em] text-white/20 uppercase mb-2">Pista Geral</span>
              <div className="flex flex-col gap-3">
                {['C', 'D', 'E', 'F'].map(row => (
                  <div key={row} className="flex gap-3 items-center">
                    <span className="w-4 text-[10px] font-bold text-white/20">{row}</span>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(col => renderSeat(`${row}${col}`, 'Pista'))}
                    <span className="w-4 text-[10px] font-bold text-white/20">{row}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>


      {/* LEGEND */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-8 border-t border-white/10 bg-black/80 backdrop-blur-md flex justify-center">
        <div className="flex gap-4 md:gap-x-[280px]">
          
          {/* Coluna 1 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0" style={{
                width: '24px', height: '24px', borderRadius: '6px', 
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)',
                fontSize: '9px', fontWeight: '800'
              }}>1</div>
              <span className="text-white text-[11px] font-bold whitespace-nowrap">Disponível <span className="text-white/20 font-medium ml-1">— Pista Geral</span></span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0" style={{
                width: '24px', height: '24px', borderRadius: '6px', 
                background: 'rgba(234, 179, 8, 0.05)', border: '1px solid rgba(234, 179, 8, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308',
                fontSize: '9px', fontWeight: '800'
              }}>1</div>
              <span className="text-yellow-500 text-[11px] font-bold whitespace-nowrap">VIP <span className="text-white/20 font-medium ml-1">— Área Premium</span></span>
            </div>
          </div>

          {/* Divisor Vertical */}
          <div className="w-[1px] bg-white/10" />

          {/* Coluna 2 */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0" style={{
                width: '24px', height: '24px', borderRadius: '6px', 
                background: '#6366f1', border: '1px solid #6366f1',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                fontSize: '9px', fontWeight: '800', boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
              }}>1</div>
              <span className="text-[#818cf8] text-[11px] font-bold whitespace-nowrap">Sua Escolha <span className="text-white/20 font-medium ml-1">— Selecionado</span></span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0" style={{
                width: '24px', height: '24px', borderRadius: '6px', 
                background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(239, 68, 68, 0.5)'
              }}><Lock size={10} /></div>
              <span className="text-red-500/80 text-[11px] font-bold whitespace-nowrap">Indisponível <span className="text-white/20 font-medium ml-1">— Ocupado</span></span>
            </div>
          </div>

        </div>
      </div>

      {/* FLOATING ACTION BAR */}
      <AnimatePresence>
        {selectedSeats.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-xl z-30"
          >
            <div className="glass p-4 border border-white/20 shadow-2xl flex items-center justify-between gap-6" style={{ background: 'rgba(10, 11, 16, 0.95)', backdropFilter: 'blur(16px)' }}>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">Lugares Selecionados</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSeats.map(id => (
                    <span key={id} className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded border border-primary/30 font-black">{id}</span>
                  ))}
                </div>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">Total Estimado</span>
                <span className="text-xl font-black text-white">R$ {selectedSeats.length * category.price}</span>
              </div>
              <button 
                onClick={() => onConfirm(selectedSeats)}
                className="gradient-bg px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 shadow-lg shadow-primary/30"
                style={{ color: 'white' }}
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SeatPicker;
