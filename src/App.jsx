import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import BackButton from './components/BackButton';
import Navbar from './components/Navbar';
import SeatPicker from './components/SeatPicker';
import HeroSearch from './components/HeroSearch';
import EventCard from './components/EventCard';
import EventHero from './components/EventHero';
import TicketSelector from './components/TicketSelector';
import Checkout from './components/Checkout';
import DigitalTicket from './components/DigitalTicket';
import UserProfile from './components/UserProfile';
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
    date: "2026-05-02T19:30:00",
    location: "Parque do Ibirapuera - São Paulo",
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
    date: "2026-03-10T21:00:00",
    location: "Pousada do Sossego - Belo Horizonte",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1470&auto=format&fit=crop",
    description: "Uma viagem no tempo com os maiores hits que marcaram gerações.",
    categories: ['normal', 'vip'],
    soldOut: true
  },
  {
    id: 5,
    title: "Festival de Verão",
    date: "2026-01-20T18:00:00",
    location: "Praia de Copacabana - Rio de Janeiro",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1470&auto=format&fit=crop",
    description: "Os maiores nomes da música brasileira em uma noite à beira-mar.",
    categories: ['normal', 'vip', 'premium'],
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
    },
    {
      id: 'T-100590',
      eventId: 5,
      category: 'normal',
      seats: [],
      date: '2026-01-20T18:00:00',
      purchaseDate: '2025-12-01'
    },
    {
      id: 'T-200781',
      eventId: 2,
      category: 'vip',
      seats: ['B3'],
      date: '2026-05-02T19:30:00',
      purchaseDate: '2026-04-10'
    },
    {
      id: 'T-200902',
      eventId: 1,
      category: 'premium',
      seats: ['C12', 'C13'],
      date: '2026-05-15T20:00:00',
      purchaseDate: '2026-04-22'
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
    const savedTickets = localStorage.getItem('eventflow_tickets');

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedEvent) setSelectedEvent(JSON.parse(savedEvent));
    if (savedBooking) setBooking(JSON.parse(savedBooking));
    if (savedView && savedView !== 'login') setView(savedView);
    if (savedTickets) setTickets(JSON.parse(savedTickets));
  }, []);

  // Persistir Usuário
  useEffect(() => {
    if (user) localStorage.setItem('eventflow_user', JSON.stringify(user));
    else localStorage.removeItem('eventflow_user');
  }, [user]);

  // Persistir Fluxo de Compra e Ingressos
  useEffect(() => {
    if (selectedEvent) localStorage.setItem('eventflow_selectedEvent', JSON.stringify(selectedEvent));
    localStorage.setItem('eventflow_booking', JSON.stringify(booking));
    if (view !== 'login') localStorage.setItem('eventflow_view', view);
    localStorage.setItem('eventflow_tickets', JSON.stringify(tickets));
  }, [selectedEvent, booking, view, tickets]);

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

              <div className="flex flex-col justify-between gap-6 mb-8 mt-12 px-2">
                <div className="max-w-xl">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2">Próximos <span className="gradient-text">Eventos</span></h2>
                  <p className="text-text-muted text-sm md:text-lg">Explore as melhores experiências ao redor do mundo.</p>
                </div>
                <div className="flex items-center gap-4 overflow-x-auto pb-4 scroll-x-mobile">
                  {['Todos', 'Show', 'Festa', 'Teatro', 'Work'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilter(cat)}
                      className={`px-6 py-3 rounded-[16px] whitespace-nowrap
                        ${filter === cat ? 'gradient-bg' : ''}
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
            <UserProfile
              user={user}
              tickets={tickets}
              getEventById={getEventById}
              onOpenTicket={(eventWithTicket) => setSelectedEvent(eventWithTicket)}
              onGoHome={() => setView('home')}
            />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {selectedEvent?.ticket && (
          <DigitalTicket
            ticket={selectedEvent.ticket}
            event={selectedEvent}
            holderName={user?.name}
            onClose={() => setSelectedEvent({ ...selectedEvent, ticket: null })}
          />
        )}
      </AnimatePresence>

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
