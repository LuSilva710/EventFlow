import React, { useState, useEffect } from 'react';
import {
  Ticket, Calendar, MapPin, User, Search,
  CreditCard, CheckCircle, ChevronLeft, LogIn,
  LogOut, QrCode, Filter, Clock, Info, ShieldCheck, Mail,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import Login from './components/Login';
import BackButton from './components/BackButton';
import Navbar from './components/Navbar';
import SeatPicker from './components/SeatPicker';
import HeroSearch from './components/HeroSearch';
import EventCard from './components/EventCard';
import EventHero from './components/EventHero';
import TicketSelector from './components/TicketSelector';
import Checkout from './components/Checkout';
import Toast from './components/Toast';

// --- MOCK DATA ---
const CATEGORIES = {
  NORMAL: { id: 'normal', name: 'Pista', price: 80, color: '#94a3b8' },
  VIP: { id: 'vip', name: 'Área VIP', price: 150, color: '#f59e0b' },
  PREMIUM: { id: 'premium', name: 'Premium (Open Bar)', price: 300, color: '#ec4899' }
};

const EVENTS = [
  {
    id: 1,
    title: "Festival das Luzes 2026",
    date: "2026-05-15T20:00:00",
    location: "Estádio Municipal - São Paulo",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1470&auto=format&fit=crop",
    description: "Prepare-se para a maior celebração visual do ano. Música eletrônica, shows de lasers e performances imersivas.",
    categories: ['normal', 'vip', 'premium'],
    soldOut: false
  },
  {
    id: 2,
    title: "Noite de Jazz no Coreto",
    date: "2026-04-25T19:30:00",
    location: "Parque do Ibirapuera",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1633&auto=format&fit=crop",
    description: "Um encontro clássico com os maiores expoentes do jazz contemporâneo. Experiência intimista e sofisticada.",
    categories: ['normal', 'vip'],
    soldOut: false
  },
  {
    id: 3,
    title: "Rock Underground",
    date: "2026-06-10T22:00:00",
    location: "Clube da Esquina - Ouro Branco",
    image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=1470&auto=format&fit=crop",
    description: "As bandas que estão moldando a nova cena do rock nacional se encontram em uma noite histórica.",
    categories: ['normal'],
    soldOut: false
  },
  {
    id: 4,
    title: "Retro 80's & 90's",
    date: "2026-03-10T21:00:00", // Past event
    location: "Pousada do Sossego",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1470&auto=format&fit=crop",
    description: "Uma viagem no tempo com os maiores hits que marcaram gerações.",
    categories: ['normal', 'vip'],
    soldOut: true
  }
];


// --- COMPONENTS ---

const CITIES = [
  'Belo Horizonte, MG',
  'São Paulo, SP',
  'Rio de Janeiro, RJ',
  'Curitiba, PR',
  'Brasília, DF',
  'Salvador, BA'
];

export default function App() {
  const [view, setView] = useState('home');
  const [authMode, setAuthMode] = useState('login'); // login, register
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState('Todos');
  const [location, setLocation] = useState(CITIES[0]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [booking, setBooking] = useState({ category: null, seats: [] });
  const [tickets, setTickets] = useState([
    {
      id: 'T-100234',
      eventId: 4,
      category: 'vip',
      seats: ['A5', 'A6'],
      date: '2026-03-10T21:00:00',
      purchaseDate: '2026-02-15'
    }
  ]);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info', description = '') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type, description }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Carregar dados salvos do localStorage ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('eventflow_user');
    const savedEvent = localStorage.getItem('eventflow_selectedEvent');
    const savedBooking = localStorage.getItem('eventflow_booking');
    const savedView = localStorage.getItem('eventflow_view');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedEvent) setSelectedEvent(JSON.parse(savedEvent));
    if (savedBooking) setBooking(JSON.parse(savedBooking));
    if (savedView && savedView !== 'login') setView(savedView);
  }, []);

  // Persistir Usuário
  useEffect(() => {
    if (user) localStorage.setItem('eventflow_user', JSON.stringify(user));
    else localStorage.removeItem('eventflow_user');
  }, [user]);

  // Persistir Fluxo de Compra
  useEffect(() => {
    if (selectedEvent) localStorage.setItem('eventflow_selectedEvent', JSON.stringify(selectedEvent));
    localStorage.setItem('eventflow_booking', JSON.stringify(booking));
    if (view !== 'login') localStorage.setItem('eventflow_view', view);
  }, [selectedEvent, booking, view]);

  const handleLogin = (data) => {
    setUser({ id: 1, name: data.name || 'João Silva', email: data.email || 'joao@email.com' });
    addToast('Bem-vindo de volta!', 'success', `Olá, ${data.name || 'João'}. Login realizado com sucesso.`);
    setView('home');
  };

  const handleGoogleLogin = () => {
    // Simulação de login Google
    setUser({ id: 2, name: 'Usuário Google', email: 'google@email.com' });
    setView('home');
  };

  const handleFacebookLogin = () => {
    // Simulação de login Facebook
    setUser({ id: 3, name: 'Usuário Facebook', email: 'facebook@email.com' });
    setView('home');
  };

  const startPurchase = (event) => {
    setSelectedEvent(event);
    setView('event');
  };

  const handleSeatConfirmation = (seats) => {
    setBooking({ ...booking, seats });
    setView('checkout');
  };

  const handlePayment = () => {
    const newTicket = {
      id: `T-${Math.floor(100000 + Math.random() * 900000)}`,
      eventId: selectedEvent.id,
      category: booking.category.id,
      seats: booking.seats,
      date: selectedEvent.date,
      purchaseDate: new Date().toISOString()
    };
    setTickets([newTicket, ...tickets]);
    addToast('Compra Finalizada!', 'success', 'Seus ingressos já estão disponíveis no seu perfil.');
    setView('success');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('eventflow_user');
    addToast('Sessão encerrada', 'info', 'Você saiu da sua conta com segurança.');
    setView('home');
  };

  const getEventById = (id) => EVENTS.find(e => e.id === id);

  return (
    <div className="min-h-screen pb-20">
      <Navbar user={user} setView={setView} onLogout={handleLogout} />

      <main className="container">
        <AnimatePresence mode="wait">
          {view === 'home' && (
            <motion.section key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <HeroSearch location={location} setLocation={setLocation} cities={CITIES} />

              <div className="flex flex-col md:flex-row justify-between md:items-end gap-6 mb-8 mt-12 px-2">
                <div className="max-w-xl">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2">Próximos <span className="gradient-text">Eventos</span></h2>
                  <p className="text-text-muted text-sm md:text-lg">Explore as melhores experiências ao redor do mundo.</p>
                </div>
                <div className="flex items-center gap-4 overflow-x-auto pb-4 md:pb-0 scroll-x-mobile">
                  {['Todos', 'Show', 'Festa', 'Teatro', 'Work'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-6 py-3 rounded-[16px] font-bold text-xs transition-all whitespace-nowrap hover:scale-105
                        ${filter === cat ? 'gradient-bg shadow-xl shadow-primary/30' : ''}
                      `}
                      style={{ 
                        border: '0', 
                        color: 'white',
                        background: filter === cat ? undefined : 'var(--glass)',
                        backdropFilter: filter === cat ? undefined : 'blur(12px)',
                        WebkitBackdropFilter: filter === cat ? undefined : 'blur(12px)'
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid-auto">
                {EVENTS.map(event => <EventCard key={event.id} event={event} onClick={startPurchase} />)}
              </div>
            </motion.section>
          )}

          {view === 'login' && (
            <Login 
              onLogin={handleLogin}
              onGoogleLogin={handleGoogleLogin}
              onFacebookLogin={handleFacebookLogin}
            />
          )}

          {view === 'event' && (
            <motion.div key="event" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} className="flex flex-col gap-8 md:gap-12 w-full">
              <BackButton onClick={() => setView('home')} />

              {/* CAPA - HERO IMAGE */}
              <EventHero event={selectedEvent} />

              {/* 2 COLUNAS */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', width: '100%', marginTop: '8px' }}>
                
                {/* Coluna 1: Descrição */}
                <div style={{ flex: '1 1 400px' }}>
                  <h3 className="text-2xl font-bold mb-4 text-white">Sobre o Evento</h3>
                  <p className="text-text-muted text-base md:text-lg leading-relaxed">{selectedEvent.description}</p>
                </div>

                {/* Coluna 2: Card Escolher Ingressos */}
                <TicketSelector 
                  event={selectedEvent} 
                  categories={CATEGORIES} 
                  booking={booking} 
                  setBooking={setBooking} 
                  user={user} 
                  setView={setView} 
                />
              </div>
            </motion.div>
          )}

          {view === 'seats' && (
            <motion.div key="seats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-8 md:gap-12 w-full">
              <BackButton onClick={() => setView('event')} />
              
              <div className="mb-8">
                 <h2 className="text-3xl md:text-5xl font-black mb-2 tracking-tighter">Mapa de <span className="gradient-text">Assentos</span></h2>
                 <p className="text-text-muted text-sm md:text-lg">Selecione os melhores lugares para sua experiência no <span className="text-white font-bold">{selectedEvent.title}</span></p>
              </div>
              <SeatPicker category={booking.category} onConfirm={handleSeatConfirmation} />
            </motion.div>
          )}

          {view === 'checkout' && (
            <motion.div key="checkout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Checkout 
                event={selectedEvent}
                booking={booking}
                onComplete={handlePayment}
                onBack={() => setView('seats')}
              />
            </motion.div>
          )}

          {view === 'success' && (
            <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md mx-auto text-center mt-12 md:mt-20 px-4">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-success/20 text-success rounded-full flex-center mx-auto mb-8 animate-bounce"><CheckCircle size={40} md={50} /></div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Sucesso!</h2>
              <p className="text-text-muted mb-10">Ingressos disponíveis no seu perfil.</p>
              <div className="flex flex-col gap-4">
                <button onClick={() => setView('profile')} className="gradient-bg py-4 rounded-xl font-bold">Ver Meus Ingressos</button>
              </div>
            </motion.div>
          )}

          {view === 'profile' && (
            <motion.section key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col md:flex-row items-center md:justify-between gap-6 mb-12">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl gradient-bg flex-center text-3xl font-bold text-white shadow-xl shadow-primary/20">JS</div>
                  <div><h1 className="text-3xl mb-1">{user?.name}</h1><p className="text-text-muted text-sm">{user?.email}</p></div>
                </div>
                <button onClick={() => setUser(null) || setView('home')} className="glass px-6 py-2 text-danger hover:bg-danger/10 border-danger/20 text-sm font-bold w-full md:w-auto">Sair</button>
              </div>
              <div className="mb-8">
                <div className="flex gap-6 border-b border-glass-border mb-8 overflow-x-auto whitespace-nowrap">
                  <button className="pb-4 border-b-2 border-primary font-bold">Ingressos ({tickets.length})</button>
                  <button className="pb-4 text-text-muted">Configurações</button>
                </div>
                <div className="flex flex-col gap-10">
                  <div>
                    <h3 className="text-[10px] md:text-sm font-bold text-text-muted uppercase mb-6 flex items-center gap-2"><Clock size={16} className="text-primary" /> Próximos Eventos</h3>
                    <div className="flex flex-col gap-4">
                      {tickets.filter(t => new Date(t.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date)).map(ticket => {
                        const event = getEventById(ticket.eventId);
                        return (
                          <div key={ticket.id} className="glass p-5 md:p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex gap-4 w-full">
                              <img src={event.image} alt={event.title} className="w-16 h-16 md:w-24 md:h-24 object-cover rounded-xl shrink-0" />
                              <div className="flex flex-col justify-center">
                                <h4 className="text-lg md:text-xl mb-1 line-clamp-1">{event.title}</h4>
                                <div className="flex flex-col gap-0.5"><span className="text-xs text-text-muted">{new Date(event.date).toLocaleDateString()}</span><span className="text-xs text-primary font-bold">{CATEGORIES[ticket.category.toUpperCase()].name} • {ticket.seats.join(', ')}</span></div>
                              </div>
                            </div>
                            <button onClick={() => setSelectedEvent({ ...event, ticket })} className="w-full md:w-auto glass px-4 py-3 font-bold flex-center gap-2"><QrCode size={18} /> Digital</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-[10px] md:text-sm font-bold text-text-muted uppercase mb-6">Passados</h3>
                    <div className="flex flex-col gap-4 opacity-70">
                      {tickets.filter(t => new Date(t.date) < new Date()).map(ticket => {
                        const event = getEventById(ticket.eventId);
                        return (
                          <div key={ticket.id} className="glass p-5 flex justify-between items-center border-dashed">
                            <div className="flex gap-4"><img src={event.image} alt={event.title} className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg" /><div><h4 className="text-base md:text-lg mb-1">{event.title}</h4><span className="text-[10px] text-text-muted">{new Date(event.date).toLocaleDateString()}</span></div></div>
                            <span className="badge badge-muted text-[10px]">Finalizado</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {selectedEvent?.ticket && (
        <div className="fixed inset-0 z-[60] flex-center p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-fade">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-[340px] md:max-w-sm glass overflow-hidden shadow-2xl border-2 border-primary/20">
            <div className="relative h-32 md:h-40">
              <img src={getEventById(selectedEvent.ticket.eventId).image} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
              <button onClick={() => setSelectedEvent({ ...selectedEvent, ticket: null })} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex-center text-white text-sm">✕</button>
            </div>
            <div className="p-5 md:p-6 text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-1">{getEventById(selectedEvent.ticket.eventId).title}</h3>
              <p className="text-primary font-bold mb-6 text-xs">{CATEGORIES[selectedEvent.ticket.category.toUpperCase()].name}</p>
              <div className="bg-white p-3 rounded-[20px] inline-block mb-6 shadow-glow">
                <QRCodeSVG value={`TICKET-${selectedEvent.ticket.id}`} size={window.innerWidth < 768 ? 130 : 160} level="H" includeMargin={true} />
              </div>
              <div className="grid grid-cols-2 gap-3 md:gap-4 text-left border-t border-glass-border pt-6 mb-4">
                <div><p className="text-[9px] text-text-muted uppercase font-black">Data</p><p className="font-bold text-xs">{new Date(selectedEvent.ticket.date).toLocaleDateString()}</p></div>
                <div><p className="text-[9px] text-text-muted uppercase font-black">Lugares</p><p className="font-bold text-xs truncate">{selectedEvent.ticket.seats.join(', ')}</p></div>
                <div><p className="text-[9px] text-text-muted uppercase font-black">Portão</p><p className="font-bold text-xs">A</p></div>
                <div><p className="text-[9px] text-text-muted uppercase font-black">Código</p><p className="font-bold text-xs">{selectedEvent.ticket.id}</p></div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <footer className="mt-20 py-10 border-t border-glass-border text-center text-text-muted text-sm">
        <div className="container">
          <p>© 2026 EventFlow. Todos os direitos reservados.</p>
        </div>
      </footer>
      {/* Sistema de Notificações */}
      <Toast toasts={toasts} removeToast={removeToast} />
    </div>
  );
}
