import React from 'react';
import { Ticket, LogIn, User, LogOut } from 'lucide-react';

const Navbar = ({ user, setView, onLogout }) => (
  <nav className="sticky top-0 z-50 w-full h-[180px] flex justify-between items-stretch bg-[#0a0b10] border-b border-white/5 transition-all shadow-2xl">
    
    {/* LADO ESQUERDO: LOGO */}
    <div 
      onClick={() => setView('home')}
      className="nav-side-block logo-block cursor-pointer group px-16 relative gradient-bg shadow-2xl shadow-primary/20 rounded-r-[80px] border-r-2 border-white/20 flex items-center"
      style={{ minWidth: '400px' }}
    >
      <div className="flex items-center gap-6">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[28px] border-2 border-white shadow-[0_0_30px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform duration-500">
          <Ticket className="text-white fill-white/20" size={52} />
        </div>
        <div className="flex flex-col">
          <span className="text-white text-5xl font-black uppercase tracking-tighter leading-none">EventFlow</span>
          <span className="text-xs text-white/70 font-bold tracking-[0.5em] uppercase mt-3">Full Experience</span>
        </div>
      </div>
    </div>

    {/* CENTRO: NAVEGAÇÃO */}
    <div className="flex-1 flex items-center justify-center hide-mobile px-4">
      <div className="flex items-center gap-16">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-2">Encontre seu próximo  <span className="gradient-text"> evento</span></h2>
        <div className="h-10 w-[1px] bg-white/5" />
      </div>
    </div>

    {/* LADO DIREITO: AUTH / USER */}
    <div 
      className="nav-side-block auth-block"
      style={{ minWidth: '400px' }}
    >
      {!user ? (
        <button
          onClick={() => setView('login')}
          className="gradient-bg h-full px-20 w-full flex items-center justify-center gap-8 rounded-l-[120px] border-l-4 border-white shadow-2xl shadow-primary/40 hover:pl-28 transition-all group"
        >
          <div className="flex flex-col items-end" style={{ color: 'white' }}>
            <span className="font-black uppercase tracking-[0.4em] text-2xl group-hover:scale-105 transition-transform">Entrar</span>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase mt-1">Acesso Exclusivo</span>
          </div>
          <div className="w-16 h-16 rounded-full border-2 border-white/30 flex-center group-hover:bg-white/10 transition-all shadow-inner">
            <LogIn size={28} color="white" className="group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      ) : (
        <div 
          className="gradient-bg flex items-center justify-between w-full h-full rounded-l-[120px] border-l-4 border-white shadow-2xl shadow-primary/30"
          style={{ paddingLeft: '4rem', paddingRight: '4rem' }}
        >
          <div 
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => setView('profile')}
          >
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                <User size={24} color="white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-primary flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            <div className="text-left hide-mobile">
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest leading-none mb-1">Área do Cliente</p>
              <p className="text-[16px] font-black text-white uppercase tracking-tighter leading-none truncate max-w-[150px] group-hover:text-white transition-colors">{user.name}</p>
            </div>
          </div>
          
          <div className="h-10 w-[1px] bg-white/10" />

          <button 
            onClick={onLogout} 
            className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-danger/20 hover:border-danger/40 transition-all border border-white/10 flex items-center justify-center group"
            title="Sair"
          >
            <LogOut size={24} color="white" className="group-hover:text-danger transition-colors" />
          </button>
        </div>
      )}
    </div>
  </nav>
);

export default Navbar;
