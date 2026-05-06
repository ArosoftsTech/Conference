
import React from 'react';
import { Menu, X, Ticket } from 'lucide-react';
import { AppState, UserInfo } from '../types';

interface NavbarProps {
  view: AppState['view'];
  user: UserInfo | null;
  isAdmin: boolean;
  onNavigate: (view: AppState['view']) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ view, user, isAdmin, onNavigate, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSectionClick = (sectionId: string) => {
    setIsOpen(false);
    
    const scroll = () => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    if (view !== 'HOME') {
      onNavigate('HOME');
      // On attend un court instant que le composant Home soit monté avant de scroller
      setTimeout(scroll, 100);
    } else {
      scroll();
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('HOME')}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg transform rotate-[-5deg]">
              <span className="font-black text-white text-base">CIA</span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 text-lg leading-tight uppercase tracking-tight">Conférence</span>
              <span className="font-bold text-blue-600 text-[10px] leading-tight uppercase tracking-wider">Success Life 2026</span>
            </div>
          </div>

          {/* Desktop Navigation Links (Centered) */}
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => handleSectionClick('hero')} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Accueil</button>
            <button onClick={() => handleSectionClick('speakers')} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Conférenciers</button>
            <button onClick={() => handleSectionClick('agenda')} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Programme</button>
            <button onClick={() => handleSectionClick('partners')} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Partenaires</button>
            <button onClick={() => handleSectionClick('faq')} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">FAQ</button>
            <button onClick={() => handleSectionClick('features')} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">Le Concept</button>

          </div>


          {/* Right Section: Login & Buy Button */}
          <div className="hidden md:flex items-center gap-6">
            {isAdmin && (
              <button 
                onClick={() => onNavigate(view === 'ADMIN' ? 'DASHBOARD' : 'ADMIN')} 
                className="text-xs font-bold text-blue-600 hover:text-white hover:bg-blue-600 transition-all uppercase tracking-widest border border-blue-200 bg-blue-50 px-4 py-2 rounded-xl"
              >
                {view === 'ADMIN' ? 'Espace Participant' : 'Espace Admin'}
              </button>
            )}
            <button 
              onClick={() => onNavigate(isAdmin && view !== 'ADMIN' ? 'ADMIN' : 'DASHBOARD')} 
              className="text-sm font-black text-slate-900 hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              {user ? user.firstName : 'Mon Compte'}
            </button>
            <button 
              onClick={() => onNavigate('PURCHASE')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl text-sm font-black transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95"
            >
              <Ticket size={16} /> RÉSERVER PASS
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 py-4 px-4 space-y-4">
          <button onClick={() => handleSectionClick('hero')} className="block w-full text-left text-slate-600 py-2">Accueil</button>
          <button onClick={() => handleSectionClick('speakers')} className="block w-full text-left text-slate-600 py-2">Intervenants</button>
          <button onClick={() => handleSectionClick('agenda')} className="block w-full text-left text-slate-600 py-2">Programme</button>
          <button onClick={() => handleSectionClick('partners')} className="block w-full text-left text-slate-600 py-2">Partenaires</button>
          <button onClick={() => handleSectionClick('faq')} className="block w-full text-left text-slate-600 py-2">FAQ</button>
          <button onClick={() => handleSectionClick('features')} className="block w-full text-left text-slate-600 py-2">À propos</button>
          <button onClick={() => { onNavigate('PURCHASE'); setIsOpen(false); }} className="block w-full text-left text-slate-600 py-2">Billetterie</button>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-4">
            {isAdmin && (
              <button onClick={() => { onNavigate(view === 'ADMIN' ? 'DASHBOARD' : 'ADMIN'); setIsOpen(false); }} className="text-blue-600 font-bold text-left w-full py-2 bg-blue-50 rounded-lg px-3 border border-blue-100">
                {view === 'ADMIN' ? 'Basculer vers Espace Participant' : 'Basculer vers Espace Admin'}
              </button>
            )}
            <button onClick={() => { onNavigate(isAdmin && view !== 'ADMIN' ? 'ADMIN' : 'DASHBOARD'); setIsOpen(false); }} className="text-slate-900 font-bold text-left">
              {user ? `Espace ${user.firstName}` : 'Connexion'}
            </button>
            <button onClick={() => { onNavigate('PURCHASE'); setIsOpen(false); }} className="bg-[#0056b3] text-white py-3 rounded-lg font-bold">Acheter mon ticket</button>
          </div>
        </div>
      )}
    </nav>
  );
};
