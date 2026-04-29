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
import { authenticateUser, registerUser } from './data/mockUsers';

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
    genre: "show",
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
    genre: "show",
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
    genre: "show",
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
    genre: "show",
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
    genre: "show",
    date: "2026-01-20T18:00:00",
    location: "Praia de Copacabana - Rio de Janeiro",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=1470&auto=format&fit=crop",
    description: "Os maiores nomes da música brasileira em uma noite à beira-mar.",
    categories: ['normal', 'vip', 'premium'],
    soldOut: true
  },
  {
    id: 6,
    title: "Hamlet — O Espetáculo",
    genre: "teatro",
    date: "2026-06-20T19:00:00",
    location: "Teatro Municipal - Belo Horizonte",
    image: "https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=1471&auto=format&fit=crop",
    description: "Uma releitura moderna da obra-prima de Shakespeare com cenografia imersiva e elenco premiado.",
    categories: ['normal', 'vip'],
    soldOut: false
  },
  {
    id: 7,
    title: "Comédia Stand-Up: Risos Garantidos",
    genre: "teatro",
    date: "2026-07-05T21:00:00",
    location: "Casa de Cultura - Curitiba",
    image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=1470&auto=format&fit=crop",
    description: "Os melhores comediantes do país em uma noite de humor ácido e improviso ao vivo.",
    categories: ['normal', 'vip'],
    soldOut: false
  },
  {
    id: 8,
    title: "Pré-Estreia: Horizonte Perdido",
    genre: "cinema",
    date: "2026-05-28T20:30:00",
    location: "Cinemark Shopping Iguatemi - São Paulo",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1470&auto=format&fit=crop",
    description: "Sessão exclusiva de pré-estreia do filme mais aguardado do ano com presença do diretor.",
    categories: ['normal', 'vip'],
    soldOut: false
  },
  {
    id: 9,
    title: "Maratona Ghibli em Tela Grande",
    genre: "cinema",
    date: "2026-06-15T14:00:00",
    location: "Cine Belas Artes - São Paulo",
    image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1450&auto=format&fit=crop",
    description: "Uma jornada mágica por 5 clássicos do Studio Ghibli em projeção 4K restaurada.",
    categories: ['normal'],
    soldOut: false
  },
  {
    id: 10,
    title: "Workshop de UX Design",
    genre: "workshop",
    date: "2026-06-22T09:00:00",
    location: "Hub de Inovação - Belo Horizonte",
    image: "https://images.unsplash.com/photo-1531498860502-7c67cf02f657?q=80&w=1470&auto=format&fit=crop",
    description: "Aprenda na prática os fundamentos de pesquisa com usuários, prototipação e testes de usabilidade.",
    categories: ['normal'],
    soldOut: false
  },
  {
    id: 11,
    title: "Bootcamp de Inteligência Artificial",
    genre: "workshop",
    date: "2026-07-12T08:30:00",
    location: "Campus Google - São Paulo",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1470&auto=format&fit=crop",
    description: "Dois dias intensivos de imersão em Machine Learning, LLMs e aplicações práticas de IA.",
    categories: ['normal', 'vip'],
    soldOut: false
  },
  {
    id: 12,
    title: "Auto da Compadecida — Musical",
    genre: "teatro",
    date: "2026-08-01T20:00:00",
    location: "Teatro Castro Alves - Salvador",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1469&auto=format&fit=crop",
    description: "A obra de Ariano Suassuna ganha vida em um musical vibrante com trilha sonora original.",
    categories: ['normal', 'vip', 'premium'],
    soldOut: false
  }
];


// --- COMPONENTS ---

const CITIES = [
  'Rio Branco, AC',
  'Maceió, AL',
  'Macapá, AP',
  'Manaus, AM',
  'Salvador, BA',
  'Fortaleza, CE',
  'Brasília, DF',
  'Vitória, ES',
  'Goiânia, GO',
  'São Luís, MA',
  'Cuiabá, MT',
  'Campo Grande, MS',
  'Belo Horizonte, MG',
  'Belém, PA',
  'João Pessoa, PB',
  'Curitiba, PR',
  'Recife, PE',
  'Teresina, PI',
  'Rio de Janeiro, RJ',
  'Natal, RN',
  'Porto Alegre, RS',
  'Porto Velho, RO',
  'Boa Vista, RR',
  'Florianópolis, SC',
  'São Paulo, SP',
  'Aracaju, SE',
  'Palmas, TO'
];

