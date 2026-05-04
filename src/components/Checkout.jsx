import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CreditCard, CheckCircle, ChevronRight, ShieldCheck, MapPin, QrCode, Copy, Check } from 'lucide-react';
import BackButton from './BackButton';
import PrimaryButton from './PrimaryButton';

const Checkout = ({ event, booking, onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'pix'
  const [pixCopied, setPixCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: 'João Silva',
    email: 'joao@email.com',
    cpf: '123.456.789-00',
    cardName: 'JOÃO SILVA',
    cardNumber: '4444 4444 4444 4444',
    expiry: '12/28',
    cvv: '123'
  });

  const PIX_KEY = '00020126580014br.gov.bcb.pix0136eventflow-2026@pix.com.br5204000053039865802BR';

  const handleCopyPix = async () => {
    try { await navigator.clipboard.writeText(PIX_KEY); } catch {}
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const steps = [
    { id: 1, label: 'Identificação', icon: User },
    { id: 2, label: 'Pagamento', icon: CreditCard },
    { id: 3, label: 'Confirmação', icon: CheckCircle }
  ];

  const totalPrice = booking.category.price * booking.seats.length;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-12 px-4">
      {steps.map((s, idx) => (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center" style={{ gap: '10px' }}>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
              step >= s.id ? 'gradient-bg text-white shadow-lg shadow-primary/30' : 'bg-white/5 text-white/20 border border-white/5'
            }`}>
              <s.icon size={20} />
            </div>
            <span className={`whitespace-nowrap text-[10px] font-black uppercase tracking-widest ${
              step >= s.id ? 'text-primary' : 'text-white/20'
            }`}>
              {s.label}
            </span>
          </div>
          {idx < steps.length - 1 && (
            <div className="w-24 md:w-56 h-[2px] mx-10 md:mx-16 bg-white/5 relative overflow-hidden">
              <motion.div 
                initial={{ x: '-100%' }}
                animate={{ x: step > s.id ? '0%' : '-100%' }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 gradient-bg"
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 px-8 md:px-20">
      <BackButton 
        onClick={step === 1 ? onBack : prevStep} 
        text="Voltar" 
        style={{ marginTop: 0, marginBottom: '32px' }} 
      />
      
      <div className="mb-20">
        {renderStepIndicator()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
        {/* FORM SIDE */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass p-10 space-y-8"
              >
                <div className="flex flex-col items-center text-center space-y-3 mb-4 px-10">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <User size={28} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">Identificação</h3>
                  <p className="text-white/40 text-sm max-w-xs">Informe seus dados para vincular os ingressos à sua conta.</p>
                </div>
                
                <div className="space-y-5 px-10">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block ml-0">Nome Completo</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/[0.03] border-white/10 rounded-full px-5 py-4 ml-0" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block ml-0">E-mail</label>
                      <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-white/[0.03] border-white/10 rounded-full px-5 py-4 ml-0" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-black tracking-widest text-white/40 block ml-0">CPF</label>
                      <input type="text" value={formData.cpf} onChange={e => setFormData({...formData, cpf: e.target.value})} className="w-full bg-white/[0.03] border-white/10 rounded-full px-5 py-4 ml-0" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass p-10 space-y-8"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <CreditCard size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Pagamento</h3>
                </div>

                {/* Tabs método */}
                <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '4px', marginBottom: '32px' }}>
                  {[
                    { key: 'card', label: 'Cartão de Crédito', icon: CreditCard },
                    { key: 'pix', label: 'PIX', icon: QrCode },
                  ].map(m => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setPaymentMethod(m.key)}
                      style={{
                        flex: 1, padding: '12px 16px', borderRadius: '12px', border: 'none',
                        background: paymentMethod === m.key ? 'linear-gradient(135deg, var(--primary), var(--secondary))' : 'transparent',
                        color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        fontSize: '13px', fontWeight: paymentMethod === m.key ? '700' : '500',
                        opacity: paymentMethod === m.key ? 1 : 0.5, transition: 'all 0.3s',
                      }}
                    >
                      <m.icon size={16} /> {m.label}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  {paymentMethod === 'card' && (
                    <motion.div key="card-form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Número do Cartão</label>
                        <input type="text" value={formData.cardNumber} onChange={e => setFormData({...formData, cardNumber: e.target.value})} className="w-full bg-white/[0.03] border-white/10 rounded-full px-6 py-4" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Nome no Cartão</label>
                        <input type="text" value={formData.cardName} onChange={e => setFormData({...formData, cardName: e.target.value})} className="w-full bg-white/[0.03] border-white/10 rounded-full px-6 py-4" />
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black tracking-widest text-white/40">Validade</label>
                          <input type="text" value={formData.expiry} onChange={e => setFormData({...formData, expiry: e.target.value})} placeholder="MM/AA" className="w-full bg-white/[0.03] border-white/10 rounded-full px-6 py-4" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-black tracking-widest text-white/40">CVV</label>
                          <input type="text" value={formData.cvv} onChange={e => setFormData({...formData, cvv: e.target.value})} placeholder="123" className="w-full bg-white/[0.03] border-white/10 rounded-full px-6 py-4" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === 'pix' && (
                    <motion.div key="pix-form" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-6">
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <div style={{ width: '160px', height: '160px', borderRadius: '16px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px' }}>
                          <QrCode size={120} color="#0a0b10" strokeWidth={1.5} />
                        </div>
                        <p className="text-xs text-text-muted text-center" style={{ maxWidth: '280px' }}>Escaneie o QR Code acima com o app do seu banco ou copie o código abaixo.</p>
                      </div>
                      <div className="pt-4">
                        <label className="text-[10px] uppercase font-black tracking-widest text-white/40" style={{ display: 'block', marginBottom: '8px' }}>Código PIX (Copia e Cola)</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input type="text" readOnly value={PIX_KEY} className="bg-white/[0.03] border-white/10 rounded-full px-6 py-4 text-xs font-mono" style={{ flex: 1, minWidth: 0 }} />
                          <button type="button" onClick={handleCopyPix} style={{ width: '52px', height: '52px', borderRadius: '9999px', background: pixCopied ? 'var(--success)' : 'linear-gradient(135deg, var(--primary), var(--secondary))', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.3s' }}>
                            {pixCopied ? <Check size={18} /> : <Copy size={18} />}
                          </button>
                        </div>
                      </div>
                      <div style={{ padding: '12px 16px', borderRadius: '12px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <QrCode size={16} className="text-success" style={{ flexShrink: 0 }} />
                        <span className="text-xs text-success" style={{ fontWeight: 600 }}>O pagamento via PIX é confirmado instantaneamente.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass p-10 space-y-10"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className="text-xl font-bold">Confirmação</h3>
                </div>

                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-8 px-2">
                    <div>
                      <h4 className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-3">Comprador</h4>
                      <p className="text-sm font-bold text-white">{formData.name}</p>
                      <p className="text-xs text-white/40 mt-1">{formData.email}</p>
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase font-black tracking-widest text-white/30 mb-3">Pagamento</h4>
                      {paymentMethod === 'card' ? (
                        <>
                          <p className="text-sm font-bold text-white">Cartão Final {formData.cardNumber.slice(-4)}</p>
                          <p className="text-xs text-white/40 mt-1">Crédito à vista</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-bold text-white">PIX</p>
                          <p className="text-xs text-white/40 mt-1">Pagamento instantâneo</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="p-8 rounded-[24px] bg-white/[0.02] border border-white/5 space-y-4 mt-12">
                    <h4 className="text-[10px] uppercase font-black tracking-widest text-white/30">Termos e Privacidade</h4>
                    <p className="text-[11px] text-white/40 leading-relaxed">
                      Ao clicar em finalizar a compra, você confirma que leu e concorda com nossos termos de serviço, política de privacidade e condições de cancelamento do evento.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SUMMARY SIDE */}
        <div className="space-y-6">
          <div className="glass overflow-hidden bg-white/[0.02]">
            <div className="w-full h-24 relative overflow-hidden ">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
            </div>
            
            <div className="p-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-6">Resumo do Pedido</h3>
              
              <div className="space-y-5 mb-6 pb-6 border-b border-white/5">
                <div className="flex flex-col gap-2">
                  <div>
                    <h4 className="text-base font-black text-white line-clamp-1 tracking-tight">{event.title}</h4>
                    <div className="flex items-center gap-1 text-[10px] text-white/40 mt-1 font-bold uppercase tracking-wider">
                      <MapPin size={10} className="text-primary" /> {event.location}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2 pb-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/30 font-bold uppercase tracking-tighter">Setor</span>
                    <span className="text-white font-black">{booking.category.name}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/30 font-bold uppercase tracking-tighter">Ingressos</span>
                    <span className="text-white font-black">{booking.seats.length}x</span>
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-white/30 font-bold uppercase tracking-tighter text-[10px] mt-1">Assentos</span>
                    <div className="flex flex-wrap gap-1 justify-end max-w-[100px]">
                      {booking.seats.map(id => (
                        <div 
                          key={id} 
                          style={{ width: '28px', height: '18px' }} 
                          className="bg-white/5 border border-white/5 rounded flex items-center justify-center text-white font-black text-[9px]"
                        >
                          {id}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Total</span>
                <span className="text-3xl font-black text-primary tracking-tighter">R$ {totalPrice}</span>
              </div>
            </div>
          </div>

          <div className="glass p-8 bg-white/[0.02] flex flex-col gap-6">
            <div className="space-y-4">
              {step === 1 && (
                <PrimaryButton onClick={nextStep} icon={ChevronRight} fullWidth>
                  Ir para Pagamentos
                </PrimaryButton>
              )}
              {step === 2 && (
                <PrimaryButton onClick={nextStep} icon={ChevronRight} fullWidth>
                  Revisar Pedidos
                </PrimaryButton>
              )}
              {step === 3 && (
                <PrimaryButton onClick={onComplete} icon={CheckCircle} fullWidth>
                  Finalizar Compra
                </PrimaryButton>
              )}
            </div>

            <div className="p-6 rounded-2xl border border-primary/20 bg-primary/5 flex items-start gap-4">
              <div className="text-primary mt-1"><ShieldCheck size={20} /></div>
              <div>
                <h4 className="text-xs font-bold text-white mb-1">Compra Segura</h4>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Seus dados são protegidos com criptografia de ponta a ponta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
