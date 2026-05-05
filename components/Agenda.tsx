
import React from 'react';
import { Session, Speaker } from '../types';
import { Clock, MapPin, User } from 'lucide-react';

interface AgendaProps {
  sessions: Session[];
  speakers: Speaker[];
}

export const Agenda: React.FC<AgendaProps> = ({ sessions, speakers }) => {
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <section id="agenda" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50/50 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.25em] mb-6">
            <Clock size={14} className="animate-pulse" /> Déroulement de la journée
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none uppercase">
            AGENDA DE LA <br /> <span className="gradient-text">CONFÉRENCE</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line for timeline */}
          <div className="absolute left-0 md:left-40 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent hidden md:block"></div>

          <div className="space-y-12">
            {sessions.map((session, idx) => {
              const speaker = speakers.find(s => s.id === session.speakerId);
              
              return (
                <div 
                  key={session.id} 
                  className="relative flex flex-col md:flex-row gap-8 md:gap-20 animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${idx * 150}ms` }}
                >
                  {/* Time Marker */}
                  <div className="md:w-40 flex-shrink-0 relative">
                    <div className="flex items-baseline gap-2 text-slate-900 font-black text-3xl tabular-nums">
                      {formatTime(session.startTime)}
                    </div>
                    <div className="text-slate-400 text-xs font-black uppercase tracking-widest mt-1">
                      Fin à {formatTime(session.endTime)}
                    </div>
                    
                    {/* Circle on line */}
                    <div className="absolute -left-[5px] md:left-[156px] top-4 w-3 h-3 rounded-full bg-white border-2 border-blue-600 z-10 hidden md:block shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 glass p-8 md:p-10 rounded-[2.5rem] border-slate-100 shadow-2xl shadow-slate-200/40 group hover:scale-[1.01] transition-all duration-500 hover:shadow-blue-500/5">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        session.type === 'KEYNOTE' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 
                        session.type === 'WORKSHOP' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {session.type}
                      </span>
                      <div className="flex items-center gap-2 text-slate-400 text-xs font-black uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">
                        <MapPin size={12} className="text-blue-500" /> {session.location}
                      </div>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                      {session.title}
                    </h3>
                    
                    <p className="text-slate-500 text-base md:text-lg font-medium leading-relaxed mb-8">
                      {session.description}
                    </p>

                    {speaker && (
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 group/speaker">
                        <div className="relative">
                          <img src={speaker.imageUrl} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-lg transform group-hover/speaker:rotate-6 transition-transform" alt={speaker.name} />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white p-1">
                             <User size={8} />
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Intervenant principal</p>
                          <p className="text-sm font-black text-slate-900 group-hover/speaker:text-blue-600 transition-colors">{speaker.name}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

