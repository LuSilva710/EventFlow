import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Ticket, Archive, MapPin, Clock, QrCode,
  Search, Mail, Sparkles, CheckCircle2,
  TicketCheck, History, Compass, AlertCircle, Shield,
  ChevronDown, Phone, Pencil, Camera, Copy, Check, Globe
} from 'lucide-react';
import BackButton from './BackButton';

/*
  UserProfile (Página do Usuário)
  Aplica as 10 Heurísticas de Nielsen:
    H1 Visibilidade do status: estatísticas, badges, contagem regressiva, "ao vivo".
    H2 Correspondência com o mundo real: datas em pt-BR, metáfora de bilhete, ícones familiares.
    H3 Controle e liberdade: tabs com aria-controls, busca limpável, voltar à home no estado vazio.
    H4 Consistência e padrões: mesmo sistema de cores/espacamentos do app.
    H5 Prevenção de erros: estados vazios e mensagens claras antes do clique.
    H6 Reconhecer em vez de lembrar: rótulos visíveis, ícones + texto, ordem cronológica.
    H7 Flexibilidade e eficiência: busca, filtro por tabs, atalhos de teclado.
    H8 Estético e minimalista: hierarquia visual clara, sem ruído.
    H9 Reconhecer/recuperar de erros: estados vazios com CTA para explorar eventos.
    H10 Ajuda e documentação: dicas contextuais, tooltips, instruções de uso.
*/

const CATEGORY_LABEL = {
  normal: 'Pista',
  vip: 'Área VIP',
  premium: 'Premium (Open Bar)'
};

const CATEGORY_PRICE = {
  normal: 80,
  vip: 150,
  premium: 300
};

const formatDate = (date, opts = { day: '2-digit', month: 'long', year: 'numeric' }) =>
  new Date(date).toLocaleDateString('pt-BR', opts);

