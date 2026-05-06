import React, { useState, useRef } from 'react';
import { 
  ShieldCheck, RefreshCw, Search, CheckCircle, XCircle, 
  Download, QrCode, User, Mail, Phone, Calendar, Clock, 
  MapPin, Plus, Trash2, Edit, Ticket as TicketIcon, 
  DollarSign, TrendingUp, Filter, FileText, ImageIcon,
  ExternalLink, ChevronRight, Eye, CheckCircle2, CreditCard, Edit2, Users, Camera
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';
import { Ticket, Speaker, Session, Partner, FAQ } from '../types';
import { db } from '../lib/db';

interface AdminDashboardProps {
  tickets: Ticket[];
  onUpdateTickets: (tickets: Ticket[]) => void;
  speakers: Speaker[];
  onUpdateSpeakers: (speakers: Speaker[]) => void;
  sessions: Session[];
  onUpdateSessions: (sessions: Session[]) => void;
  partners: Partner[];
  onUpdatePartners: (partners: Partner[]) => void;
  onRefresh: () => Promise<void>;
}

const generateUUID = () => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  tickets, onUpdateTickets, 
  speakers, onUpdateSpeakers, 
  sessions, onUpdateSessions,
  partners, onUpdatePartners,
  onRefresh 
}) => {
  const [tab, setTab] = useState<'OVERVIEW' | 'TICKETS' | 'SCANNER' | 'SPEAKERS' | 'PLANNING' | 'PARTNERS'>('OVERVIEW');
  const [search, setSearch] = useState('');
  const [scannerActive, setScannerActive] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const speakerFileInputRef = useRef<HTMLInputElement>(null);
  const partnerFileInputRef = useRef<HTMLInputElement>(null);

  // --- Speakers Form ---
  const [showSpeakerForm, setShowSpeakerForm] = useState(false);
  const [speakerForm, setSpeakerForm] = useState<Partial<Speaker>>({
    name: '', role: '', imageUrl: '', orderIndex: speakers.length
  });

  // --- Sessions Form ---
  const [showSessionForm, setShowSessionForm] = useState(false);
  const [sessionForm, setSessionForm] = useState<Partial<Session>>({
    title: '', description: '', startTime: '', endTime: '', location: '', type: 'KEYNOTE'
  });

  // --- Partners Form ---
  const [showPartnerForm, setShowPartnerForm] = useState(false);
  const [partnerForm, setPartnerForm] = useState<Partial<Partner>>({
    name: '', logoUrl: '', tier: 'GOLD', orderIndex: partners.length
  });

  const totalRevenue = tickets.reduce((acc, t) => acc + (t.status === 'VALIDATED' || t.status === 'USED' ? t.totalPrice : 0), 0);
  const potentialRevenue = tickets.reduce((acc, t) => acc + t.totalPrice, 0);
  const totalTicketsSold = tickets.reduce((acc, t) => acc + t.quantity, 0);
  const validatedTicketsCount = tickets.filter(t => t.status === 'VALIDATED' || t.status === 'USED').length;
  const pendingTicketsCount = tickets.filter(t => t.status === 'PENDING').length;

  // Data for Revenue over time (Mocked based on purchase dates)
  const revenueByDate = tickets.reduce((acc: any, t) => {
    const date = t.purchaseDate;
    if (!acc[date]) acc[date] = 0;
    if (t.status === 'VALIDATED' || t.status === 'USED') acc[date] += t.totalPrice;
    return acc;
  }, {});

  const revenueChartData = Object.keys(revenueByDate).sort().map(date => ({
    date,
    amount: revenueByDate[date]
  }));

  const statusData = [
    { name: 'Validés', value: validatedTicketsCount, color: '#10b981' },
    { name: 'En attente', value: pendingTicketsCount, color: '#f59e0b' },
    { name: 'Rejetés', value: tickets.filter(t => t.status === 'REJECTED').length, color: '#ef4444' },
  ];

  const paymentData = [
    { name: 'Mobile Money', value: tickets.filter(t => t.paymentMethod === 'MOBILE_MONEY').length },
    { name: 'Crypto', value: tickets.filter(t => t.paymentMethod === 'CRYPTO').length },
  ];

  const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899'];

  const filteredTickets = tickets.filter(t => 
    t.ownerName.toLowerCase().includes(search.toLowerCase()) || 
    t.reference.toLowerCase().includes(search.toLowerCase()) ||
    t.ownerEmail.toLowerCase().includes(search.toLowerCase())
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const handleValidateTicket = async (ticketId: string) => {
    await db.updateTicketStatus(ticketId, 'VALIDATED');
    const updated = await db.getTickets();
    onUpdateTickets(updated);
    if (selectedTicket?.id === ticketId) setSelectedTicket({...selectedTicket, status: 'VALIDATED'});
  };

  const handleRejectTicket = async (ticketId: string) => {
    if (!window.confirm("Voulez-vous rejeter ce ticket ?")) return;
    await db.updateTicketStatus(ticketId, 'REJECTED');
    const updated = await db.getTickets();
    onUpdateTickets(updated);
    if (selectedTicket?.id === ticketId) setSelectedTicket({...selectedTicket, status: 'REJECTED'});
  };

  const exportTicketsCSV = () => {
    const headers = ['Référence', 'Nom', 'Email', 'Téléphone', 'Quantité', 'Prix Total', 'Statut', 'Date'];
    const rows = tickets.map(t => [
      t.reference,
      t.ownerName,
      t.ownerEmail,
      `'${t.senderPhone || ''}`, // Force string in Excel
      t.quantity,
      t.totalPrice,
      t.status,
      t.purchaseDate
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Tickets-SuccessLife-2026.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const handleStartScanner = async () => {
    setScannerActive(true);
    setScanResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setScanResult({ success: false, message: "Accès caméra refusé." });
    }
  };

  const handleStopScanner = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(track => track.stop());
    setScannerActive(false);
  };

  const simulateScan = async () => {
    const randomTicket = tickets.find(t => t.status === 'VALIDATED') || tickets[0];
    if (randomTicket) {
      try {
        const decoded = JSON.parse(randomTicket.qrCodeData);
        if (randomTicket.status === 'USED') {
           setScanResult({ success: false, message: "Ticket DÉJÀ UTILISÉ !", data: decoded });
        } else if (randomTicket.status === 'PENDING') {
           setScanResult({ success: false, message: "Paiement NON VALIDÉ !", data: decoded });
        } else {
           await db.updateTicketStatus(randomTicket.id, 'USED');
           const updated = await db.getTickets();
           onUpdateTickets(updated);
           setScanResult({ success: true, message: "Accès AUTORISÉ !", data: decoded });
        }
      } catch (e) {
        setScanResult({ success: false, message: "QR Code invalide.", data: { ref: randomTicket.reference, nom: randomTicket.ownerName } });
      }
    }
  };

  // --- SPEAKERS HANDLERS ---
  const handleSpeakerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSpeakerForm({ ...speakerForm, imageUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSpeaker = async () => {
    if (!speakerForm.name || !speakerForm.role || !speakerForm.imageUrl) return alert("Champs manquants");
    await db.saveSpeaker({
      id: speakerForm.id || generateUUID(),
      name: speakerForm.name!,
      role: speakerForm.role!,
      imageUrl: speakerForm.imageUrl!,
      orderIndex: speakerForm.orderIndex || 0
    });
    onUpdateSpeakers(await db.getSpeakers());
    setShowSpeakerForm(false);
  };

  const handleDeleteSpeaker = async (id: string) => {
    if (window.confirm("Supprimer ?")) {
      await db.deleteSpeaker(id);
      onUpdateSpeakers(await db.getSpeakers());
    }
  };

  // --- SESSIONS HANDLERS ---
  const handleSaveSession = async () => {
    if (!sessionForm.title || !sessionForm.startTime || !sessionForm.endTime) return alert("Champs manquants");
    await db.saveSession({
      id: sessionForm.id || generateUUID(),
      title: sessionForm.title!,
      description: sessionForm.description || '',
      startTime: sessionForm.startTime!,
      endTime: sessionForm.endTime!,
      location: sessionForm.location || '',
      speakerId: sessionForm.speakerId,
      type: sessionForm.type as any
    });
    onUpdateSessions(await db.getSessions());
    setShowSessionForm(false);
  };

  const handleDeleteSession = async (id: string) => {
    if (window.confirm("Supprimer cette session ?")) {
      await db.deleteSession(id);
      onUpdateSessions(await db.getSessions());
    }
  };

  // --- PARTNERS HANDLERS ---
  const handlePartnerLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPartnerForm({ ...partnerForm, logoUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const handleSavePartner = async () => {
    if (!partnerForm.name || !partnerForm.logoUrl) return alert("Champs manquants");
    await db.savePartner({
      id: partnerForm.id || generateUUID(),
      name: partnerForm.name!,
      logoUrl: partnerForm.logoUrl!,
      websiteUrl: partnerForm.websiteUrl,
      tier: partnerForm.tier as any,
      orderIndex: partnerForm.orderIndex || 0
    });
    onUpdatePartners(await db.getPartners());
    setShowPartnerForm(false);
  };

  const handleDeletePartner = async (id: string) => {
    if (window.confirm("Supprimer ce partenaire ?")) {
      await db.deletePartner(id);
      onUpdatePartners(await db.getPartners());
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none uppercase italic">DATA HUB <span className="text-blue-600">2026</span></h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Analytique & Gestion des opérations</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2 font-bold text-sm disabled:opacity-50"
          >
            <RefreshCw size={18} className={`${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline uppercase tracking-widest text-[10px]">Actualiser</span>
          </button>
          
          <div className="flex bg-slate-900 p-1 rounded-2xl shadow-xl overflow-x-auto max-w-[calc(100vw-2rem)]">
            {[
              { id: 'OVERVIEW', label: 'ANALYTIQUE' },
              { id: 'TICKETS', label: `TICKETS (${pendingTicketsCount})` },
              { id: 'SPEAKERS', label: 'INTERVENANTS' },
              { id: 'PLANNING', label: 'AGENDA' },
              { id: 'PARTNERS', label: 'SPONSORS' },
              { id: 'SCANNER', label: 'CHECK-IN' }
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setTab(t.id as any)} 
                className={`px-5 py-3 rounded-xl text-[10px] font-black whitespace-nowrap transition-all tracking-widest ${tab === t.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {tab === 'OVERVIEW' && (
        <div className="space-y-8 animate-in fade-in duration-500">
           {/* KPI Cards */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="p-4 bg-blue-50 w-fit rounded-2xl text-blue-600"><TicketIcon size={24} /></div>
                    <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Tickets</div>
                 </div>
                 <div>
                    <div className="text-5xl font-black text-slate-900">{totalTicketsSold}</div>
                    <div className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">Volume total vendu</div>
                 </div>
              </div>
              
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="p-4 bg-green-50 w-fit rounded-2xl text-green-600"><DollarSign size={24} /></div>
                    <div className="text-[10px] font-black text-green-600 uppercase tracking-widest">Revenus</div>
                 </div>
                 <div>
                    <div className="text-4xl font-black text-slate-900">{totalRevenue.toLocaleString()} F</div>
                    <div className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">Caisse encaissée (Validé)</div>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="p-4 bg-purple-50 w-fit rounded-2xl text-purple-600"><TrendingUp size={24} /></div>
                    <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Potentiel</div>
                 </div>
                 <div>
                    <div className="text-4xl font-black text-slate-900">{potentialRevenue.toLocaleString()} F</div>
                    <div className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">Ventes totales (Pendantes incl.)</div>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="p-4 bg-amber-50 w-fit rounded-2xl text-amber-600"><Clock size={24} /></div>
                    <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest">A Traiter</div>
                 </div>
                 <div>
                    <div className="text-5xl font-black text-slate-900">{pendingTicketsCount}</div>
                    <div className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">Paiements en attente</div>
                 </div>
              </div>
           </div>

           {/* Charts Section */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
                 <div className="flex items-center justify-between mb-10">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Courbe de croissance</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Revenus cumulés par jour</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl text-slate-400"><TrendingUp size={20} /></div>
                 </div>
                 <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueChartData}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 700, fill: '#94a3b8'}} dx={-10} />
                        <Tooltip 
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}}
                          itemStyle={{color: '#3b82f6'}}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl">
                   <div className="flex items-center justify-between mb-8">
                      <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">État des validations</h3>
                      <div className="flex gap-2">
                        {statusData.map(s => (
                          <div key={s.name} className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full" style={{backgroundColor: s.color}}></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase">{s.name}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                   <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={statusData} layout="vertical">
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" hide />
                          <Tooltip cursor={{fill: 'transparent'}} />
                          <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={32}>
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Paiements</h4>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={paymentData} innerRadius={35} outerRadius={50} paddingAngle={8} dataKey="value">
                            {paymentData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col justify-center items-center text-center">
                    <div className="text-3xl font-black text-blue-600">
                      {totalTicketsSold > 0 ? Math.round((validatedTicketsCount / tickets.length) * 100) : 0}%
                    </div>
                    <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 leading-tight">Taux de<br/>Validation</div>
                  </div>
                </div>
              </div>
           </div>

           {/* Recent Activity Table (Compact) */}
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Flux de transactions récent</h3>
                 <button onClick={() => setTab('TICKETS')} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">Voir tout</button>
              </div>
              <div className="space-y-4">
                 {tickets.slice(0, 5).map(t => (
                   <div key={t.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-50 hover:border-blue-100 transition-all group cursor-pointer" onClick={() => { setSelectedTicket(t); setTab('TICKETS'); }}>
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-xs ${t.status === 'VALIDATED' ? 'bg-green-500' : 'bg-amber-500'}`}>
                          {t.ownerName.charAt(0)}
                        </div>
                        <div>
                           <div className="font-black text-slate-900 text-sm uppercase">{t.ownerName}</div>
                           <div className="text-[10px] text-slate-400 font-bold uppercase">{t.purchaseDate} • {t.paymentMethod}</div>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="font-black text-slate-900">{t.totalPrice.toLocaleString()} F</div>
                         <div className={`text-[9px] font-black uppercase tracking-widest ${t.status === 'VALIDATED' ? 'text-green-500' : 'text-amber-500'}`}>{t.status}</div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
      {tab === 'TICKETS' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="relative w-full md:w-96">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input type="text" placeholder="Rechercher (Nom, Réf, Email)..." className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 rounded-xl outline-none shadow-sm" value={search} onChange={e => setSearch(e.target.value)} />
             </div>
             <button onClick={exportTicketsCSV} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg"><FileText size={18} /> Exporter CSV</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full">
                   <thead>
                      <tr className="text-slate-400 text-[10px] font-black uppercase text-left border-b border-slate-100 bg-slate-50/50"><th className="p-6">Référence</th><th className="p-6">Client</th><th className="p-6">Status</th><th className="p-6 text-right">Détails</th></tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {filteredTickets.map(t => (
                        <tr key={t.id} className={`group hover:bg-slate-50/50 cursor-pointer transition-colors ${selectedTicket?.id === t.id ? 'bg-blue-50/50' : ''}`} onClick={() => setSelectedTicket(t)}>
                           <td className="p-6 font-mono font-bold text-blue-600">{t.reference}</td>
                           <td className="p-6">
                              <div className="font-bold text-slate-900">{t.ownerName}</div>
                              <div className="text-[10px] text-slate-400 font-medium">{t.ownerEmail}</div>
                           </td>
                           <td className="p-6">
                              <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${
                                t.status === 'VALIDATED' ? 'bg-green-100 text-green-600' : 
                                t.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 
                                t.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                'bg-slate-100 text-slate-500'
                              }`}>{t.status}</span>
                           </td>
                           <td className="p-6 text-right"><button className="p-2 text-slate-400 group-hover:text-blue-600 transition-colors"><Eye size={18} /></button></td>
                        </tr>
                      ))}
                   </tbody>
                 </table>
               </div>
            </div>
            <div className="lg:col-span-1">
              {selectedTicket ? (
                <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in slide-in-from-right duration-300">
                   <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="font-black text-xs uppercase tracking-widest text-slate-500">Détails du Billet</h3>
                      <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600"><XCircle size={18} /></button>
                   </div>
                   <div className="p-8 space-y-8">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner"><User size={28} /></div>
                         <div><div className="text-lg font-black text-slate-900 leading-none">{selectedTicket.ownerName}</div><div className="text-xs text-slate-500 font-medium mt-1">{selectedTicket.ownerEmail}</div></div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Quantité</div>
                            <div className="text-xl font-black text-slate-900">{selectedTicket.quantity} Pass</div>
                         </div>
                         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Montant</div>
                            <div className="text-xl font-black text-[#0056b3]">{selectedTicket.totalPrice.toLocaleString()} F</div>
                         </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex items-center gap-3 text-slate-700">
                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600"><Phone size={16} /></div>
                            <div><div className="text-xs font-black">{selectedTicket.senderPhone || 'N/A'}</div><div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">N° Expédition</div></div>
                         </div>
                         <div className="flex items-center gap-3 text-slate-700">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600"><CreditCard size={16} /></div>
                            <div><div className="text-xs font-black">{selectedTicket.paymentMethod}</div><div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Méthode</div></div>
                         </div>
                      </div>

                      {selectedTicket.paymentScreenshot && (
                        <div className="space-y-3">
                           <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Preuve de paiement</div>
                           <div className="relative group rounded-2xl overflow-hidden border-2 border-slate-100">
                              <img src={selectedTicket.paymentScreenshot} alt="Preuve" className="w-full h-auto" />
                              <a href={selectedTicket.paymentScreenshot} download={`Proof-${selectedTicket.reference}.png`} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-bold transition-opacity"><ImageIcon size={24} /></a>
                           </div>
                        </div>
                      )}

                      {selectedTicket.status === 'PENDING' && (
                        <div className="flex gap-4">
                           <button onClick={() => handleRejectTicket(selectedTicket.id)} className="flex-1 bg-white border border-red-200 text-red-600 py-4 rounded-xl font-bold hover:bg-red-50 transition-colors">Rejeter</button>
                           <button onClick={() => handleValidateTicket(selectedTicket.id)} className="flex-[2] bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 flex items-center justify-center gap-2"><CheckCircle2 size={20} /> Valider</button>
                        </div>
                      )}

                      {selectedTicket.status === 'VALIDATED' && (
                        <div className="p-4 bg-green-50 text-green-700 rounded-xl text-center font-bold flex items-center justify-center gap-2 border border-green-100">
                           <CheckCircle2 size={18} /> Billet prêt & validé
                        </div>
                      )}

                      {selectedTicket.status === 'REJECTED' && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-bold flex items-center justify-center gap-2 border border-red-100">
                           <XCircle size={18} /> Paiement Rejeté
                        </div>
                      )}
                   </div>
                </div>
              ) : <div className="sticky top-24 bg-white rounded-3xl border border-slate-200 border-dashed p-16 text-center text-slate-400 flex flex-col items-center gap-4 animate-in fade-in"><Eye size={48} /><p className="font-bold text-sm">Sélectionnez un ticket dans la liste<br/>pour voir les détails du paiement.</p></div>}
            </div>
          </div>
        </div>
      )}

      {tab === 'SPEAKERS' && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900"><Users size={24} className="text-blue-600" /> Intervenants</h2>
             <button onClick={() => { setSpeakerForm({ name: '', role: '', imageUrl: '', orderIndex: speakers.length }); setShowSpeakerForm(true); }} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all"><Plus size={20} /> Ajouter</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {speakers.map(speaker => (
              <div key={speaker.id} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm group hover:shadow-md transition-all">
                <div className="aspect-[4/5] bg-slate-100 rounded-xl overflow-hidden relative">
                  <img src={speaker.imageUrl} alt={speaker.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                    <button onClick={() => { setSpeakerForm(speaker); setShowSpeakerForm(true); }} className="p-3 bg-white rounded-full text-blue-600 hover:scale-110"><Edit2 size={20} /></button>
                    <button onClick={() => handleDeleteSpeaker(speaker.id)} className="p-3 bg-white rounded-full text-red-600 hover:scale-110"><Trash2 size={20} /></button>
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 uppercase tracking-tight">{speaker.name}</h4>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{speaker.role}</p>
              </div>
            ))}
          </div>
          {showSpeakerForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowSpeakerForm(false)} />
              <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                 <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">{speakerForm.id ? 'Modifier' : 'Ajouter'} Intervenant</h3>
                 <div className="space-y-5">
                    <div onClick={() => speakerFileInputRef.current?.click()} className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-[#f8fafc] flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 overflow-hidden relative">
                       {speakerForm.imageUrl ? <img src={speakerForm.imageUrl} className="w-full h-full object-cover" /> : <><ImageIcon size={24} className="text-slate-300" /><p className="text-xs font-black uppercase text-slate-400 mt-2">Photo de l'intervenant</p></>}
                    </div>
                    <input type="file" ref={speakerFileInputRef} className="hidden" accept="image/*" onChange={handleSpeakerImageUpload} />
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold outline-none focus:border-blue-600 transition-all" placeholder="Nom Complet" value={speakerForm.name} onChange={e => setSpeakerForm({...speakerForm, name: e.target.value})} />
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-xl font-bold outline-none focus:border-blue-600 transition-all" placeholder="Rôle / Titre" value={speakerForm.role} onChange={e => setSpeakerForm({...speakerForm, role: e.target.value})} />
                    <div className="flex gap-4 pt-4">
                       <button onClick={() => setShowSpeakerForm(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest">Annuler</button>
                       <button onClick={handleSaveSpeaker} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-200">Enregistrer</button>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'PLANNING' && (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900"><Clock size={24} className="text-blue-600" /> Agenda de la Conférence</h2>
              <button onClick={() => { setSessionForm({ title: '', description: '', startTime: '', endTime: '', location: '', type: 'KEYNOTE' }); setShowSessionForm(true); }} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"><Plus size={20} /> Ajouter Session</button>
           </div>
           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                   <tr className="text-slate-400 text-xs uppercase text-left border-b border-slate-100"><th className="p-6">Heure</th><th className="p-6">Session</th><th className="p-6">Type</th><th className="p-6 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {sessions.map(s => (
                     <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-6">
                           <div className="font-black text-blue-600">{new Date(s.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                           <div className="text-[10px] text-slate-400 uppercase font-bold">Fin à {new Date(s.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                        </td>
                        <td className="p-6">
                           <div className="font-bold text-slate-900">{s.title}</div>
                           <div className="text-xs text-slate-500 truncate max-w-xs">{s.description}</div>
                        </td>
                        <td className="p-6">
                           <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${s.type === 'KEYNOTE' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>{s.type}</span>
                        </td>
                        <td className="p-6 text-right">
                           <div className="flex justify-end gap-2">
                              <button onClick={() => { setSessionForm(s); setShowSessionForm(true); }} className="p-2 text-slate-400 hover:text-blue-600"><Edit2 size={16} /></button>
                              <button onClick={() => handleDeleteSession(s.id)} className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
              </table>
           </div>
           {showSessionForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowSessionForm(false)} />
              <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                 <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Gérer la Session</h3>
                 <div className="space-y-4">
                    <input type="text" className="w-full bg-slate-50 border p-4 rounded-xl font-bold" placeholder="Titre de la session" value={sessionForm.title} onChange={e => setSessionForm({...sessionForm, title: e.target.value})} />
                    <textarea className="w-full bg-slate-50 border p-4 rounded-xl font-medium" placeholder="Description" rows={3} value={sessionForm.description} onChange={e => setSessionForm({...sessionForm, description: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                       <div><label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Début</label><input type="datetime-local" className="w-full bg-slate-50 border p-3 rounded-xl text-sm" value={sessionForm.startTime} onChange={e => setSessionForm({...sessionForm, startTime: e.target.value})} /></div>
                       <div><label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Fin</label><input type="datetime-local" className="w-full bg-slate-50 border p-3 rounded-xl text-sm" value={sessionForm.endTime} onChange={e => setSessionForm({...sessionForm, endTime: e.target.value})} /></div>
                    </div>
                    <input type="text" className="w-full bg-slate-50 border p-4 rounded-xl text-sm" placeholder="Lieu (ex: Salle B)" value={sessionForm.location} onChange={e => setSessionForm({...sessionForm, location: e.target.value})} />
                    <select className="w-full bg-slate-50 border p-4 rounded-xl text-sm font-bold" value={sessionForm.type} onChange={e => setSessionForm({...sessionForm, type: e.target.value as any})}>
                       <option value="KEYNOTE">Keynote</option>
                       <option value="WORKSHOP">Atelier</option>
                       <option value="PANEL">Panel</option>
                       <option value="BREAK">Pause / Networking</option>
                    </select>
                    <div className="flex gap-4 pt-4">
                       <button onClick={() => setShowSessionForm(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest">Annuler</button>
                       <button onClick={handleSaveSession} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Enregistrer</button>
                    </div>
                 </div>
              </div>
            </div>
           )}
        </div>
      )}

      {tab === 'PARTNERS' && (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-900"><TrendingUp size={24} className="text-blue-600" /> Sponsors & Partenaires</h2>
              <button onClick={() => { setPartnerForm({ name: '', logoUrl: '', tier: 'GOLD', orderIndex: partners.length }); setShowPartnerForm(true); }} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg"><Plus size={20} /> Ajouter</button>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
             {partners.map(p => (
               <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-200 group relative text-center">
                  <div className="h-20 flex items-center justify-center mb-2"><img src={p.logoUrl} className="max-h-full max-w-full object-contain" /></div>
                  <div className="text-[10px] font-black uppercase text-blue-600">{p.tier}</div>
                  <div className="absolute inset-0 bg-white/90 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity rounded-2xl">
                     <button onClick={() => { setPartnerForm(p); setShowPartnerForm(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-full"><Edit2 size={14} /></button>
                     <button onClick={() => handleDeletePartner(p.id)} className="p-2 bg-red-50 text-red-600 rounded-full"><Trash2 size={14} /></button>
                  </div>
               </div>
             ))}
           </div>
           {showPartnerForm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowPartnerForm(false)} />
              <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
                 <h3 className="text-2xl font-black mb-6 uppercase tracking-tight">Gérer le Partenaire</h3>
                 <div className="space-y-4">
                    <div onClick={() => partnerFileInputRef.current?.click()} className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-[#f8fafc] flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                       {partnerForm.logoUrl ? <img src={partnerForm.logoUrl} className="max-h-full object-contain p-4" /> : <><ImageIcon size={24} className="text-slate-300" /><p className="text-[10px] font-black uppercase text-slate-400 mt-2">Logo du partenaire</p></>}
                    </div>
                    <input type="file" ref={partnerFileInputRef} className="hidden" accept="image/*" onChange={handlePartnerLogoUpload} />
                    <input type="text" className="w-full bg-slate-50 border p-4 rounded-xl font-bold" placeholder="Nom du partenaire" value={partnerForm.name} onChange={e => setPartnerForm({...partnerForm, name: e.target.value})} />
                    <input type="text" className="w-full bg-slate-50 border p-4 rounded-xl text-sm" placeholder="Lien vers site web (Optionnel)" value={partnerForm.websiteUrl} onChange={e => setPartnerForm({...partnerForm, websiteUrl: e.target.value})} />
                    <select className="w-full bg-slate-50 border p-4 rounded-xl text-sm font-bold" value={partnerForm.tier} onChange={e => setPartnerForm({...partnerForm, tier: e.target.value as any})}>
                       <option value="PLATINUM">Platinum</option>
                       <option value="GOLD">Gold</option>
                       <option value="SILVER">Silver</option>
                       <option value="BRONZE">Bronze</option>
                    </select>
                    <div className="flex gap-4 pt-4">
                       <button onClick={() => setShowPartnerForm(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest">Annuler</button>
                       <button onClick={handleSavePartner} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest">Enregistrer</button>
                    </div>
                 </div>
              </div>
            </div>
           )}
        </div>
      )}

      {tab === 'SCANNER' && (
        <div className="max-w-xl mx-auto animate-in fade-in duration-500">
           <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight uppercase">Scanner CIA 2026</h2>
              {!scannerActive ? (
                <div className="space-y-6">
                  <div className="w-48 h-48 mx-auto bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300"><Camera size={64} /></div>
                  <button onClick={handleStartScanner} className="w-full bg-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-white flex items-center justify-center gap-3 shadow-lg shadow-blue-200">Activer Caméra <QrCode size={18} /></button>
                  <button onClick={simulateScan} className="text-[10px] font-black uppercase text-slate-400 underline">Simuler un Scan (Demo)</button>
                </div>
              ) : (
                <div className="space-y-6">
                   <div className="relative aspect-square max-w-sm mx-auto overflow-hidden rounded-3xl border-4 border-blue-100">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-cyan-400 animate-pulse"></div>
                   </div>
                   <button onClick={handleStopScanner} className="w-full bg-slate-100 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-600">Arrêter le scanner</button>
                </div>
              )}
              {scanResult && (
                <div className={`p-8 rounded-3xl text-left space-y-4 animate-in zoom-in ${scanResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                   <div className="flex items-center gap-4">
                      <div className={scanResult.success ? 'text-green-500' : 'text-red-500'}>{scanResult.success ? <CheckCircle size={40} /> : <XCircle size={40} />}</div>
                      <h3 className={`text-2xl font-black uppercase tracking-tight ${scanResult.success ? 'text-green-800' : 'text-red-800'}`}>{scanResult.message}</h3>
                   </div>
                   
                   {scanResult.data && (
                     <div className="grid grid-cols-1 gap-3 pt-4 border-t border-white/40">
                        <div className="flex items-center gap-2 text-slate-700 font-bold"><User size={16} /> {scanResult.data.prenom} {scanResult.data.nom}</div>
                        <div className="flex items-center gap-2 text-slate-600 text-sm"><Mail size={16} /> {scanResult.data.email}</div>
                        <div className="flex items-center gap-2 text-slate-600 text-sm"><Phone size={16} /> {scanResult.data.tel}</div>
                        <div className="flex items-center gap-2 text-[#0056b3] text-sm font-bold uppercase tracking-widest"><CreditCard size={16} /> {scanResult.data.pay} • {scanResult.data.qty} Ticket(s)</div>
                     </div>
                   )}
                </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};

