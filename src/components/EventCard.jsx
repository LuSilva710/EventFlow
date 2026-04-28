import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Info } from 'lucide-react';

const EventCard = ({ event, onClick }) => {
  const isPast = new Date(event.date) < new Date();

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
          <span className="font-bold text-lg">A partir de R$ 80</span>
          <button className="text-primary hover:translate-x-1 transition-transform">
            <Info size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