const formatTime = (date) =>
  new Date(date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

const daysUntil = (date) => {
  const ms = new Date(date).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

const formatBRL = (value) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const TabButton = ({ id, active, onClick, icon: Icon, label, count }) => (
  <button
    id={`tab-${id}`}
    role="tab"
    aria-selected={active}
    aria-controls={`panel-${id}`}
    tabIndex={active ? 0 : -1}
    onClick={() => onClick(id)}
    className={`flex items-center gap-3 px-5 md:px-6 py-3 md:py-4 text-sm font-bold rounded-xl transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0b10] ${active
      ? 'gradient-bg text-white shadow-lg shadow-primary/30'
      : 'text-text-muted hover:text-white hover:bg-white/5'
      }`}
  >
    <Icon size={18} aria-hidden="true" />
    <span>{label}</span>
    {typeof count === 'number' && (
      <span
        aria-label={`${count} ${count === 1 ? 'item' : 'itens'}`}
        className={`ml-1 inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-[11px] font-black rounded-full ${active ? 'bg-white/25 text-white' : 'bg-white/10 text-white/80'
          }`}
      >
        {count}
      </span>
    )}
  </button>
);

const StatCard = ({ icon: Icon, label, value, sublabel, tone = 'primary' }) => {
  const toneClasses = {
    primary: 'from-primary/20 to-secondary/10 text-primary',
    success: 'from-success/20 to-success/5 text-success',
    muted: 'from-white/10 to-white/0 text-white/70'
  };
  return (
    <div className="glass p-5 md:p-6 flex items-center gap-4 border border-white/5">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${toneClasses[tone]} flex-center shrink-0`}>
        <Icon size={22} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <div className="text-2xl md:text-3xl font-black text-white leading-none truncate">{value}</div>
        <div className="text-[11px] font-bold text-text-muted uppercase tracking-widest mt-1.5">{label}</div>
        {sublabel && <div className="text-xs text-white/60 mt-0.5 truncate">{sublabel}</div>}
      </div>
    </div>
  );
};

const StatusBadge = ({ children, tone = 'primary', icon: Icon }) => {
  const tones = {
    primary: 'bg-primary/20 text-white border-primary/40',
    success: 'bg-success/20 text-success border-success/40',
    warning: 'bg-amber-500 text-black border-amber-600',
    muted: 'bg-white/10 text-white border-white/20'
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[11px] font-black uppercase tracking-widest ${tones[tone]}`}
    >
      {Icon && <Icon size={11} aria-hidden="true" />}
      {children}
    </span>
  );
};

const EmptyState = ({ icon: Icon, title, description, ctaLabel, onCta }) => (
  <div className="glass border border-dashed border-white/10 p-10 md:p-16 text-center flex flex-col items-center gap-4">
    <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white/5 flex-center text-white/40">
      <Icon size={36} aria-hidden="true" />
    </div>
    <div>
      <h3 className="text-xl md:text-2xl font-black text-white mb-2">{title}</h3>
      <p className="text-text-muted text-sm md:text-base max-w-md">{description}</p>
    </div>
    {ctaLabel && (
      <button
        onClick={onCta}
        className="mt-2 gradient-bg px-6 py-3 rounded-xl text-white font-bold text-sm shadow-lg shadow-primary/30 hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {ctaLabel}
      </button>
    )}
  </div>
);

const UpcomingTicketCard = ({ ticket, event, onOpen }) => {
  const days = daysUntil(event.date);
  const tone = days <= 7 ? 'warning' : 'primary';
  const dayLabel =
    days === 0 ? 'Hoje' : days === 1 ? 'Amanhã' : days > 1 ? `Faltam ${days} dias` : 'Em breve';

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      className="glass border border-white/10 hover:border-primary/40 transition-all p-5 md:p-6 group"
    >
      <div className="flex flex-col md:flex-row gap-5">
        <div className="relative w-full md:w-44 h-32 md:h-32 rounded-2xl overflow-hidden shrink-0">
          <img
            src={event.image}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-2 left-2">
            <StatusBadge tone={tone} icon={Sparkles}>{dayLabel}</StatusBadge>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="min-w-0">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest block mb-1">
                {CATEGORY_LABEL[ticket.category] || ticket.category}
              </span>
              <h3 className="text-lg md:text-xl font-black text-white leading-tight group-hover:text-primary transition-colors truncate">
                {event.title}
              </h3>
            </div>
            <span className="text-xs text-text-muted font-bold whitespace-nowrap">
              {formatDate(event.date, { day: '2-digit', month: '2-digit', year: 'numeric' })}
            </span>
          </div>
          <p className="text-text-muted text-sm mb-3 truncate">
            <MapPin size={12} className="inline mr-1" aria-hidden="true" />
            {event.location}
          </p>
          <dl className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs mb-4">
            <div>
              <dt className="text-[10px] font-black text-text-muted uppercase tracking-widest">Horário</dt>
              <dd className="text-white font-bold flex items-center gap-1">
                <Clock size={12} className="text-primary" aria-hidden="true" />
                {formatTime(event.date)}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-black text-text-muted uppercase tracking-widest">Assentos</dt>
              <dd className="text-white font-bold truncate">
                {ticket.seats?.length ? ticket.seats.join(', ') : 'Pista livre'}
              </dd>
            </div>
            <div>
              <dt className="text-[10px] font-black text-text-muted uppercase tracking-widest">Código</dt>
              <dd className="text-white/80 font-mono">{ticket.id}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpen({ ...event, ticket })}
              className="inline-flex items-center gap-2 gradient-bg px-4 py-2 rounded-lg text-white text-xs font-bold shadow-lg shadow-primary/30 hover:scale-[1.02] transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label={`Abrir ingresso digital com QR Code para ${event.title}`}
            >
              <QrCode size={14} aria-hidden="true" />
              Ver Ingresso Digital
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const PastTicketCard = ({ ticket, event, user, onOpen }) => (
  <article className="glass border border-white/5 p-5 md:p-6 opacity-90 hover:opacity-100 transition-opacity">
    <div className="flex flex-col md:flex-row gap-5">
      <div className="relative w-full md:w-44 h-32 md:h-32 rounded-2xl overflow-hidden shrink-0 grayscale-[40%]">
        <img src={event.image} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-2 left-2">
          <StatusBadge tone="muted" icon={History}>Realizado</StatusBadge>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg md:text-xl font-black text-white truncate">{event.title}</h3>
          <span className="text-xs text-text-muted font-bold whitespace-nowrap">
            {formatDate(event.date, { day: '2-digit', month: '2-digit', year: 'numeric' })}
          </span>
        </div>
        <p className="text-text-muted text-sm mb-3 truncate">
          <MapPin size={12} className="inline mr-1" aria-hidden="true" />
          {event.location}
        </p>
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs mb-4">
          <div>
            <dt className="text-[10px] font-black text-text-muted uppercase tracking-widest">Setor</dt>
            <dd className="text-white font-bold">{CATEGORY_LABEL[ticket.category] || ticket.category}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-black text-text-muted uppercase tracking-widest">Titular</dt>
            <dd className="text-white font-bold truncate">{user?.name || '—'}</dd>
          </div>
          <div>
            <dt className="text-[10px] font-black text-text-muted uppercase tracking-widest">Código</dt>
            <dd className="text-white/80 font-mono">{ticket.id}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onOpen({ ...event, ticket })}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`Visualizar comprovante do evento ${event.title}`}
          >
            <Ticket size={14} aria-hidden="true" />
            Ver Comprovante
          </button>
        </div>
      </div>
    </div>
  </article>
);

