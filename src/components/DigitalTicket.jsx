import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import {
  Calendar, MapPin, Clock, Ticket, Share2, Download,
  Info, ShieldCheck, X, User
} from 'lucide-react';

const CATEGORY_LABEL = {
  normal: 'Pista',
  vip: 'Área VIP',
  premium: 'Premium (Open Bar)'
};

const DigitalTicket = ({ ticket, event, onClose, holderName }) => {
  const closeBtnRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!ticket || !event) return undefined;

    const previouslyFocused = document.activeElement;
    closeBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose?.();
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
    };
  }, [ticket, event, onClose]);

  if (!ticket || !event) return null;

  const isPast = new Date(event.date) < new Date();
  const categoryLabel = CATEGORY_LABEL[ticket.category] || ticket.category;

  const handleShare = async () => {
    const text = `Ingresso para ${event.title} em ${new Date(event.date).toLocaleDateString('pt-BR')}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, text });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${text} — Código ${ticket.id}`);
      }
    } catch {
      /* usuário cancelou ou navegador sem suporte; falha silenciosa intencional */
    }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-title"
      aria-describedby="ticket-description"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto"
    >
      <button
        type="button"
        aria-label="Fechar ingresso digital"
        onClick={onClose}
        className="absolute inset-0 cursor-default focus-visible:outline-none"
        tabIndex={-1}
      />

      <motion.div
        ref={dialogRef}
        initial={{ y: 50, opacity: 0, scale: 0.92 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}
        className="relative w-full max-w-[400px] flex flex-col pointer-events-auto my-8"
      >
        <div className="flex justify-between items-center px-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-bg flex-center shadow-lg shadow-primary/30">
              <Ticket size={18} className="text-white" aria-hidden="true" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black tracking-tighter text-base uppercase text-white">EventFlow</span>
              <span className="text-[9px] font-bold text-white/50 uppercase tracking-[0.25em]">
                Ingresso Digital
              </span>
            </div>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            type="button"
            aria-label="Fechar"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex-center text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <article
          aria-label={`Ingresso para ${event.title}`}
          className="relative overflow-hidden rounded-[32px] shadow-2xl border border-white/10 bg-[#1c1c1e]"
        >
          <header className="relative h-44 overflow-hidden">
            <img src={event.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] via-[#1c1c1e]/40 to-black/20" />
            <div className="absolute top-4 left-4 right-4 flex justify-between">
              <span className="text-[10px] uppercase font-black bg-primary/90 text-white px-2.5 py-1 rounded-full tracking-widest backdrop-blur-md">
                {categoryLabel}
              </span>
              {isPast ? (
                <span className="text-[10px] uppercase font-black bg-white/15 text-white/90 px-2.5 py-1 rounded-full tracking-widest backdrop-blur-md">
                  Realizado
                </span>
              ) : (
                <span
                  className="text-[10px] uppercase font-black bg-success/90 text-white px-2.5 py-1 rounded-full tracking-widest backdrop-blur-md inline-flex items-center gap-1"
                  aria-label="Ingresso válido"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" aria-hidden="true" />
                  Válido
                </span>
              )}
            </div>
            <div className="absolute bottom-4 left-6 right-6">
              <span className="text-[10px] uppercase font-black text-white/80 tracking-[0.2em] block mb-1">
                Passaporte Digital
              </span>
              <h2 id="ticket-title" className="text-2xl font-black text-white leading-tight drop-shadow-lg">
                {event.title}
              </h2>
            </div>
          </header>

          <div className="px-6 py-6">
            <dl className="grid grid-cols-2 gap-y-5">
              <div>
                <dt className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Data</dt>
                <dd className="flex items-center gap-2">
                  <Calendar size={14} className="text-primary" aria-hidden="true" />
                  <span className="font-bold text-white text-sm">
                    {new Date(event.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Horário</dt>
                <dd className="flex items-center gap-2">
                  <Clock size={14} className="text-primary" aria-hidden="true" />
                  <span className="font-bold text-white text-sm">
                    {new Date(event.date).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">Local</dt>
                <dd className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary shrink-0" aria-hidden="true" />
                  <span className="font-bold text-white text-sm">{event.location}</span>
                </dd>
              </div>
              {holderName && (
                <div className="col-span-2">
                  <dt className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest mb-1">
                    Titular
                  </dt>
                  <dd className="flex items-center gap-2">
                    <User size={14} className="text-primary" aria-hidden="true" />
                    <span className="font-bold text-white text-sm truncate">{holderName}</span>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="flex items-center h-10 relative overflow-visible" aria-hidden="true">
            <div className="absolute left-[-12px] w-6 h-6 bg-black/90 rounded-full border border-white/5" />
            <div className="absolute right-[-12px] w-6 h-6 bg-black/90 rounded-full border border-white/5" />
            <div className="w-full border-t-2 border-dashed border-white/10 mx-6" />
          </div>

          <div className="px-6 pb-8 pt-2">
            <div className="flex justify-between items-end mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block mb-1">
                  Setor
                </span>
                <p className="font-black text-primary text-sm uppercase">{categoryLabel}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest block mb-1">
                  Assento
                </span>
                <p className="font-black text-white text-sm uppercase">
                  {ticket.seats?.length ? ticket.seats.join(', ') : 'Pista livre'}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div
                className="bg-white p-3 rounded-2xl shadow-[0_0_50px_rgba(99,102,241,0.2)]"
                role="img"
                aria-label={`QR Code do ingresso ${ticket.id}`}
              >
                <QRCodeSVG
                  value={`EVENTFLOW-${ticket.id}`}
                  size={160}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p
                  id="ticket-description"
                  className="text-[10px] font-mono text-zinc-400 tracking-[0.4em] uppercase"
                >
                  {ticket.id}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-300">
                  <ShieldCheck size={12} className="text-success" aria-hidden="true" />
                  <span>Ingresso verificado e criptografado</span>
                </div>
              </div>
            </div>
          </div>
        </article>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleShare}
            className="flex-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-3.5 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Share2 size={18} className="text-zinc-300 group-hover:text-white" aria-hidden="true" />
            <span className="font-bold text-sm text-zinc-200 group-hover:text-white">Compartilhar</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl py-3.5 transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Download size={18} className="text-zinc-300 group-hover:text-white" aria-hidden="true" />
            <span className="font-bold text-sm text-zinc-200 group-hover:text-white">Salvar PDF</span>
          </button>
        </div>

        <div
          role="note"
          className="mt-5 flex items-center justify-center gap-2 text-zinc-400 text-xs px-4 text-center"
        >
          <Info size={14} className="shrink-0" aria-hidden="true" />
          <span>Apresente este QR Code na entrada do evento. Pressione Esc para fechar.</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DigitalTicket;