export default function App() {
  const [view, setView] = useState('home');
  const [authMode, setAuthMode] = useState('login'); // login, register
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState(CITIES[0]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [booking, setBooking] = useState({ category: null, seats: [] });
  const [tickets, setTickets] = useState([]);
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
    setLoginError('');
    const result = authenticateUser(data.email, data.password);
    if (result.success) {
      setUser(result.user);
      setTickets(result.user.tickets || []);
      addToast('Bem-vindo de volta!', 'success', `Olá, ${result.user.name.split(' ')[0]}! Login realizado com sucesso.`);
      setView('home');
    } else {
      setLoginError(result.error);
    }
  };

  const handleRegister = (data) => {
    setLoginError('');
    const result = registerUser(data);
    if (result.success) {
      setUser(result.user);
      setTickets([]);
      addToast('Conta criada!', 'success', `Bem-vindo(a), ${result.user.name.split(' ')[0]}! Sua conta foi criada com sucesso.`);
      setView('home');
    } else {
      setLoginError(result.error);
    }
  };

  const handleGoogleLogin = () => {
    // Simula login social — usa o primeiro usuário do mock
    const result = authenticateUser('joao@email.com', '1234');
    if (result.success) {
      setUser(result.user);
      setTickets(result.user.tickets || []);
      addToast('Login Social', 'success', 'Conectado via Google com sucesso.');
      setView('home');
    }
  };

  const handleFacebookLogin = () => {
    // Simula login social — usa o segundo usuário do mock
    const result = authenticateUser('maria@email.com', '1234');
    if (result.success) {
      setUser(result.user);
      setTickets(result.user.tickets || []);
      addToast('Login Social', 'success', 'Conectado via Facebook com sucesso.');
      setView('home');
    }
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
    setTickets([]);
    setLoginError('');
    localStorage.removeItem('eventflow_user');
    localStorage.removeItem('eventflow_tickets');
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
              <HeroSearch
                location={location}
                setLocation={setLocation}
                cities={CITIES}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSearch={() => {}}
              />

              <div className="flex flex-col justify-between gap-6 mb-8 mt-12 px-2">
                <div className="max-w-xl">
                  <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2">Próximos <span className="gradient-text">Eventos</span></h2>
                  <p className="text-text-muted text-sm md:text-lg">Explore as melhores experiências ao redor do mundo.</p>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-4 scroll-x-mobile">
                  {[
                    { key: 'Todos', label: 'Todos' },
                    { key: 'show', label: 'Show' },
                    { key: 'teatro', label: 'Teatro' },
                    { key: 'cinema', label: 'Cinema' },
                    { key: 'workshop', label: 'Workshop' },
                  ].map(cat => {
                    const count = cat.key === 'Todos'
                      ? EVENTS.length
                      : EVENTS.filter(e => e.genre === cat.key).length;
                    return (
                      <button
                        key={cat.key}
                        onClick={() => setFilter(cat.key)}
                        className={`px-6 py-3 rounded-[16px] whitespace-nowrap
                          ${filter === cat.key ? 'gradient-bg' : ''}
                        `}
                        style={{
                          border: '0',
                          color: 'white',
                          background: filter === cat.key ? undefined : 'var(--glass)',
                          backdropFilter: filter === cat.key ? undefined : 'blur(12px)',
                          WebkitBackdropFilter: filter === cat.key ? undefined : 'blur(12px)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                        }}
                      >
                        {cat.label}
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            minWidth: '22px',
                            height: '22px',
                            borderRadius: '9999px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: filter === cat.key ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)',
                            color: filter === cat.key ? 'white' : 'rgba(255,255,255,0.5)',
                          }}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="grid-auto">
                {EVENTS
                  .filter(event => filter === 'Todos' || event.genre === filter)
                  .filter(event => {
                    if (!searchQuery.trim()) return true;
                    const q = searchQuery.toLowerCase();
                    return (
                      event.title.toLowerCase().includes(q) ||
                      event.location.toLowerCase().includes(q) ||
                      event.description.toLowerCase().includes(q)
                    );
                  })
                  .map(event => <EventCard key={event.id} event={event} onClick={startPurchase} />)
                }
              </div>
            </motion.section>
          )}

          {view === 'login' && (
            <Login 
              onLogin={handleLogin}
              onRegister={handleRegister}
              onGoogleLogin={handleGoogleLogin}
              onFacebookLogin={handleFacebookLogin}
              loginError={loginError}
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
