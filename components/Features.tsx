
import React from 'react';
import { Target, TrendingUp, Users, CheckCircle2 } from 'lucide-react';

export const Features: React.FC = () => {
  const points = [
    {
      title: "Objectifs clairs",
      description: "Apprenez à définir et atteindre vos objectifs pour 2026",
      icon: <Target className="text-[#0056b3]" size={24} />,
    },
    {
      title: "Stratégies de croissance",
      description: "Découvrez les meilleures pratiques d'investissement",
      icon: <TrendingUp className="text-[#0056b3]" size={24} />,
    },
    {
      title: "Networking",
      description: "Rencontrez des investisseurs et entrepreneurs africains",
      icon: <Users className="text-[#0056b3]" size={24} />,
    },
  ];

  const inclusions = [
    "Accès à toutes les conférences",
    "Pause café et déjeuner inclus",
    "Accès au groupe privé CIA",
    "Documentation exclusive",
    "Certificat de participation",
    "Support post-événement",
  ];

  return (
    <section id="features" className="py-24 bg-[#f8fafc]">
      {/* Pourquoi participer section */}
      <div className="max-w-7xl mx-auto px-4 text-center mb-16">
        <h2 className="text-4xl font-bold text-[#0f172a] mb-4">
          Pourquoi participer ?
        </h2>
        <p className="text-slate-500 text-lg">
          Une journée intensive pour transformer votre vision en réalité
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {points.map((point, i) => (
            <div 
              key={i} 
              className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-6 transition-all hover:shadow-md"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#f0f7ff] flex items-center justify-center">
                {point.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">{point.title}</h3>
                <p className="text-slate-500 leading-relaxed">{point.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ce qui est inclus section */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-[#f0f7ff] rounded-[2rem] border border-blue-100/50 p-10 md:p-14 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-10">
            Ce qui est inclus dans votre ticket
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            {inclusions.map((item, i) => (
              <div key={i} className="flex items-center gap-4 text-left">
                <div className="flex-shrink-0">
                  <CheckCircle2 size={24} className="text-[#0056b3]" />
                </div>
                <span className="text-lg font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
