
import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f8fafc] pt-20 pb-10 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/logo-cia.png" alt="CIA Logo" className="w-16 h-16 object-contain" />
              <span className="font-bold text-slate-900 text-lg leading-tight">
                Club des Investisseurs<br />Africains
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              Ensemble, préparons l'avenir et réussissons notre année 2026.
            </p>
          </div>

          {/* Useful Links */}
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900">Liens utiles</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li><a href="#" className="hover:text-[#0056b3] transition-colors">Accueil</a></li>
              <li><a href="#" className="hover:text-[#0056b3] transition-colors">Acheter un ticket</a></li>
              <li><a href="#" className="hover:text-[#0056b3] transition-colors">Mon espace</a></li>
              <li><a href="#" className="hover:text-[#0056b3] transition-colors">Conditions générales</a></li>
              <li><a href="#" className="hover:text-[#0056b3] transition-colors">Politique de confidentialité</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#0056b3]" />
                <span>07 788 059 51</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#0056b3]" />
                <span>contact@cia.ci</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-[#0056b3]" />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
            </ul>
          </div>

          {/* Payment Methods */}
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900">Moyens de paiement</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 text-xs font-bold border border-orange-100">Orange Money</span>
              <span className="px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-700 text-xs font-bold border border-yellow-100">MTN Money</span>
              <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">Moov Money</span>
              <span className="px-3 py-1.5 rounded-full bg-cyan-50 text-cyan-600 text-xs font-bold border border-cyan-100">Wave</span>
              <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-bold border border-green-100">USDT</span>
              <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-500 text-xs font-bold border border-blue-100">USDC</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 text-center">
          <p className="text-slate-500 text-sm">
            © 2025 Club des Investisseurs Africains. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};
