
import React from 'react';
import { Calendar, MapPin, Users, Coins, Zap } from 'lucide-react';
import { CryptoNetwork } from './types';

export const EVENT_DETAILS = {
  title: "GRANDE CONFÉRENCE",
  subtitle: "COMMENT REPROGRAMMER SON CERVEAU POUR RÉUSSIR",
  organization: "CIA - Le Club des Investisseurs Africains",
  category: "DÉVELOPPEMENT PERSONNEL",
  description: "Découvrez comment reprogrammer votre mental pour débloquer votre plein potentiel et atteindre le succès.",
  date: "30 Mai 2026",
  time: "08:00",
  venue: "Conseil des Jeunes, Angré les Oscars",
  pricePerTicket: 5000,
  currency: "F CFA",
  speakers: [
    { 
      id: "1",
      name: "Coach Ivan Barrou", 
      role: "Expert en accompagnement & Leadership",
      imageUrl: "input_file_2.png",
      orderIndex: 0
    },
    { 
      id: "2",
      name: "Martial Krekoumou", 
      role: "Coach Formateur, Optimiseur de cerveau, Psychologue énergéticien",
      imageUrl: "input_file_0.png",
      orderIndex: 1
    },
    { 
      id: "3",
      name: "Coach Arnaud Kallou", 
      role: "Mentor en développement du potentiel",
      imageUrl: "input_file_1.png",
      orderIndex: 2
    }
  ],
  benefits: [
    "Accès complet à la conférence",
    "Kit du participant (Bloc-notes, Stylo)",
    "Pause café et réseautage",
    "Session de questions-réponses exclusive",
    "Certificat de participation digital"
  ],
  sessions: [
    {
      id: "s1",
      title: "Ouverture & Accueil",
      description: "Installation des participants et mot de bienvenue.",
      startTime: "2026-05-30T08:00:00",
      endTime: "2026-05-30T08:30:00",
      location: "Hall Principal",
      type: "BREAK"
    },
    {
      id: "s2",
      title: "Reprogrammer son mental",
      description: "Les bases de la psychologie du succès.",
      startTime: "2026-05-30T08:30:00",
      endTime: "2026-05-30T10:30:00",
      location: "Grande Salle",
      speakerId: "2",
      type: "KEYNOTE"
    },
    {
      id: "s3",
      title: "Pause Café & Réseautage",
      description: "Échange avec les autres investisseurs.",
      startTime: "2026-05-30T10:30:00",
      endTime: "2026-05-30T11:00:00",
      location: "Espace Networking",
      type: "BREAK"
    }
  ],
  partners: [
    {
      id: "p1",
      name: "Investir au Pays",
      logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop",
      tier: "PLATINUM",
      orderIndex: 0
    },
    {
      id: "p2",
      name: "Success Global",
      logoUrl: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop",
      tier: "GOLD",
      orderIndex: 1
    }
  ],
  faqs: [
    {
      id: '1',
      question: "Où se déroule la conférence Success Life 2026 ?",
      answer: "L'événement principal se tiendra au Conseil des Jeunes à Angré les Oscars.",
      orderIndex: 0
    },
    {
      id: '2',
      question: "Comment puis-je récupérer mon badge ?",
      answer: "Les badges seront disponibles dès 07h30 le matin de l'événement sur présentation de votre ticket QR Code.",
      orderIndex: 1
    },
    {
      id: '3',
      question: "Les repas sont-ils inclus ?",
      answer: "L'accès à la conférence inclut une pause café et le kit du participant.",
      orderIndex: 2
    }
  ],
  reviews: [
    {
      id: '1',
      userName: "Marc Kouassi",
      rating: 5,
      comment: "Une expérience transformatrice. Les intervenants étaient d'un niveau exceptionnel.",
      date: "2025-11-15"
    },
    {
      id: '2',
      userName: "Sarah Mensah",
      rating: 5,
      comment: "L'organisation était impeccable. L'agenda était parfaitement rythmé.",
      date: "2025-11-20"
    }
  ]
};



export const MOCK_TICKETS = [
  {
    id: '1',
    reference: 'SL2026-X8B29',
    ownerName: 'Jean Dupont',
    ownerEmail: 'jean@example.com',
    purchaseDate: '2025-10-15',
    quantity: 2,
    totalPrice: 20000,
    status: 'VALIDATED',
    paymentMethod: 'MOBILE_MONEY',
    qrCodeData: 'SL2026-X8B29'
  }
];

export const CRYPTO_WALLETS = {
  [CryptoNetwork.TRC20]: "TSnZAD4vffQ4rNoeLBgmnVn9i3ZLwAzdwy",
  [CryptoNetwork.BSC]: "0x5fa572d6eb4296a23695c0758609bfae721ef2cb"
};

export const CFA_TO_USD_RATE = 0.0016;
