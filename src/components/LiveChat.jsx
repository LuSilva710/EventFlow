import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, User, MessageCircle, MoreHorizontal } from 'lucide-react';

const INITIAL_MESSAGES = [
  { id: 1, text: 'Olá! Sou o assistente virtual da EventFlow. Como posso ajudar você hoje?', sender: 'agent', time: '19:22' }
];

export default function LiveChat({ onClose }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    
    // Simula resposta do agente
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const agentReply = {
        id: Date.now() + 1,
        text: 'Entendido! Estamos processando sua solicitação. Em instantes um atendente humano poderá assumir esta conversa se necessário.',
        sender: 'agent',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, agentReply]);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 100, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '40px',
        width: '380px',
        height: '550px',
        background: '#0f111a',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 11000,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{ padding: '20px', background: '#161822', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User color="white" size={20} />
            </div>
            <div style={{ position: 'absolute', bottom: '-2px', right: '-2px', width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', border: '2px solid #161822' }} />
          </div>
          <div>
            <h4 style={{ color: 'white', fontSize: '14px', fontWeight: 'bold', margin: 0 }}>Suporte EventFlow</h4>
            <p style={{ color: '#10b981', fontSize: '11px', margin: 0, fontWeight: 'bold' }}>Online agora</p>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id}
            style={{ 
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}
          >
            <div style={{ 
              padding: '12px 16px', 
              borderRadius: msg.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
              background: msg.sender === 'user' ? '#6366f1' : '#1c1f2e',
              color: 'white',
              fontSize: '14px',
              lineHeight: '1.5',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              {msg.text}
            </div>
            <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>{msg.time}</p>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ alignSelf: 'flex-start', background: '#1c1f2e', padding: '12px 16px', borderRadius: '16px 16px 16px 0' }}>
            <MoreHorizontal size={20} color="#94a3b8" className="animate-pulse" />
          </div>
        )}
      </div>

      {/* Input */}
      <form 
        onSubmit={handleSend}
        style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#161822', display: 'flex', gap: '12px' }}
      >
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Digite sua mensagem..."
          style={{ 
            flex: 1, 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '12px', 
            padding: '12px 16px', 
            color: 'white', 
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <button 
          type="submit"
          style={{ 
            background: '#6366f1', 
            color: 'white', 
            width: '44px', 
            height: '44px', 
            borderRadius: '12px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
          }}
        >
          <Send size={18} />
        </button>
      </form>
    </motion.div>
  );
}
