
import React, { useState } from 'react';
import { X, User, Mail, Phone, Users, Minus, Plus, Calendar } from 'lucide-react';
import { EVENT_DETAILS } from '../constants';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (data: any) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenoms: '',
    email: '',
    telephone: '',
    places: 1
  });

  if (!isOpen) return null;

  const handleIncrement = () => setFormData(prev => ({ ...prev, places: Math.min(10, prev.places + 1) }));
  const handleDecrement = () => setFormData(prev => ({ ...prev, places: Math.max(1, prev.places - 1) }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onConfirm) {
      onConfirm(formData);
    }
    alert(`Merci ${formData.prenoms} ! Votre réservation de ${formData.places} place(s) a été prise en compte.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-[500px] bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300">
        <div className="p-8 pb-4">
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-2xl font-bold text-slate-900">Réserver vos places</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Réservez vos places pour la conférence Success Life 2026 - 31 Janvier 2026
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <User size={14} className="text-slate-400" /> Nom
              </label>
              <input 
                type="text" required
                className="w-full bg-[#f8fafc] border border-slate-200 p-3.5 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
                placeholder="KOUASSI"
                value={formData.nom}
                onChange={e => setFormData({...formData, nom: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <User size={14} className="text-slate-400" /> Prénoms
              </label>
              <input 
                type="text" required
                className="w-full bg-[#f8fafc] border border-slate-200 p-3.5 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
                placeholder="Jean-Baptiste"
                value={formData.prenoms}
                onChange={e => setFormData({...formData, prenoms: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Mail size={14} className="text-slate-400" /> Email
            </label>
            <input 
              type="email" required
              className="w-full bg-[#f8fafc] border border-slate-200 p-3.5 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
              placeholder="jean.kouassi@email.com"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Phone size={14} className="text-slate-400" /> Téléphone
            </label>
            <input 
              type="tel" required
              className="w-full bg-[#f8fafc] border border-slate-200 p-3.5 rounded-xl outline-none focus:border-blue-500 transition-all text-sm"
              placeholder="07 XX XX XX XX"
              value={formData.telephone}
              onChange={e => setFormData({...formData, telephone: e.target.value})}
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Users size={14} className="text-slate-400" /> Nombre de places
            </label>
            <div className="flex items-center gap-8 pl-1">
              <button type="button" onClick={handleDecrement} className="w-10 h-10 rounded-xl bg-[#f8fafc] border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm"><Minus size={18} /></button>
              <span className="text-2xl font-black text-slate-900 w-6 text-center">{formData.places}</span>
              <button type="button" onClick={handleIncrement} className="w-10 h-10 rounded-xl bg-[#f8fafc] border border-slate-200 flex items-center justify-center text-slate-400 shadow-sm"><Plus size={18} /></button>
            </div>
          </div>

          <div className="bg-[#f0f7ff] p-6 rounded-3xl space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Événement</span>
              <span className="font-bold text-slate-900">Success Life 2026</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Places réservées</span>
              <span className="font-black text-[#0056b3]">{formData.places}</span>
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-4 bg-[#f8fafc] border border-slate-200 rounded-2xl font-bold text-slate-600 text-sm">Annuler</button>
            <button type="submit" className="flex-1 py-4 bg-[#0056b3] text-white rounded-2xl font-bold hover:bg-[#004494] flex items-center justify-center gap-2 shadow-lg shadow-blue-100 text-sm">
              <Calendar size={18} /> Réserver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
