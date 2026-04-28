import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Info } from 'lucide-react';

const GoogleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2" style={{ display: 'block' }}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const Login = ({ onLogin, onGoogleLogin, onFacebookLogin }) => {
  const [authMode, setAuthMode] = useState('login');

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    onLogin(data);
  };

  return (
    <motion.div
      key="auth"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      className="full-center px-4"
    >
      <div className="auth-container">
        {/* --- SIDEBAR PANEL (Toggles) --- */}
        <div className={`auth-sidebar ${authMode === 'register' ? 'md:order-1' : 'md:order-2'}`}>
          {authMode === 'login' ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-2xl font-bold mb-3">Bem-vindo de Volta!</h2>
              <p className="mb-6 text-white/80 leading-relaxed text-xs">Para continuar conectado conosco, faça login com seus dados.</p>
              <button
                onClick={() => setAuthMode('register')}
                className="ef-link-btn mt-4 uppercase tracking-widest text-[10px] border border-white/20 px-8 py-2 rounded-full hover:border-primary"
              >
                Criar Conta
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-2xl font-bold mb-3">Olá, Amigo!</h2>
              <p className="mb-6 text-white/80 leading-relaxed text-xs">Insira seus dados pessoais e comece sua jornada hoje.</p>
              <button
                onClick={() => setAuthMode('login')}
                className="ef-link-btn mt-4 uppercase tracking-widest text-[10px] border border-white/20 px-8 py-2 rounded-full hover:border-primary"
              >
                Fazer Login
              </button>
            </motion.div>
          )}
        </div>

        {/* --- FORM PANEL --- */}
        <div className={`auth-form-panel ${authMode === 'register' ? 'md:order-2' : 'md:order-1'}`}>
          <motion.div
            key={authMode}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="w-full text-center"
          >
            <h2 className="text-3xl font-bold mb-2 text-white">
              {authMode === 'login' ? 'Entrar' : 'Criar Conta'}
            </h2>

            <div className="social-icons-row" style={{ marginTop: '12px', marginBottom: '12px' }}>
              <button onClick={onFacebookLogin} className="social-icon-btn" title="Entrar com Facebook">
                <FacebookIcon size={20} />
              </button>
              <button onClick={onGoogleLogin} className="social-icon-btn" title="Entrar com Google">
                <GoogleIcon size={18} />
              </button>
              <button onClick={() => alert('Em breve!')} className="social-icon-btn" title="Mais opções">
                <Info size={18} />
              </button>
            </div>

            <span className="text-[10px] text-text-muted mb-4 inline-block">ou use sua conta de e-mail:</span>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 items-center w-full">
              {authMode === 'register' && (
                <div className="ef-input-container w-full">
                  <User size={18} />
                  <input name="name" type="text" placeholder="Nome Completo" required />
                </div>
              )}

              <div className="ef-input-container w-full">
                <Mail size={18} />
                <input name="email" id="email" type="email" placeholder="E-mail" required />
              </div>

              <div className="ef-input-container w-full">
                <Lock size={18} />
                <input name="password" id="password" type="password" placeholder="Senha" required />
              </div>

              {authMode === 'login' && (
                <button type="button" className="ef-link-btn mt-[-10px]">
                  Esqueceu sua senha?
                </button>
              )}

              <button
                type="submit"
                className="gradient-bg py-4 w-full rounded-full font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 mt-2 hover:scale-[1.02] transition-transform"
              >
                {authMode === 'login' ? 'Entrar' : 'Cadastrar'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
