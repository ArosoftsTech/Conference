
import React from 'react';
import { Speaker } from '../types';

interface SpeakersProps {
  speakers: Speaker[];
}

export const Speakers: React.FC<SpeakersProps> = ({ speakers }) => {
  return (
    <section id="speakers" className="py-24 bg-white relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0a192f] to-transparent opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 text-center mb-20 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black uppercase tracking-[0.2em] mb-4">
          Expertise & Vision
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tight">
          Nos <span className="text-blue-600">Conférenciers</span>
        </h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
          Découvrez les experts qui vous aideront à reprogrammer votre cerveau pour atteindre de nouveaux sommets.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {speakers.map((speaker, i) => (
            <div 
              key={speaker.id || i} 
              className="group relative"
            >
              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 p-4 transition-all duration-500 hover:shadow-blue-900/10 hover:-translate-y-2 border border-slate-100 overflow-hidden">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden mb-6 bg-gradient-to-br from-blue-100 to-blue-50">
                  {speaker.imageUrl && !speaker.imageUrl.startsWith('input_file') ? (
                    <img 
                      src={speaker.imageUrl} 
                      alt={speaker.name} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.fallback-initials')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'fallback-initials absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800';
                          fallback.innerHTML = `<span style="font-size:4rem;font-weight:900;color:white;text-transform:uppercase">${speaker.name.split(' ').map(n => n[0]).join('')}</span>`;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
                      <span className="text-6xl font-black text-white uppercase">{speaker.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="text-center px-4 pb-4">
                  <h4 className="text-xl font-black text-slate-900 leading-tight mb-2 uppercase tracking-tight">
                    {speaker.name}
                  </h4>
                  <div className="h-1 w-12 bg-blue-600 mx-auto mb-4 rounded-full"></div>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider leading-relaxed">
                    {speaker.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
