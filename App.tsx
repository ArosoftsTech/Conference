import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Speakers } from './components/Speakers';
import { Agenda } from './components/Agenda';
import { Partners } from './components/Partners';
import { FAQ } from './components/FAQ';
import { Reviews } from './components/Reviews';
import { Features } from './components/Features';
import { Footer } from './components/Footer';
import { PurchaseFlow } from './components/PurchaseFlow';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ReservationModal } from './components/ReservationModal';
import { db } from './lib/db';
import { AppState, Ticket, UserInfo, Speaker, Session, Partner, Review } from './types';
import { EVENT_DETAILS } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    view: 'HOME',
    tickets: [],
    speakers: EVENT_DETAILS.speakers as Speaker[],
    sessions: [],
    partners: [],
    faqs: [],
    reviews: [],
    currentUser: null,
    isAdmin: false
  });
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  // Synchronisation initiale avec Supabase
  const refreshData = async () => {
    const [tickets, speakers, sessions, partners, faqs, reviews] = await Promise.all([
      db.getTickets(),
      db.getSpeakers(),
      db.getSessions(),
      db.getPartners(),
      db.getFAQs(),
      db.getReviews()
    ]);
    
    setAppState(prev => ({ 
      ...prev, 
      tickets, 
      speakers: speakers.length > 0 ? speakers : (EVENT_DETAILS.speakers as Speaker[]),
      sessions: sessions.length > 0 ? sessions : (EVENT_DETAILS as any).sessions,
      partners: partners.length > 0 ? partners : (EVENT_DETAILS as any).partners,
      faqs: faqs.length > 0 ? faqs : (EVENT_DETAILS as any).faqs,
      reviews: reviews.length > 0 ? reviews : (EVENT_DETAILS as any).reviews
    }));
  };


  useEffect(() => {
    refreshData();
    
    const savedUser = localStorage.getItem('sl2026_session_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setAppState(prev => ({ 
        ...prev, 
        currentUser: user, 
        isAdmin: user.role === 'ADMIN' 
      }));
    }
  }, []);

  // Rafraîchir les données quand on change de vue
  useEffect(() => {
    if (appState.view === 'ADMIN' || appState.view === 'DASHBOARD' || appState.view === 'HOME') {
      refreshData();
    }
  }, [appState.view]);

  const navigateTo = (view: AppState['view']) => {
    setAppState(prev => ({ ...prev, view }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTicketPurchased = async (newTicket: Ticket) => {
    await db.saveTicket(newTicket);
    const updatedTickets = await db.getTickets();
    setAppState(prev => ({ ...prev, tickets: updatedTickets, view: 'DASHBOARD' }));
  };

  const loginUser = async (user: UserInfo) => {
    const usersInDb = await db.getUsers();
    const existingUser = usersInDb.find(u => u.email === user.email);
    const role = existingUser?.role || (user.email.includes('admin') ? 'ADMIN' : 'USER');
    
    const fullUser = { ...user, role };
    await db.saveUser(fullUser);
    
    setAppState(prev => ({ 
      ...prev, 
      currentUser: fullUser, 
      isAdmin: role === 'ADMIN',
      view: role === 'ADMIN' ? 'ADMIN' : 'DASHBOARD' 
    }));
    
    localStorage.setItem('sl2026_session_user', JSON.stringify(fullUser));
  };

  const logout = () => {
    setAppState(prev => ({ ...prev, currentUser: null, isAdmin: false, view: 'HOME' }));
    localStorage.removeItem('sl2026_session_user');
  };

  const handleAdminUpdateTickets = async (updatedTickets: Ticket[]) => {
    await Promise.all(updatedTickets.map(t => db.saveTicket(t)));
    refreshData();
  };

  const handleAdminUpdateSpeakers = async () => {
    refreshData();
  };

  const handleAdminUpdateSessions = async () => {
    refreshData();
  };

  const handleAdminUpdatePartners = async () => {
    refreshData();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar 
        view={appState.view} 
        user={appState.currentUser} 
        isAdmin={appState.isAdmin}
        onNavigate={navigateTo} 
        onLogout={logout}
      />
      
      <main className="pt-20">
        {appState.view === 'HOME' && (
          <>
            <Hero onBuy={() => navigateTo('PURCHASE')} onReserve={() => setIsReservationOpen(true)} />
            <Speakers speakers={appState.speakers} />
            <Agenda sessions={appState.sessions} speakers={appState.speakers} />
            <Partners partners={appState.partners} />
            <Reviews reviews={appState.reviews} />
            <FAQ faqs={appState.faqs} />
            <Features />
          </>
        )}

        
        {appState.view === 'PURCHASE' && (
          <div className="py-12">
            <PurchaseFlow 
              onSuccess={handleTicketPurchased} 
              onCancel={() => navigateTo('HOME')} 
            />
          </div>
        )}
        
        {appState.view === 'DASHBOARD' && (
          <div className="py-12">
            <Dashboard 
              user={appState.currentUser} 
              tickets={appState.tickets.filter(t => t.ownerEmail === appState.currentUser?.email)}
              onLogin={loginUser}
            />
          </div>
        )}
        
        {appState.view === 'ADMIN' && (
          <div className="py-12">
            <AdminDashboard 
              tickets={appState.tickets} 
              onUpdateTickets={handleAdminUpdateTickets}
              speakers={appState.speakers}
              onUpdateSpeakers={handleAdminUpdateSpeakers}
              sessions={appState.sessions}
              onUpdateSessions={handleAdminUpdateSessions}
              partners={appState.partners}
              onUpdatePartners={handleAdminUpdatePartners}
              onRefresh={refreshData}
            />
          </div>
        )}

      </main>

      <Footer />

      <ReservationModal 
        isOpen={isReservationOpen} 
        onClose={() => setIsReservationOpen(false)} 
        onConfirm={async (res) => {
          await db.saveReservation(res);
          setIsReservationOpen(false);
        }}
      />
    </div>
  );
};

export default App;
