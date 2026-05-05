
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Target, ArrowRight, Ticket } from 'lucide-react';
import { EVENT_DETAILS } from '../constants';

interface HeroProps {
  onBuy: () => void;
  onReserve: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBuy, onReserve }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 10, hours: 2, minutes: 36, seconds: 52 });

  useEffect(() => {
    const target = new Date("2026-05-30T08:00:00").getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance < 0) return clearInterval(interval);
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const totalTickets = 1000;
  const soldTickets = 432;
  const availableTickets = totalTickets - soldTickets;
  const progressPercentage = (soldTickets / totalTickets) * 100;

  return (
    <div id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-32 pb-24 overflow-hidden mesh-gradient">
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-[5%] w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-40 left-[10%] w-72 h-72 bg-purple-600/10 rounded-full blur-[80px] animate-pulse delay-700"></div>
        
        {/* Subtle geometric patterns */}
        <div className="absolute top-40 left-10 w-40 h-40 border border-slate-200/50 rounded-full animate-float opacity-50"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 border border-slate-200/30 rounded-3xl rotate-12 animate-float delay-1000 opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center space-y-12">
        {/* Header Branding */}
        <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass border-slate-200/50 shadow-xl shadow-blue-500/5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm transform -rotate-12">CIA</div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{EVENT_DETAILS.organization}</span>
          </div>
        </div>

        {/* Category & Date Badge */}
        <div className="inline-flex items-center gap-4 px-6 py-2.5 rounded-2xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.25em] shadow-2xl animate-in fade-in zoom-in duration-700 delay-300">
          <span>{EVENT_DETAILS.category}</span>
          <span className="w-1 h-1 bg-white/30 rounded-full"></span>
          <span className="text-blue-400">{EVENT_DETAILS.date}</span>
        </div>

        {/* Hero Title */}
        <div className="space-y-6 max-w-5xl mx-auto px-4">
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[1.05] tracking-tight">
            COMMENT <span className="gradient-text">REPROGRAMMER</span> <br className="hidden md:block" /> 
            SON CERVEAU POUR <span className="relative">
              RÉUSSIR
              <div className="absolute -bottom-2 left-0 w-full h-3 bg-orange-500/10 -rotate-1 -z-10 rounded-full"></div>
              <div className="absolute -bottom-1 left-0 w-full h-1.5 bg-orange-500/20 -rotate-1 -z-10 rounded-full"></div>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-forwards">
            {EVENT_DETAILS.description}
          </p>
        </div>

        {/* Action Blocks */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 max-w-5xl mx-auto w-full pt-4">
          {/* Main Booking Card */}
          <div className="flex-1 glass p-10 rounded-[3rem] space-y-8 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 border-white shadow-2xl shadow-blue-500/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="text-left space-y-2">
               <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Inscription Prioritaire</span>
               <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900">{EVENT_DETAILS.pricePerTicket.toLocaleString()}</span>
                  <span className="text-xl font-bold text-slate-400">F CFA</span>
               </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={onBuy}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
              >
                Prendre mon Pass <ArrowRight size={18} />
              </button>
              <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <Ticket size={14} className="text-blue-500" /> + {availableTickets} places disponibles uniquement
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="flex-1 bg-slate-900 p-10 rounded-[3rem] flex flex-col justify-between text-white relative group overflow-hidden hover:scale-[1.02] transition-all duration-500">
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mb-16 group-hover:scale-150 transition-transform duration-700"></div>
             
             <div className="grid grid-cols-1 gap-6 text-left">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-blue-400"><MapPin size={24} /></div>
                   <div>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Lieu de l'événement</p>
                      <p className="font-bold text-sm">{EVENT_DETAILS.venue}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-purple-400"><Clock size={24} /></div>
                   <div>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Ouverture des portes</p>
                      <p className="font-bold text-sm">Samedi 30 Mai à {EVENT_DETAILS.time}</p>
                   </div>
                </div>
             </div>

             <button 
                onClick={onReserve}
                className="mt-10 w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all"
             >
                Réserver sans payer
             </button>
          </div>
        </div>

        {/* Countdown Floating Panel */}
        <div className="inline-flex items-center gap-8 md:gap-12 glass px-12 py-6 rounded-[2.5rem] border-white shadow-2xl animate-float">
          {[
            { label: 'Jours', val: timeLeft.days },
            { label: 'Heures', val: timeLeft.hours },
            { label: 'Minutes', val: timeLeft.minutes },
            { label: 'Secondes', val: timeLeft.seconds }
          ].map((item, i) => (
            <React.Fragment key={i}>
              <div className="flex flex-col items-center">
                <span className="text-3xl md:text-4xl font-black text-slate-900 tabular-nums tracking-tighter">{item.val.toString().padStart(2, '0')}</span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{item.label}</span>
              </div>
              {i < 3 && <div className="h-8 w-px bg-slate-200"></div>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

