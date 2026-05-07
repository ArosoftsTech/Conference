
import React, { useState, useRef } from 'react';
import { 
  Ticket as TicketIcon, 
  Download, 
  Send, 
  Share2, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  ExternalLink, 
  User, 
  Shield, 
  ArrowLeft, 
  Lock, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  FileText,
  ImageIcon,
  MapPin
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { UserInfo, Ticket } from '../types';
import { EVENT_DETAILS } from '../constants';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface DashboardProps {
  user: UserInfo | null;
  tickets: Ticket[];
  onLogin: (user: UserInfo) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, tickets, onLogin }) => {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginSubmit = () => {
    setError(null);
    if (loginForm.email === 'admin@successlife.com') {
      if (loginForm.password === 'admin@123') {
        onLogin({ 
          firstName: 'Admin', 
          lastName: 'SuccessLife', 
          email: loginForm.email, 
          phone: '0700000000' 
        });
      } else {
        setError("Mot de passe incorrect.");
      }
      return;
    }
    if (loginForm.email && loginForm.password) {
      onLogin({ 
        firstName: 'Utilisateur', 
        lastName: 'Demo', 
        email: loginForm.email, 
        phone: '00000000' 
      });
    } else {
      setError("Veuillez remplir tous les champs.");
    }
  };

  const handleExport = async (format: 'jpg' | 'pdf') => {
    if (!activeTicket || !ticketRef.current) return;
    
    setIsExporting(true);
    try {
      await new Promise(r => setTimeout(r, 800));
      const canvas = await html2canvas(ticketRef.current, {
        scale: 3, // High quality
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      if (format === 'jpg') {
        const link = document.createElement('a');
        link.download = `Ticket-SuccessLife-${activeTicket.reference}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.95);
        link.click();
      } else {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('l', 'mm', [210, 84]); // Landscape ticket format
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 84);
        pdf.save(`Ticket-SuccessLife-${activeTicket.reference}.pdf`);
      }
    } catch (err) {
      console.error("Export error:", err);
      alert("Erreur lors de la génération.");
    } finally {
      setIsExporting(false);
    }
  };

  const shareWhatsApp = () => {
    if (!activeTicket) return;
    const text = `Voici mon ticket pour Success Life 2026 ! Réf: ${activeTicket.reference}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f8fafc] px-4 py-12">
        <div className="w-full max-w-lg bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-200 shadow-xl space-y-8 animate-in fade-in zoom-in duration-300">
          {!isRegistering ? (
            <>
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-900">Connexion</h2>
                <p className="text-slate-500 font-medium">Accédez à vos tickets Success Life 2026</p>
              </div>
              {error && <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 text-sm font-medium animate-in shake duration-300"><XCircle size={18} />{error}</div>}
              <div className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider ml-1">Email</label>
                    <input type="email" className="w-full bg-[#f8fafc] border border-slate-200 p-4 rounded-xl outline-none focus:border-blue-500 transition-all text-slate-700" value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} placeholder="votre@email.com" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider ml-1">Mot de passe</label>
                    <input type="password" name="password" className="w-full bg-[#f8fafc] border border-slate-200 p-4 rounded-xl outline-none focus:border-blue-500 transition-all text-slate-700" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} placeholder="••••••••" />
                 </div>
                 <button onClick={handleLoginSubmit} className="w-full bg-[#0056b3] py-4 rounded-2xl font-bold text-white hover:bg-[#004494] transition-all shadow-lg shadow-blue-200 text-lg">Se connecter</button>
                 <div className="text-center pt-2"><button onClick={() => setIsRegistering(true)} className="text-[#0056b3] font-bold hover:underline">Créer un compte</button></div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
               <h2 className="text-2xl font-black text-slate-900">Inscription</h2>
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input className="w-full bg-[#f8fafc] border p-3.5 rounded-xl" placeholder="Prénom" value={registerForm.firstName} onChange={e => setRegisterForm({...registerForm, firstName: e.target.value})} />
                    <input className="w-full bg-[#f8fafc] border p-3.5 rounded-xl" placeholder="Nom" value={registerForm.lastName} onChange={e => setRegisterForm({...registerForm, lastName: e.target.value})} />
                  </div>
                  <input className="w-full bg-[#f8fafc] border p-3.5 rounded-xl" placeholder="Email" value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} />
                  <input className="w-full bg-[#f8fafc] border p-3.5 rounded-xl" placeholder="Téléphone" value={registerForm.phone} onChange={e => setRegisterForm({...registerForm, phone: e.target.value})} />
                  <button onClick={() => onLogin({ firstName: registerForm.firstName, lastName: registerForm.lastName, email: registerForm.email, phone: registerForm.phone })} className="w-full bg-[#0056b3] py-4 rounded-2xl font-bold text-white shadow-lg shadow-blue-200">Créer mon compte</button>
                  <button onClick={() => setIsRegistering(false)} className="w-full text-slate-500 text-sm">Déjà un compte ? Connectez-vous</button>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">Espace Participant</h1>
          <p className="text-slate-400">Gérez vos accès pour Success Life 2026</p>
        </div>
        <div className="bg-white px-6 py-4 rounded-2xl border border-slate-200 flex items-center gap-4 shadow-sm">
           <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold">{user.firstName[0]}</div>
           <div><div className="font-bold text-sm">{user.firstName} {user.lastName}</div><div className="text-xs text-slate-500">{user.email}</div></div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
           <h2 className="text-2xl font-black flex items-center gap-2 text-slate-900"><TicketIcon size={24} className="text-[#0056b3]" /> Mes Billets</h2>
           {tickets.length === 0 ? (
             <div className="bg-white p-12 rounded-[2rem] border-dashed border-2 border-slate-200 text-center text-slate-500">Aucun ticket trouvé.</div>
           ) : (
             <div className="space-y-4">
               {tickets.map(ticket => (
                 <div key={ticket.id} onClick={() => setActiveTicket(ticket)} className={`p-6 rounded-2xl border transition-all cursor-pointer ${activeTicket?.id === ticket.id ? 'border-[#0056b3] bg-blue-50/30' : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'}`}>
                   <div className="flex justify-between items-center">
                     <div>
                       <div className="text-xs font-black text-[#0056b3] uppercase mb-1">{ticket.reference}</div>
                       <div className="text-lg font-bold text-slate-900">Pass Conference x{ticket.quantity}</div>
                       <div className="text-xs text-slate-500">Acheté le {ticket.purchaseDate}</div>
                     </div>
                     <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${ticket.status === 'VALIDATED' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                       {ticket.status === 'VALIDATED' ? 'Validé' : 'En attente'}
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>

        <div className="lg:col-span-1">
          {activeTicket ? (
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-right duration-500">
                 <div className={`p-6 text-white text-center font-black transition-colors ${
                   activeTicket.status === 'VALIDATED' ? 'bg-blue-600' : 
                   activeTicket.status === 'REJECTED' ? 'bg-red-600' : 
                   activeTicket.status === 'USED' ? 'bg-slate-900' : 'bg-slate-400'
                 }`}>
                   {activeTicket.status === 'VALIDATED' ? 'BILLET PRÊT' : 
                    activeTicket.status === 'REJECTED' ? 'PAIEMENT REJETÉ' :
                    activeTicket.status === 'USED' ? 'BILLET UTILISÉ' : 'EN ATTENTE DE VALIDATION'}
                 </div>
                 
                 <div className="p-8 flex flex-col items-center gap-6">
                    <div className={`p-4 bg-white rounded-3xl border shadow-inner ${activeTicket.status === 'VALIDATED' ? 'border-blue-100' : 'border-slate-100 opacity-50'}`}>
                       <QRCodeSVG value={activeTicket.qrCodeData} size={180} />
                    </div>
                    <div className="text-center space-y-1">
                       <div className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{activeTicket.reference}</div>
                       <div className="text-sm font-bold text-blue-600 uppercase tracking-widest">{activeTicket.ownerName}</div>
                    </div>

                    {activeTicket.status === 'REJECTED' && (
                      <div className="bg-red-50 p-4 rounded-2xl border border-red-100 text-red-600 text-xs font-bold text-center leading-relaxed">
                        Votre paiement a été rejeté. Veuillez contacter le support au {EVENT_DETAILS.phone || '07 78 80 59 51'}.
                      </div>
                    )}
                    
                    {(activeTicket.status === 'VALIDATED' || activeTicket.status === 'USED') && (
                      <div className="w-full grid grid-cols-2 gap-3">
                         <button disabled={isExporting} onClick={() => handleExport('pdf')} className="flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all disabled:opacity-50"><FileText size={16} /> PDF</button>
                         <button disabled={isExporting} onClick={() => handleExport('jpg')} className="flex items-center justify-center gap-2 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-slate-100 hover:border-slate-200 transition-all disabled:opacity-50"><ImageIcon size={16} /> Image</button>
                      </div>
                    )}
                    <button onClick={shareWhatsApp} className="w-full py-4 bg-green-50 text-green-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-100 transition-all"><Share2 size={16} /> Partager</button>
                 </div>
              </div>

              {/* HIGH FIDELITY EXPORT TEMPLATE */}
              <div id="ticket-to-export" className="fixed left-[-9999px]">
                <div ref={ticketRef} style={{ width: '1000px', height: '400px' }} className="relative bg-white overflow-hidden flex font-sans">
                   {/* Decorative Gradients */}
                   <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 rounded-full blur-[80px]"></div>
                   <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[60px]"></div>
                   
                   {/* Main Content Area */}
                   <div className="relative z-10 w-[68%] h-full p-12 flex flex-col justify-between">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                           <img src="/logo-cia.png" alt="CIA Logo" className="w-16 h-16 object-contain" />
                           <div className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{EVENT_DETAILS.organization}</div>
                        </div>
                        
                        <div className="space-y-1">
                           <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-md mb-2">{EVENT_DETAILS.category}</div>
                           <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase">{EVENT_DETAILS.title}</h1>
                           <div className="text-xl font-bold text-blue-600 uppercase tracking-tight">{EVENT_DETAILS.subtitle}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-8 border-t border-slate-100 pt-8">
                         <div className="space-y-1">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Heure</div>
                            <div className="text-xl font-black text-slate-900">{EVENT_DETAILS.date} • {EVENT_DETAILS.time}</div>
                         </div>
                         <div className="col-span-2 space-y-1">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lieu</div>
                            <div className="text-xl font-black text-slate-900">{EVENT_DETAILS.venue}</div>
                         </div>
                      </div>

                      {/* Bottom Footer */}
                      <div className="flex items-center justify-between text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                         <div className="flex items-center gap-2"><Phone size={12} className="text-blue-600" /> 07 78 80 59 51</div>
                         <div>Edition 2026 • Succès Garanti</div>
                      </div>
                   </div>

                   {/* Vertical Separator (Dashed) */}
                   <div className="h-full w-px border-l-2 border-dashed border-slate-200 relative">
                      <div className="absolute top-[-20px] left-[-20px] w-10 h-10 bg-slate-100 rounded-full shadow-inner"></div>
                      <div className="absolute bottom-[-20px] left-[-20px] w-10 h-10 bg-slate-100 rounded-full shadow-inner"></div>
                   </div>

                   {/* Right QR Section */}
                   <div className="relative z-10 w-[32%] h-full bg-slate-50/50 flex flex-col items-center justify-center p-10">
                      <div className="w-[200px] h-[200px] bg-white p-4 rounded-3xl border-4 border-slate-900 shadow-2xl flex items-center justify-center relative mb-6">
                         <QRCodeSVG value={activeTicket.qrCodeData} size={150} />
                         <div className="absolute -bottom-3 bg-slate-900 text-white px-4 py-1 rounded-full text-[9px] font-black tracking-widest uppercase shadow-lg">QR PASS</div>
                      </div>

                      <div className="text-center space-y-1">
                         <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Bénéficiaire</div>
                         <div className="text-lg font-black text-slate-900 truncate max-w-[180px] uppercase">{activeTicket.ownerName}</div>
                         <div className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-2 inline-block">{activeTicket.reference}</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="sticky top-24 bg-white rounded-[2.5rem] border border-slate-200 border-dashed p-16 text-center text-slate-400 flex flex-col items-center gap-4">
               <ExternalLink size={32} />
               <p className="font-bold text-sm">Sélectionnez un ticket pour l'afficher et le télécharger.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
