import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Accessibility } from 'lucide-react';

const SeatPicker = ({ onConfirm, category }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [busy] = useState(new Set(['L2', 'A3', 'A4', 'B2', 'C6', 'R1', 'D5', 'D6', 'E1', 'E2', 'F9', 'F10', 'H4', 'H5', 'P2']));
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
    const isPCD = type === 'PCD';
    const isPulsing = pulsingSeats.has(id);

    return (
      <motion.button
        key={id}
        whileHover={!isBusy ? { scale: 1.2, zIndex: 10 } : {}}
        whileTap={!isBusy ? { scale: 0.9 } : {}}
        onClick={() => !isBusy && toggleSeat(id)}
        style={{
          width: isPCD ? '42px' : '32px',
          height: isPCD ? '42px' : '32px',
          borderRadius: isPCD ? '12px' : '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
          fontWeight: '800',
          transition: 'background 0.3s, border-color 0.3s, box-shadow 0.3s',
          cursor: isBusy ? 'not-allowed' : 'pointer',
          position: 'relative',
          background: isBusy ? 'rgba(239, 68, 68, 0.05)'
            : isSelected ? (isPCD ? '#06b6d4' : isVIP ? '#eab308' : '#6366f1')
            : (isPCD ? 'rgba(6, 182, 212, 0.05)' : isVIP ? 'rgba(234, 179, 8, 0.05)' : 'rgba(255,255,255,0.03)'),
          color: isBusy ? 'rgba(239, 68, 68, 0.5)'
            : isSelected ? (isPCD ? '#0a0b10' : isVIP ? '#1a1b23' : 'white')
            : (isPCD ? '#06b6d4' : isVIP ? '#eab308' : 'rgba(255,255,255,0.7)'),
          border: isBusy ? '1px solid rgba(239, 68, 68, 0.2)'
            : isSelected ? `1px solid ${isPCD ? '#06b6d4' : isVIP ? '#eab308' : '#6366f1'}`
            : `1px solid ${isPCD ? 'rgba(6, 182, 212, 0.3)' : isVIP ? 'rgba(234, 179, 8, 0.3)' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: isSelected ? `0 0 15px ${isPCD ? 'rgba(6, 182, 212, 0.4)' : isVIP ? 'rgba(234, 179, 8, 0.4)' : 'rgba(99, 102, 241, 0.4)'}` : 'none'
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
        ) : isPCD ? (
          <Accessibility size={16} />
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
              boxShadow: isPCD ? '0 0 15px #06b6d4' : isVIP ? '0 0 15px #eab308' : '0 0 15px #6366f1',
              border: `2px solid ${isPCD ? '#06b6d4' : isVIP ? '#eab308' : '#6366f1'}`,
              zIndex: 5
            }}
          />
        )}
      </motion.button>
    );
  };

  return (
    <div className="w-full flex flex-col gap-8">

      {/* SEAT MAP */}
      <div
        className="w-full bg-[#0d0e14] border border-white/5 flex flex-col items-center py-12 px-4"
        style={{ borderRadius: '32px' }}
      >
        <motion.div
          animate={{ scale: zoom }}
          className="flex flex-col items-center origin-top"
        >
          {/* STAGE DESIGN */}
          <div className="mb-24 flex flex-col items-center relative">
            <div 
              style={{ 
                position: 'absolute', top: '60px', width: '600px', height: '300px',
                background: 'radial-gradient(50% 50% at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 100%)',
                pointerEvents: 'none', zIndex: 0
              }} 
            />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-[580px] h-[1px] bg-white/20 mb-2" />
              <div className="relative">
                <div className="flex items-end">
                  <div 
                    className="w-16 h-20 bg-[#0a0b10] border-l border-b border-white/10"
                    style={{ clipPath: 'polygon(0% 20%, 100% 0%, 100% 100%, 0% 100%)', marginRight: '-1px' }}
                  />
                  <div 
                    className="relative flex items-center justify-center"
                    style={{
                      width: '400px', height: '100px', backgroundColor: '#0a0b10',
                      borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
                      borderTop: '4px solid #6366f1',
                      clipPath: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)',
                    }}
                  >
                    <span className="text-[12px] font-black tracking-[1.2em] text-white/60 uppercase pl-[1.2em]">
                      Palco
                    </span>
                  </div>
                  <div 
                    className="w-16 h-20 bg-[#0a0b10] border-r border-b border-white/10"
                    style={{ clipPath: 'polygon(0% 0%, 100% 20%, 100% 100%, 0% 100%)', marginLeft: '-1px' }}
                  />
                </div>
              </div>
              <div className="w-[480px] h-[6px] bg-white/5 rounded-b-full blur-[1px]" style={{ marginTop: '-2px' }} />
              <div className="flex gap-16 mt-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40 shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
                ))}
              </div>
            </div>
          </div>

          {/* SEATS GRID */}
          <div className="flex flex-col gap-12">
            {/* SEÇÃO VIP - Aparece apenas se o ingresso for VIP ou Premium */}
            {(category?.id === 'vip' || category?.id === 'premium') && (
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
            )}

            {/* SEÇÃO PISTA - Aparece apenas se o ingresso for Normal (Pista) */}
            {category?.id === 'normal' && (
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
            )}

            {/* PCD / ACESSIBILIDADE — always visible */}
            <div className="flex flex-col items-center gap-4 p-8 rounded-[40px] border border-cyan-500/10 bg-cyan-500/5 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Accessibility size={14} style={{ color: '#06b6d4' }} />
                <span className="text-[10px] font-black tracking-[0.3em] text-cyan-500/50 uppercase">Acessibilidade PCD</span>
              </div>
              <div className="flex gap-3">
                {['P1', 'P2', 'P3', 'P4', 'P5', 'P6'].map(id => renderSeat(id, 'PCD'))}
              </div>
              <span className="text-[9px] text-cyan-500/40 font-medium text-center" style={{ maxWidth: '300px' }}>
                Espaços reservados para pessoas com deficiência e acompanhante.
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* LEGEND */}
      <div className="p-6 md:p-8 bg-[#0d0e14] border border-white/5 flex justify-center" style={{ borderRadius: '24px' }}>
        <div className="flex flex-wrap justify-center items-stretch gap-4" style={{ columnGap: '2rem' }}>
          {/* Coluna 1 — Tipos */}
          <div className="flex flex-col gap-4">
            {category?.id === 'normal' && (
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0" style={{
                  width: '24px', height: '24px', borderRadius: '6px', 
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)',
                  fontSize: '9px', fontWeight: '800'
                }}>1</div>
                <span className="text-white text-[11px] font-bold whitespace-nowrap">Disponível <span className="text-white/20 font-medium ml-1">— Pista Geral</span></span>
              </div>
            )}
            {(category?.id === 'vip' || category?.id === 'premium') && (
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0" style={{
                  width: '24px', height: '24px', borderRadius: '6px', 
                  background: 'rgba(234, 179, 8, 0.05)', border: '1px solid rgba(234, 179, 8, 0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308',
                  fontSize: '9px', fontWeight: '800'
                }}>1</div>
                <span className="text-yellow-500 text-[11px] font-bold whitespace-nowrap">VIP <span className="text-white/20 font-medium ml-1">— Área Premium</span></span>
              </div>
            )}
          </div>

          <div className="w-[1px] bg-white/10" />

          {/* Coluna 2 — Estado */}
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

          <div className="w-[1px] bg-white/10" />

          {/* Coluna 3 — Acessibilidade */}
          <div className="flex flex-col gap-4 justify-center">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0" style={{
                width: '24px', height: '24px', borderRadius: '6px', 
                background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4'
              }}><Accessibility size={12} /></div>
              <span style={{ color: '#06b6d4' }} className="text-[11px] font-bold whitespace-nowrap">PCD <span className="text-white/20 font-medium ml-1">— Acessibilidade</span></span>
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
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: '280px',
              zIndex: 50,
            }}
          >
            <div
              style={{
                background: 'rgba(10, 11, 16, 0.95)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '20px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                padding: '25px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div>
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">Assentos</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSeats.map(id => (
                    <span key={id} className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded border border-primary/30 font-black">{id}</span>
                  ))}
                </div>
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-tighter">Total</span>
                <span className="text-lg font-black text-white">R$ {selectedSeats.length * category.price}</span>
              </div>
              <button 
                onClick={() => onConfirm(selectedSeats)}
                className="gradient-bg rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 shadow-lg shadow-primary/30"
                style={{ color: 'white', padding: '12px', width: '100%' }}
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
