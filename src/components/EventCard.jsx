import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Info } from 'lucide-react';

const GENRE_LABELS = {
  show: 'Show',
  teatro: 'Teatro',
  cinema: 'Cinema',
  workshop: 'Workshop',
};

const GENRE_COLORS = {
  show: '#6366f1',
  teatro: '#ec4899',
  cinema: '#f59e0b',
  workshop: '#10b981',
};

const CATEGORY_PRICE = {
  normal: 80,
  vip: 150,
  premium: 300,
};

const EventCard = ({ event, onClick }) => {
  const isPast = new Date(event.date) < new Date();
  const genreLabel = GENRE_LABELS[event.genre] || event.genre;
  const genreColor = GENRE_COLORS[event.genre] || '#6366f1';

  // Preço mínimo dinâmico baseado nas categorias do evento
  const minPrice = event.categories
    ? Math.min(...event.categories.map(c => CATEGORY_PRICE[c] || 0))
    : 80;

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="glass glass-hover flex flex-col group cursor-pointer h-full"
      onClick={() => onClick(event)}
    >
      <div className="event-card-img-container">
        <img
          src={event.image}
          alt={event.title}
          className="event-card-img transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {isPast ? (
            <span className="badge badge-muted bg-black/60 backdrop-blur-md">Encerrado</span>
          ) : (
            <span className="badge badge-primary">Vendas Abertas</span>
          )}
        </div>
        {/* Badge de gênero */}
        <div className="absolute top-4 right-4">
          <span
            className="badge"
            style={{
              background: genreColor,
              color: 'white',
              fontSize: '10px',
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {genreLabel}
          </span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg mb-2 group-hover:text-primary transition-colors">{event.title}</h3>
        <div className="flex items-center gap-2 text-text-muted text-sm mb-1">
          <Calendar size={14} />
          {new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </div>
        <div className="flex items-center gap-2 text-text-muted text-sm mb-4">
          <MapPin size={14} />
          {event.location}
        </div>
        <div className="mt-auto flex justify-between items-center">
          <span className="font-bold text-lg">A partir de R$ {minPrice}</span>
          <button className="text-primary hover:translate-x-1 transition-transform">
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
