
import React from 'react';
import { Partner } from '../types';

interface PartnersProps {
  partners: Partner[];
}

export const Partners: React.FC<PartnersProps> = ({ partners }) => {
  const tiers = ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE'];

  return (
    <section id="partners" className="py-32 bg-slate-50/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-24">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.25em] mb-6">
            Partenariat & Sponsoring
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none uppercase">
            ILS SOUTIENNENT <br /> <span className="gradient-text">L'EXCELLENCE</span>
          </h2>
        </div>

        <div className="space-y-24">
          {tiers.map(tier => {
            const tierPartners = partners.filter(p => p.tier === tier);
            if (tierPartners.length === 0) return null;

            return (
              <div key={tier} className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="flex items-center justify-center gap-6 mb-12">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent max-w-[100px]"></div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${
                    tier === 'PLATINUM' ? 'text-blue-600' : 
                    tier === 'GOLD' ? 'text-orange-500' : 'text-slate-400'
                  }`}>
                    {tier} PARTNERS
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent max-w-[100px]"></div>
                </div>

                <div className="flex flex-wrap justify-center gap-12 md:gap-24 px-4">
                  {tierPartners.map(partner => (
                    <a 
                      key={partner.id} 
                      href={partner.websiteUrl || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex flex-col items-center justify-center gap-4 transition-all duration-500"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-600/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="h-20 md:h-28 w-40 md:w-56 flex items-center justify-center glass border-transparent group-hover:border-white shadow-none group-hover:shadow-2xl group-hover:shadow-blue-500/10 rounded-3xl transition-all duration-500 bg-white/40 grayscale group-hover:grayscale-0 p-6">
                          <img 
                            src={partner.logoUrl} 
                            alt={partner.name} 
                            className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-slate-400 group-hover:text-blue-600 uppercase tracking-widest transition-all translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                        {partner.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

