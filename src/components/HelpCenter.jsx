import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, HelpCircle, Book, MessageSquare, ChevronRight, X, Ticket, User, CreditCard, Accessibility } from 'lucide-react';

const HELP_TOPICS = [
  {
    id: 'buying',
    category: 'Compras',
    icon: <CreditCard size={20} />,
    questions: [
      {
        q: 'Como posso comprar um ingresso?',
        a: 'Para comprar um ingresso, siga estas etapas:\n1. Navegue pela página inicial e escolha um evento.\n2. Clique no card do evento para ver mais detalhes.\n3. Selecione a categoria do ingresso (Pista, VIP, etc.).\n4. Escolha seus assentos no mapa interativo.\n5. Prossiga para o checkout e escolha a forma de pagamento.\n6. Após a confirmação, seu ingresso estará disponível no seu perfil.'
      },
      {
        q: 'Quais são as formas de pagamento aceitas?',
        a: 'Atualmente aceitamos Cartão de Crédito e PIX. O processamento via PIX é instantâneo, enquanto cartões de crédito podem levar alguns minutos para confirmação da operadora.'
      }
    ]
  },
  {
    id: 'tickets',
    category: 'Ingressos',
    icon: <Ticket size={20} />,
    questions: [
      {
        q: 'Onde encontro meus ingressos comprados?',
        a: 'Seus ingressos ficam armazenados na sua "Área do Cliente". Clique no seu nome/ícone de perfil na barra de navegação superior e selecione "Meus Ingressos".'
      },
      {
        q: 'Preciso imprimir o ingresso?',
        a: 'Não é necessário imprimir! Você pode apresentar o QR Code do seu ingresso digital diretamente pelo celular na entrada do evento.'
      }
    ]
  },
  {
    id: 'account',
    category: 'Minha Conta',
    icon: <User size={20} />,
    questions: [
      {
        q: 'Como altero meus dados cadastrais?',
        a: 'No momento, para alterar dados como e-mail ou nome, você deve entrar em contato com nosso suporte através do chat ou e-mail de atendimento.'
      }
    ]
  },
  {
    id: 'accessibility',
    category: 'Acessibilidade',
    icon: <Accessibility size={20} />,
    questions: [
      {
        q: 'Existem ingressos para PCD?',
        a: 'Sim! Todos os nossos eventos possuem áreas reservadas para Pessoas com Deficiência (PCD). Procure pelos ícones azuis específicos no mapa.'
      }
    ]
  }
];

export default function HelpCenter({ onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const filteredTopics = HELP_TOPICS.map(topic => ({
    ...topic,
    questions: topic.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(topic => topic.questions.length > 0);

  // Cores fixas para evitar problemas de contraste
  const COLORS = {
    bgModal: '#0a0b10',
    bgSidebar: '#0f111a',
    bgCard: '#161822',
    bgCardActive: '#1c1f2e',
    textMain: '#ffffff',
    textMuted: '#94a3b8',
    primary: '#6366f1'
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          width: '100%',
          maxWidth: '1000px',
          height: '80vh',
          background: COLORS.bgModal,
          borderRadius: '32px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* HEADER */}
        <div style={{ padding: '32px', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
          <button 
            onClick={onClose}
            style={{
              position: 'absolute', top: '32px', right: '32px',
              background: 'rgba(255,255,255,0.05)', color: 'white',
              width: '44px', height: '44px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyCenter: 'center',
              cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <X size={20} style={{ margin: '0 auto' }} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: COLORS.primary, padding: '12px', borderRadius: '16px' }}>
              <HelpCircle color="white" size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: 'white', letterSpacing: '-0.02em' }}>
                Central de <span style={{ color: COLORS.primary }}>Ajuda</span>
              </h2>
              <p style={{ color: COLORS.textMuted, fontSize: '14px' }}>Encontre respostas e suporte para suas dúvidas</p>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: COLORS.textMuted }} />
            <input 
              type="text"
              placeholder="Pesquise sua dúvida..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '16px 16px 16px 52px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px', color: 'white', fontSize: '16px', outline: 'none'
              }}
            />
          </div>
        </div>

        {/* BODY */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          
          {/* SIDEBAR */}
          <div style={{ width: '300px', background: COLORS.bgSidebar, borderRight: '1px solid rgba(255,255,255,0.05)', padding: '24px', overflowY: 'auto' }}>
            <p style={{ fontSize: '11px', fontWeight: '800', color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>Categorias</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => setSelectedCategory(null)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px',
                  background: !selectedCategory ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  border: !selectedCategory ? `1px solid ${COLORS.primary}` : '1px solid transparent',
                  color: !selectedCategory ? 'white' : COLORS.textMuted,
                  cursor: 'pointer', textAlign: 'left', fontWeight: '600'
                }}
              >
                <Book size={18} /> Todos os Temas
              </button>

              {HELP_TOPICS.map(topic => (
                <button 
                  key={topic.id}
                  onClick={() => setSelectedCategory(topic.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px',
                    background: selectedCategory === topic.id ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    border: selectedCategory === topic.id ? `1px solid ${COLORS.primary}` : '1px solid transparent',
                    color: selectedCategory === topic.id ? 'white' : COLORS.textMuted,
                    cursor: 'pointer', textAlign: 'left', fontWeight: '600'
                  }}
                >
                  {topic.icon} {topic.category}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(255,255,255,0.03)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p style={{ color: 'white', fontWeight: '700', fontSize: '14px', marginBottom: '8px' }}>Ainda com dúvidas?</p>
              <button style={{ width: '100%', padding: '12px', background: COLORS.primary, color: 'white', borderRadius: '10px', fontWeight: '800', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <MessageSquare size={14} /> CHAT AO VIVO
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div style={{ flex: 1, padding: '32px', overflowY: 'auto', background: COLORS.bgModal }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredTopics
                .filter(topic => !selectedCategory || topic.id === selectedCategory)
                .map(topic => (
                  <div key={topic.id} style={{ marginBottom: '24px' }}>
                    <h4 style={{ color: COLORS.primary, fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {topic.category}
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {topic.questions.map((q, idx) => (
                        <div 
                          key={idx}
                          style={{
                            background: activeQuestion === q.q ? COLORS.bgCardActive : COLORS.bgCard,
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '16px',
                            overflow: 'hidden'
                          }}
                        >
                          <button 
                            onClick={() => setActiveQuestion(activeQuestion === q.q ? null : q.q)}
                            style={{
                              width: '100%', padding: '20px', display: 'flex', alignItems: 'center', justifyBetween: 'space-between',
                              background: 'transparent', cursor: 'pointer', textAlign: 'left', gap: '16px'
                            }}
                          >
                            <span style={{ color: 'white', fontWeight: '700', flex: 1, fontSize: '15px' }}>{q.q}</span>
                            <ChevronRight 
                              size={18} 
                              style={{ 
                                color: COLORS.textMuted, 
                                transform: activeQuestion === q.q ? 'rotate(90deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s'
                              }} 
                            />
                          </button>
                          
                          <AnimatePresence>
                            {activeQuestion === q.q && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ padding: '0 20px 20px 20px', color: COLORS.textMuted, fontSize: '14px', lineHeight: '1.6', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '16px' }}
                              >
                                <p style={{ whiteSpace: 'pre-line' }}>{q.a}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              }

              {filteredTopics.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <p style={{ color: COLORS.textMuted }}>Nenhum resultado encontrado para sua busca.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </motion.div>
    </motion.div>
  );
}
