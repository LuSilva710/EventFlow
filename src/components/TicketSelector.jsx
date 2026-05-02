import React from 'react';

const TicketSelector = ({ event, categories, booking, setBooking, user, setView }) => {
  if (!event) return null;

  const totalQty = event.categories.reduce((acc, catKey) => acc + (booking.basket?.[categories[catKey.toUpperCase()]?.id] || 0), 0);
  const totalPrice = event.categories.reduce((acc, catKey) => acc + ((booking.basket?.[categories[catKey.toUpperCase()]?.id] || 0) * (categories[catKey.toUpperCase()]?.price || 0)), 0);

  return (
    <div className="glass shadow-xl" style={{ flex: '1 1 320px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px' }}>
      <h3 className="text-base md:text-lg font-bold mb-4 text-white">Selecione seu Ingresso</h3>
      
      <div className="flex flex-col gap-2 mb-5">
        {event.categories.map(catKey => {
          const cat = categories[catKey.toUpperCase()];
          if (!cat) return null;
          const qty = booking.basket?.[cat.id] || 0;
          const isActive = qty > 0;
          
          return (
            <div 
              key={cat.id} 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                border: isActive ? '2px solid rgba(99, 102, 241, 0.5)' : '2px solid rgba(255,255,255,0.05)',
                background: isActive ? 'linear-gradient(to right, rgba(99, 102, 241, 0.1), rgba(0,0,0,0.2))' : 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(12px)',
                boxShadow: isActive ? '0 10px 25px -5px rgba(99, 102, 241, 0.2)' : 'none',
                cursor: 'pointer'
              }}
              onClick={() => {
                if (qty === 0) {
                    setBooking(prev => {
                      const newBasket = { ...(prev.basket || {}), [cat.id]: 1 };
                      return { ...prev, basket: newBasket, category: cat };
                    });
                }
              }}
            >
              <div>
                <p style={{ fontWeight: 'bold', fontSize: '14px', color: 'white', margin: 0 }}>{cat.name}</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '2px', marginBottom: 0 }}>{cat.id === 'premium' ? 'Acesso Open Bar & Livre' : 'Acesso Geral'}</p>
                <span style={{ fontSize: '14px', fontWeight: 900, color: 'white', display: 'block', marginTop: '2px' }}>R$ {cat.price}</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.5)', borderRadius: '99px', padding: '4px 6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <button 
                  style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', background: 'transparent', border: 'none', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setBooking(prev => {
                      const newBasket = { ...(prev.basket || {}), [cat.id]: Math.max(0, qty - 1) };
                      // Se a categoria atual foi zerada, tenta pegar outra categoria que tenha ingressos no basket
                      let newCategory = prev.category;
                      if (newBasket[cat.id] === 0 && prev.category?.id === cat.id) {
                        const otherCatId = Object.keys(newBasket).find(id => newBasket[id] > 0);
                        newCategory = otherCatId ? categories[otherCatId.toUpperCase()] : null;
                      }
                      return { ...prev, basket: newBasket, category: newCategory };
                    });
                  }}
                >-</button>
                <span style={{ fontSize: '16px', fontWeight: 'bold', width: '20px', textAlign: 'center', color: 'white' }}>{qty}</span>
                <button 
                  style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', background: 'transparent', border: 'none', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setBooking(prev => {
                      const newBasket = { ...(prev.basket || {}), [cat.id]: qty + 1 };
                      return { ...prev, basket: newBasket, category: cat };
                    });
                  }}
                >+</button>
              </div>
            </div>
          );
        })}
      </div>

      <>
        {totalQty > 0 && (
          <div style={{ marginTop: '28px', marginBottom: '16px', padding: '16px 20px', background: 'linear-gradient(to right, rgba(99,102,241,0.15), rgba(0,0,0,0.4))', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'inset 0 2px 15px rgba(0,0,0,0.5)' }}>
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', fontWeight: 500, letterSpacing: '0.05em' }}>Total a pagar</span>
            <span style={{ fontSize: '24px', fontWeight: 900, color: '#818cf8', textShadow: '0 2px 10px rgba(99,102,241,0.4)' }}>R$ {totalPrice}</span>
          </div>
        )}

        <button 
          disabled={totalQty === 0} 
          onClick={() => user ? setView('seats') : setView('login')} 
          className={totalQty > 0 ? 'gradient-bg shadow-xl shadow-primary/20 hover:scale-[1.02]' : ''}
          style={{ width: '100%', marginTop: totalQty === 0 ? '28px' : 0, padding: '16px', fontSize: '12px', borderRadius: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', cursor: totalQty > 0 ? 'pointer' : 'not-allowed', border: 'none', color: totalQty > 0 ? 'white' : 'rgba(255,255,255,0.2)', background: totalQty > 0 ? undefined : '#1a1b23' }}
        >
          {totalQty > 0 ? `Continuar (${totalQty})` : 'Selecione um Ingresso'}
        </button>
      </>
    </div>
  );
};

export default TicketSelector;
