import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

const EventHero = ({ event }) => {
  if (!event) return null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '32px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
      <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }} />
      
      {/* Gradient overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, rgba(10, 11, 16, 0.95), rgba(0, 0, 0, 0.3), transparent)' }}></div>
      
      {/* Content Overlay */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '32px', zIndex: 10 }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px', lineHeight: 1.2, color: 'white', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>{event.title}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: '999px', fontSize: '14px', fontWeight: 500 }}>
            <Calendar color="#6366f1" size={18} />
            <span>{new Date(event.date).toLocaleDateString('pt-BR')} às {new Date(event.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.9)', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', padding: '8px 16px', borderRadius: '999px', fontSize: '14px', fontWeight: 500 }}>
            <MapPin color="#6366f1" size={18} />
            <span>{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHero;
