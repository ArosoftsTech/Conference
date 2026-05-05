
import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Review } from '../types';

interface ReviewsProps {
  reviews: Review[];
}

export const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
  if (reviews.length === 0) return null;

  return (
    <section id="reviews" className="py-32 bg-slate-900 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full glass-dark text-blue-400 text-[10px] font-black uppercase tracking-[0.25em]">
            <Star size={14} fill="currentColor" className="animate-pulse" /> Retours d'expérience
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-none uppercase">
            ILS ONT VÉCU <br /> <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">L'EXPÉRIENCE CIA</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {reviews.map((review, idx) => (
            <div 
              key={review.id} 
              className="glass-dark p-10 rounded-[3rem] relative group hover:scale-[1.02] transition-all duration-500 border-white/5 hover:border-white/10 animate-in fade-in slide-in-from-bottom-8 duration-1000"
              style={{ animationDelay: `${idx * 200}ms` }}
            >
              <div className="absolute top-10 right-10 text-white/5 group-hover:text-blue-500/10 transition-colors duration-700">
                <Quote size={80} />
              </div>
              
              <div className="flex gap-1.5 mb-8">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    className={i < review.rating ? 'text-blue-400 fill-blue-400' : 'text-white/10'} 
                  />
                ))}
              </div>

              <p className="text-white/70 text-lg font-medium italic mb-10 relative z-10 leading-relaxed">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-500/20 transform rotate-3 group-hover:rotate-0 transition-transform">
                    {review.userName.charAt(0)}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full border-4 border-[#0f172a] flex items-center justify-center">
                     <Star size={8} fill="white" className="text-white" />
                  </div>
                </div>
                <div>
                  <div className="font-black text-white uppercase tracking-tight text-base">{review.userName}</div>
                  <div className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em]">Participant Edition 2025</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

