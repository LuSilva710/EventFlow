import React from 'react';
import { Search, MapPin } from 'lucide-react';

const HeroSearch = ({ location, setLocation, cities = [] }) => (
  <section className="mb-12 mt-12 md:px-0">
    <div className="max-w-4xl mx-auto">
      <div 
        className="glass p-2 border border-white/10 shadow-2xl relative"
        style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', borderRadius: '24px' }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ flex: 1, width: '50%', display: 'flex', alignItems: 'center', padding: '16px', gap: '8px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
            <Search className="text-primary" size={18} style={{ flexShrink: 0 }} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="bg-transparent border-none text-sm placeholder:text-text-muted"
              style={{ flex: 1, minWidth: 0, padding: '16px', margin: '0 4px', outline: 'none' }}
            />
          </div>
          <div style={{ flex: 1, width: '50%', display: 'flex', alignItems: 'center', padding: '16px', gap: '8px' }}>
            <MapPin className="text-primary" size={18} style={{ flexShrink: 0 }} />
            <select 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-white appearance-none cursor-pointer"
              style={{ flex: 1, minWidth: 0, padding: '16px', margin: '0 4px', outline: 'none' }}
            >
              {cities.map(city => (
                <option key={city} value={city} style={{ backgroundColor: '#1a1b23', color: 'white', padding: '8px 0' }}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button 
          className="gradient-bg font-bold text-sm shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" 
          style={{ width: '100%', margin: 0, padding: '16px 40px', borderRadius: '18px', border: 'none', color: 'white', cursor: 'pointer' }}
        >
          Pesquisar
        </button>
      </div>
    </div>
  </section>
);

export default HeroSearch;