const InfoField = ({ label, value, icon: Icon, copyable }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard indisponível; falha silenciosa */
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/[0.07] transition-colors group">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-1.5">
          {Icon && <Icon size={12} aria-hidden="true" />}
          {label}
        </span>
        {copyable && value && (
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? `${label} copiado` : `Copiar ${label.toLowerCase()}`}
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity p-1 rounded-md text-text-muted hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {copied ? <Check size={12} className="text-success" aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
          </button>
        )}
      </div>
      <div className="text-white font-bold text-sm truncate" title={value || '—'}>{value || '—'}</div>
    </div>
  );
};

const ProfileInfoCard = ({ user, memberSince }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const personalData = [
    { label: 'Nome completo', value: user?.name, icon: User },
    { label: 'E-mail', value: user?.email, icon: Mail },
    { label: 'Telefone', value: user?.phone || '(00) 00000-0000', icon: Phone },
    { label: 'Documento', value: user?.document || '000.000.000-00', icon: Shield },
    { label: 'Membro desde', value: memberSince, icon: CheckCircle2 }
  ];

  return (
    <section
      aria-labelledby="profile-info-title"
      className="mb-8 overflow-hidden"
      style={{ borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      {/* ── BANNER GRADIENTE ── */}
      <div
        style={{
          height: '140px',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary), #22d3ee)',
          position: 'relative',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 30% 0%, rgba(255,255,255,0.15) 0%, transparent 60%)',
          }}
        />
        {/* Botão editar no canto do banner */}
        <button
          type="button"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '40px',
            height: '40px',
            borderRadius: '14px',
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: 'pointer',
          }}
          aria-label="Editar dados pessoais"
        >
          <Pencil size={16} aria-hidden="true" />
        </button>
      </div>

      {/* ── CORPO DO PERFIL ── */}
      <div
        style={{
          background: 'var(--glass)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          padding: '0 32px 32px 32px',
        }}
      >
        {/* Avatar sobrepondo o banner */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginTop: '-56px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <div
              style={{
                width: '112px',
                height: '112px',
                borderRadius: '28px',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 8px 32px rgba(99,102,241,0.35), 0 0 0 4px var(--bg-dark)',
                overflow: 'hidden',
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <User size={48} aria-hidden="true" />
              )}
            </div>
            {/* Botão câmera — canto inferior direito do avatar */}
            <label
              title="Alterar foto de perfil"
              aria-label="Alterar foto de perfil"
              style={{
                position: 'absolute',
                bottom: '-6px',
                right: '-6px',
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                border: '3px solid var(--bg-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                zIndex: 11,
              }}
            >
              <Camera size={14} aria-hidden="true" />
              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
                aria-hidden="true"
              />
            </label>
          </div>

          {/* Nome + Badge centralizados */}
          <div style={{ textAlign: 'center', marginTop: '16px' }}>
            <h1
              id="profile-info-title"
              className="text-2xl font-black text-white leading-tight"
              style={{ marginBottom: '6px' }}
            >
              {user?.name || 'Visitante'}
            </h1>
            <p
              className="text-text-muted text-xs"
              style={{ marginBottom: '10px' }}
            >
              {user?.email || ''}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <StatusBadge tone="success" icon={Shield}>Conta Verificada</StatusBadge>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            margin: '24px 0',
          }}
        />

        {/* Dados pessoais */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <Shield size={14} className="text-success" aria-hidden="true" />
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
              Dados pessoais protegidos
            </span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '12px',
            }}
          >
            {personalData.map((field) => (
              <InfoField key={field.label} {...field} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const UserProfile = ({ user, tickets, getEventById, onOpenTicket, onGoHome }) => {
  const [tab, setTab] = useState('upcoming');
  const [search, setSearch] = useState('');

  const now = Date.now();

  const { upcoming, past } = useMemo(() => {
    const enriched = tickets
      .map((t) => ({ ticket: t, event: getEventById(t.eventId) }))
      .filter((x) => x.event);
    const up = enriched
      .filter(({ event }) => new Date(event.date).getTime() >= now)
      .sort((a, b) => new Date(a.event.date) - new Date(b.event.date));
    const pa = enriched
      .filter(({ event }) => new Date(event.date).getTime() < now)
      .sort((a, b) => new Date(b.event.date) - new Date(a.event.date));
    return { upcoming: up, past: pa };
  }, [tickets, getEventById, now]);

  const totalSpent = useMemo(
    () =>
      tickets.reduce((sum, t) => {
        const unit = CATEGORY_PRICE[t.category] || 0;
        const qty = t.seats?.length || 1;
        return sum + unit * qty;
      }, 0),
    [tickets]
  );

  const filteredUpcoming = useMemo(
    () =>
      upcoming.filter(({ event }) =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase())
      ),
    [upcoming, search]
  );

  const filteredPast = useMemo(
    () =>
      past.filter(({ event }) =>
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase())
      ),
    [past, search]
  );

  const nextEvent = upcoming[0]?.event;

  const memberSince = user?.memberSince || '—';

  return (
    <motion.section
      key="profile"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="max-w-6xl mx-auto py-8 md:py-12 px-4"
      aria-labelledby="profile-info-title"
    >
      <BackButton onClick={onGoHome} text="Página Inicial" className="mb-8" />

      <ProfileInfoCard
        user={user}
        memberSince={memberSince}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8" role="region" aria-label="Resumo da sua conta">
        <StatCard
          icon={TicketCheck}
          label="Próximos eventos"
          value={upcoming.length}
          sublabel={nextEvent ? `Próximo: ${formatDate(nextEvent.date, { day: '2-digit', month: 'short' })}` : 'Sem eventos agendados'}
          tone="primary"
        />
        <StatCard
          icon={History}
          label="Eventos realizados"
          value={past.length}
          sublabel={past.length ? 'Histórico disponível' : 'Sem histórico ainda'}
          tone="muted"
        />
        <StatCard
          icon={Sparkles}
          label="Valor total em ingressos"
          value={formatBRL(totalSpent)}
          sublabel={`${tickets.length} ${tickets.length === 1 ? 'ingresso comprado' : 'ingressos comprados'}`}
          tone="success"
        />
      </div>

      <div
        role="tablist"
        aria-label="Seções da minha área"
        className="flex flex-wrap gap-2 mb-6"
      >
        <TabButton
          id="upcoming"
          active={tab === 'upcoming'}
          onClick={setTab}
          icon={Ticket}
          label="Meus Ingressos"
          count={upcoming.length}
        />
        <TabButton
          id="history"
          active={tab === 'history'}
          onClick={setTab}
          icon={Archive}
          label="Histórico"
          count={past.length}
        />
      </div>

      <div className="mb-6">
        <label htmlFor="profile-search" className="sr-only">
          Buscar eventos
        </label>
        <div className="ef-input-container">
          <Search size={18} aria-hidden="true" />
          <input
            id="profile-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por evento ou cidade..."
            aria-label="Buscar nos seus eventos"
            autoComplete="off"
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'upcoming' && (
          <motion.div
            key="panel-upcoming"
            id="panel-upcoming"
            role="tabpanel"
            aria-labelledby="tab-upcoming"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {nextEvent && (
              <div
                role="status"
                aria-live="polite"
                className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-primary/10 border border-primary/30 text-sm text-white/90"
              >
                <Sparkles size={18} className="text-primary shrink-0" aria-hidden="true" />
                <span>
                  Seu próximo evento é{' '}
                  <strong className="text-white">{nextEvent.title}</strong> em{' '}
                  <strong className="text-white">{formatDate(nextEvent.date)}</strong>.
                </span>
              </div>
            )}

            {filteredUpcoming.length > 0 ? (
              <div className="space-y-5">
                {filteredUpcoming.map(({ ticket, event }) => (
                  <UpcomingTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    event={event}
                    onOpen={onOpenTicket}
                  />
                ))}
              </div>
            ) : search ? (
              <EmptyState
                icon={AlertCircle}
                title="Nenhum ingresso encontrado"
                description={`Não encontramos resultados para "${search}". Tente outro termo ou limpe a busca.`}
                ctaLabel="Limpar busca"
                onCta={() => setSearch('')}
              />
            ) : (
              <EmptyState
                icon={Compass}
                title="Você ainda não tem ingressos"
                description="Que tal explorar os eventos disponíveis e garantir o seu lugar? Seus ingressos digitais aparecerão aqui automaticamente."
                ctaLabel="Explorar eventos"
                onCta={onGoHome}
              />
            )}
          </motion.div>
        )}

        {tab === 'history' && (
          <motion.div
            key="panel-history"
            id="panel-history"
            role="tabpanel"
            aria-labelledby="tab-history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
              <History size={14} aria-hidden="true" />
              <span>Eventos realizados — exibidos do mais recente para o mais antigo.</span>
            </div>
            {filteredPast.length > 0 ? (
              <div className="space-y-4">
                {filteredPast.map(({ ticket, event }) => (
                  <PastTicketCard
                    key={ticket.id}
                    ticket={ticket}
                    event={event}
                    user={user}
                    onOpen={onOpenTicket}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Archive}
                title="Histórico vazio"
                description="Quando você participar de um evento, ele aparecerá aqui como referência futura."
              />
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </motion.section>
  );
};

export default UserProfile;
