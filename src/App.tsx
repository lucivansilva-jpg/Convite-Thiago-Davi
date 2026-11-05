/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, MapPin, Clock, Sparkles, Volume2, VolumeX, 
  ArrowRight, CheckCircle2, Navigation, Send
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RSVP {
  id: string;
  name: string;
  guestsCount: number;
  phone: string;
  message: string;
  createdAt: string;
}

export default function App() {
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  
  // Modal states
  const [isRsvpOpen, setIsRsvpOpen] = useState<boolean>(false);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  
  // RSVP Form State
  const [rsvpName, setRsvpName] = useState<string>('');
  const [guestsCount, setGuestsCount] = useState<number>(1);
  const [rsvpPhone, setRsvpPhone] = useState<string>('');
  const [rsvpMessage, setRsvpMessage] = useState<string>('');
  const [rsvpsList, setRsvpsList] = useState<RSVP[]>([]);
  const [rsvpSuccess, setRsvpSuccess] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedRsvps = localStorage.getItem('thiago_davi_rsvps');
    if (savedRsvps) {
      try { setRsvpsList(JSON.parse(savedRsvps)); } catch(e) {}
    } else {
      const initialRsvps: RSVP[] = [
        { id: '1', name: 'Família Silva', guestsCount: 3, phone: '(85) 99999-1234', message: 'Estamos ansiosos para a festa!', createdAt: '2026-11-01' },
        { id: '2', name: 'Duda e Mamãe', guestsCount: 2, phone: '(85) 98888-5678', message: 'Viva o Thiago Davi!', createdAt: '2026-11-02' }
      ];
      setRsvpsList(initialRsvps);
      localStorage.setItem('thiago_davi_rsvps', JSON.stringify(initialRsvps));
    }
  }, []);

  const saveRsvpStorage = (newList: RSVP[]) => {
    setRsvpsList(newList);
    localStorage.setItem('thiago_davi_rsvps', JSON.stringify(newList));
  };

  // Countdown timer calculation to Nov 29, 2026 19:00:00
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const targetDate = new Date('2026-11-29T19:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleEnterInvitation = () => {
    setHasEntered(true);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpPhone.trim()) return;

    const newRsvp: RSVP = {
      id: Date.now().toString(),
      name: rsvpName.trim(),
      guestsCount: Number(guestsCount) || 1,
      phone: rsvpPhone.trim(),
      message: rsvpMessage.trim(),
      createdAt: new Date().toLocaleDateString('pt-BR')
    };

    const updated = [newRsvp, ...rsvpsList];
    saveRsvpStorage(updated);
    setRsvpSuccess(true);
    triggerConfetti();

    // Open WhatsApp URL to number 5585998653614
    const message = encodeURIComponent(
      `Olá! Confirmo presença no aniversário do Thiago Davi (4 anos).\n\n*Nome:* ${rsvpName.trim()}\n*Pessoas:* ${guestsCount}\n*Telefone:* ${rsvpPhone.trim()}\n*Mensagem:* ${rsvpMessage.trim() || 'Nenhuma'}`
    );
    const whatsappUrl = `https://wa.me/5585998653614?text=${message}`;
    window.open(whatsappUrl, '_blank');

    setRsvpName('');
    setRsvpPhone('');
    setRsvpMessage('');
    setGuestsCount(1);
  };

  return (
    <div className="min-h-screen bg-[#FFFBEB] text-[#451A03] font-sans selection:bg-amber-300 selection:text-amber-900">
      
      {/* INTRO VIDEO MODAL / SCREEN */}
      {!hasEntered && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
          <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
            <button 
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.muted = !isMuted;
                  setIsMuted(!isMuted);
                }
              }}
              className="bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md transition-all flex items-center gap-2 text-sm font-semibold"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              <span className="hidden sm:inline">{isMuted ? 'Ativar Som' : 'Som Ativado'}</span>
            </button>
            <button 
              onClick={handleEnterInvitation}
              className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2 text-sm md:text-base animate-pulse"
            >
              Pular Vídeo / Abrir Convite <ArrowRight size={18} />
            </button>
          </div>

          <div className="relative w-full max-w-sm sm:max-w-md aspect-[9/16] max-h-[80vh] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-400/50 flex items-center justify-center">
            <video
              ref={videoRef}
              src="/public/assets/aistudio/WhatsApp_Video_2026-11-05_at_09.59.22_fed538d8.mp4"
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              controls={false}
              onEnded={handleEnterInvitation}
              onClick={() => {
                if (videoRef.current) {
                  if (videoRef.current.paused) videoRef.current.play();
                  else videoRef.current.pause();
                }
              }}
            />
            
            <div className="absolute bottom-6 inset-x-4 text-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-md text-amber-200 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border border-amber-500/30">
                Toque no vídeo para reproduzir/pausar • O convite abrirá ao final
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-white text-xl sm:text-2xl font-bold tracking-wide">
              Thiago Davi faz 4 anos!
            </h1>
            <p className="text-amber-200/80 text-sm mt-1">
              Aventuras no Sítio do Picapau Amarelo
            </p>
          </div>
        </div>
      )}

      {/* MAIN INVITATION CONTENT */}
      <div className={`transition-opacity duration-700 ${hasEntered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
          
          {/* Main Invitation Poster Image */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-500 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            
            <div className="relative bg-white p-3 sm:p-4 rounded-3xl shadow-2xl border-4 border-amber-500 overflow-hidden text-center">
              <div className="absolute top-3 right-3 z-10 bg-yellow-400 text-amber-950 text-xs font-black uppercase px-3 py-1.5 rounded-full shadow-lg border border-amber-300 flex items-center gap-1">
                <Sparkles size={14} /> Edição Especial
              </div>
              
              <div className="rounded-2xl overflow-hidden shadow-inner max-w-lg mx-auto bg-amber-50 aspect-[9/16]">
                <video 
                  src="/public/assets/aistudio/Vem_viver_essa_aventura_comigo___1__573f417d.mp4" 
                  autoPlay 
                  muted 
                  playsInline 
                  controls 
                  className="w-full h-full object-cover transform scale-105 transition-transform duration-1000"
                />
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3 justify-center">
                <button 
                  onClick={() => setIsRsvpOpen(true)}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
                >
                  <CheckCircle2 size={20} /> Confirmar Presença
                </button>
                <button 
                  onClick={() => setIsLocationOpen(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2 text-base"
                >
                  <MapPin size={20} /> Como Chegar
                </button>
              </div>
            </div>
          </div>

          {/* Countdown Timer Card */}
          <div className="bg-gradient-to-br from-amber-700 to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-yellow-400 text-center relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
              <Sparkles size={200} />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-black text-yellow-300 drop-shadow mb-2">
              Contagem Regressiva para a Grande Aventura!
            </h3>
            <p className="text-amber-100 text-sm mb-6 max-w-md mx-auto">
              Estamos contando cada segundo para celebrar os 4 anos do Thiago Davi com a turma do Sítio do Picapau Amarelo!
            </p>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 border border-yellow-400/40">
                <span className="block text-2xl sm:text-4xl font-black text-yellow-300">{timeLeft.days}</span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-200">Dias</span>
              </div>
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 border border-yellow-400/40">
                <span className="block text-2xl sm:text-4xl font-black text-yellow-300">{timeLeft.hours}</span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-200">Horas</span>
              </div>
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 border border-yellow-400/40">
                <span className="block text-2xl sm:text-4xl font-black text-yellow-300">{timeLeft.minutes}</span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-200">Min</span>
              </div>
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 border border-yellow-400/40">
                <span className="block text-2xl sm:text-4xl font-black text-yellow-300">{timeLeft.seconds}</span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-amber-200">Seg</span>
              </div>
            </div>
          </div>

        </main>

        {/* Footer */}
        <footer className="max-w-3xl mx-auto px-4 py-8 text-center text-xs text-gray-500">
          <p>© 2026 Thiago Davi • 4 Anos • Sítio do Picapau Amarelo</p>
        </footer>

      </div>

      {/* RSVP MODAL */}
      {isRsvpOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-500 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-black text-amber-900">Confirmar Presença</h3>
              <button onClick={() => setIsRsvpOpen(false)} className="bg-gray-100 w-8 h-8 rounded-full font-bold">✕</button>
            </div>
            {rsvpSuccess ? (
              <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-6 text-center space-y-3">
                <h3 className="text-xl font-black text-green-800">Presença Confirmada!</h3>
                <p className="text-green-700 text-sm">Obrigado por confirmar!</p>
                <button onClick={() => setIsRsvpOpen(false)} className="bg-green-600 text-white px-5 py-2 rounded-xl text-sm font-bold">Fechar</button>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-4">
                <input type="text" required placeholder="Nome Completo / Família" value={rsvpName} onChange={(e) => setRsvpName(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 bg-amber-50/50" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={guestsCount} onChange={(e) => setGuestsCount(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 bg-amber-50/50">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => <option key={num} value={num}>{num} {num === 1 ? 'pessoa' : 'pessoas'}</option>)}
                  </select>
                  <input type="text" required placeholder="WhatsApp" value={rsvpPhone} onChange={(e) => setRsvpPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 bg-amber-50/50" />
                </div>
                <textarea rows={3} placeholder="Mensagem (Opcional)" value={rsvpMessage} onChange={(e) => setRsvpMessage(e.target.value)} className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 bg-amber-50/50" />
                <button type="submit" className="w-full bg-amber-600 text-white font-bold py-4 rounded-xl">Enviar Confirmação</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* LOCATION MODAL */}
      {isLocationOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-4 border-amber-500 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-xl font-black text-amber-900">Como Chegar</h3>
              <button onClick={() => setIsLocationOpen(false)} className="bg-gray-100 w-8 h-8 rounded-full font-bold">✕</button>
            </div>
            <div className="text-center space-y-4">
              <MapPin size={48} className="mx-auto text-amber-600" />
              <div>
                <h4 className="font-bold text-amber-950 text-lg">Espaço Naila</h4>
                <p className="text-gray-700">Aracoiaba, CE</p>
              </div>
              <a href="https://maps.app.goo.gl/6Qk4jc6d4US8RrH56" target="_blank" rel="noopener noreferrer" className="block bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-4 rounded-xl shadow-lg transition">Abrir no Google Maps</a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
