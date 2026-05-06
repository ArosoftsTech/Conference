
import { Ticket, UserInfo, Speaker, PaymentMethod, Session, Partner, FAQ, Review } from '../types';
import { supabase } from './supabase';

const ADMIN_UUID = '78342b26-cc60-4ee1-b25d-859f482f43fa';
const ADMIN_EMAIL = 'admin@successlife.com';

// Upload an image (base64 data URL) to Supabase Storage and return the public URL
export const uploadImage = async (base64DataUrl: string, folder: string, fileName: string): Promise<string> => {
  try {
    // Convert base64 to blob
    const res = await fetch(base64DataUrl);
    const blob = await res.blob();
    
    // Determine extension from MIME type
    const ext = blob.type.split('/')[1] === 'png' ? 'png' : 'jpg';
    const timestamp = Date.now();
    const filePath = `${folder}/${fileName}_${timestamp}.${ext}`;

    // Ensure the bucket exists (will silently fail if already exists)
    await supabase.storage.createBucket('images', { public: true, fileSizeLimit: 5242880 }).catch(() => {});

    // Upload to Supabase Storage bucket "images"
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, blob, { 
        cacheControl: '3600', 
        upsert: true,
        contentType: blob.type 
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      // Fallback: return the base64 itself
      return base64DataUrl;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (err) {
    console.error('Image upload failed:', err);
    return base64DataUrl;
  }
};

export const db = {
  // --- TICKETS ---
  getTickets: async (): Promise<Ticket[]> => {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tickets:', error);
      return [];
    }

    return (data || []).map(t => ({
      id: t.id,
      reference: t.reference,
      ownerName: t.owner_name,
      ownerEmail: t.owner_email,
      purchaseDate: t.created_at.split('T')[0],
      quantity: t.quantity,
      totalPrice: t.total_price,
      status: t.status,
      paymentMethod: t.payment_method as PaymentMethod,
      qrCodeData: t.qr_code_data,
      paymentScreenshot: t.payment_screenshot_url,
      senderPhone: t.sender_phone
    }));
  },

  saveTicket: async (ticket: Ticket): Promise<void> => {
    const { error } = await supabase
      .from('tickets')
      .upsert({
        id: ticket.id,
        reference: ticket.reference,
        owner_name: ticket.ownerName,
        owner_email: ticket.ownerEmail,
        quantity: ticket.quantity,
        total_price: ticket.totalPrice,
        payment_method: ticket.paymentMethod,
        payment_screenshot_url: ticket.paymentScreenshot,
        sender_phone: ticket.senderPhone,
        status: ticket.status,
        qr_code_data: ticket.qrCodeData
      });

    if (error) console.error('Error saving ticket:', error);
  },

  updateTicketStatus: async (ticketId: string, status: Ticket['status']): Promise<void> => {
    const { error } = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', ticketId);

    if (error) console.error('Error updating ticket status:', error);
  },

  // --- SPEAKERS ---
  getSpeakers: async (): Promise<Speaker[]> => {
    const { data, error } = await supabase
      .from('speakers')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching speakers:', error);
      return [];
    }

    return (data || []).map(s => ({
      id: s.id,
      name: s.name,
      role: s.role,
      imageUrl: s.image_url,
      orderIndex: s.order_index
    }));
  },

  saveSpeaker: async (speaker: Speaker): Promise<void> => {
    const { error } = await supabase
      .from('speakers')
      .upsert({
        id: speaker.id,
        name: speaker.name,
        role: speaker.role,
        image_url: speaker.imageUrl,
        order_index: speaker.orderIndex
      });

    if (error) console.error('Error saving speaker:', error);
  },

  deleteSpeaker: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('speakers')
      .delete()
      .eq('id', id);

    if (error) console.error('Error deleting speaker:', error);
  },

  // --- SESSIONS ---
  getSessions: async (): Promise<Session[]> => {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }

    return (data || []).map(s => ({
      id: s.id,
      title: s.title,
      description: s.description,
      startTime: s.start_time,
      endTime: s.end_time,
      location: s.location,
      speakerId: s.speaker_id,
      type: s.type
    }));
  },

  saveSession: async (session: Session): Promise<void> => {
    const { error } = await supabase
      .from('sessions')
      .upsert({
        id: session.id,
        title: session.title,
        description: session.description,
        start_time: session.startTime,
        end_time: session.endTime,
        location: session.location,
        speaker_id: session.speakerId,
        type: session.type
      });

    if (error) console.error('Error saving session:', error);
  },

  deleteSession: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', id);

    if (error) console.error('Error deleting session:', error);
  },

  // --- PARTNERS ---
  getPartners: async (): Promise<Partner[]> => {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching partners:', error);
      return [];
    }

    return (data || []).map(p => ({
      id: p.id,
      name: p.name,
      logoUrl: p.logo_url,
      websiteUrl: p.website_url,
      tier: p.tier,
      orderIndex: p.order_index
    }));
  },

  savePartner: async (partner: Partner): Promise<void> => {
    const { error } = await supabase
      .from('partners')
      .upsert({
        id: partner.id,
        name: partner.name,
        logo_url: partner.logoUrl,
        website_url: partner.websiteUrl,
        tier: partner.tier,
        order_index: partner.orderIndex
      });

    if (error) console.error('Error saving partner:', error);
  },

  deletePartner: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id);

    if (error) console.error('Error deleting partner:', error);
  },

  // --- FAQ ---
  getFAQs: async (): Promise<FAQ[]> => {
    const { data, error } = await supabase
      .from('faq')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      console.error('Error fetching FAQs:', error);
      return [];
    }

    return (data || []).map(f => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: f.category,
      orderIndex: f.order_index
    }));
  },

  saveFAQ: async (faq: FAQ): Promise<void> => {
    const { error } = await supabase
      .from('faq')
      .upsert({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        order_index: faq.orderIndex
      });

    if (error) console.error('Error saving FAQ:', error);
  },

  deleteFAQ: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('faq')
      .delete()
      .eq('id', id);

    if (error) console.error('Error deleting FAQ:', error);
  },

  // --- REVIEWS ---
  getReviews: async (): Promise<Review[]> => {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return (data || []).map(r => ({
      id: r.id,
      userName: r.user_name,
      userEmail: r.user_email,
      rating: r.rating,
      comment: r.comment,
      isPublished: r.is_published,
      createdAt: r.created_at
    }));
  },

  saveReview: async (review: Review): Promise<void> => {
    const { error } = await supabase
      .from('reviews')
      .upsert({
        id: review.id,
        user_name: review.userName,
        user_email: review.userEmail,
        rating: review.rating,
        comment: review.comment,
        is_published: review.isPublished
      });

    if (error) console.error('Error saving review:', error);
  },

  // --- RESERVATIONS ---
  saveReservation: async (res: any): Promise<void> => {
    const { error } = await supabase
      .from('reservations')
      .insert({
        nom: res.nom,
        prenoms: res.prenoms,
        email: res.email,
        telephone: res.telephone,
        places: res.places
      });

    if (error) console.error('Error saving reservation:', error);
  },

  getReservations: async (): Promise<any[]> => {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reservations:', error);
      return [];
    }
    return data || [];
  },

  // --- USERS / PROFILES ---
  getUsers: async (): Promise<(UserInfo & { role: string })[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');

    if (error) {
      console.error('Error fetching users:', error);
      return [];
    }

    return (data || []).map(u => ({
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      phone: u.phone,
      role: u.role
    }));
  },

  saveUser: async (user: UserInfo & { role: string }): Promise<void> => {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', user.email)
      .single();

    if (existing) {
      await supabase
        .from('profiles')
        .update({
          first_name: user.firstName,
          last_name: user.lastName,
          phone: user.phone,
          role: user.role
        })
        .eq('id', existing.id);
    } else {
      const generateUUID = () => {
        if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };
      
      const userId = user.email === ADMIN_EMAIL ? ADMIN_UUID : generateUUID();
      
      await supabase
        .from('profiles')
        .insert({
          id: userId,
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        });
    }
  }
};

