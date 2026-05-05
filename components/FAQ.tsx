
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { FAQ as FAQType } from '../types';

interface FAQProps {
  faqs: FAQType[];
}

export const FAQ: React.FC<FAQProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (faqs.length === 0) return null;

  return (
    <section id="faq" className="py-32 bg-white relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50/50 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.25em] mb-6">
            Centre d'aide participant
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-none uppercase">
            DES RÉPONSES À <br /> <span className="gradient-text">VOS QUESTIONS</span>
          </h2>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={faq.id} 
                className={`glass border-transparent rounded-[2rem] transition-all duration-500 overflow-hidden ${
                  isOpen ? 'border-blue-100 shadow-2xl shadow-blue-500/5 bg-white' : 'hover:border-slate-100'
                }`}
              >
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-8 md:p-10 text-left transition-colors"
                >
                  <span className={`font-black text-xl md:text-2xl transition-colors pr-12 ${isOpen ? 'text-blue-600' : 'text-slate-900'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-50 text-slate-400'
                  }`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                
                <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-8 md:px-10 pb-10 text-slate-500 text-lg font-medium leading-relaxed max-w-3xl">
                    <div className="h-px w-full bg-slate-100 mb-8"></div>
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

