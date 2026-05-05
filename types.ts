
export enum PaymentMethod {
  MOBILE_MONEY = 'MOBILE_MONEY',
  CRYPTO = 'CRYPTO'
}

export enum CryptoNetwork {
  TRC20 = 'TRC-20',
  BSC = 'BSC'
}

export enum CryptoCurrency {
  USDT = 'USDT',
  USDC = 'USDC'
}

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  orderIndex: number;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  speakerId?: string;
  type: 'KEYNOTE' | 'WORKSHOP' | 'PANEL' | 'BREAK';
}

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  tier: 'PLATINUM' | 'GOLD' | 'SILVER' | 'BRONZE';
  orderIndex: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  orderIndex: number;
}

export interface Review {
  id: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  isPublished: boolean;
  createdAt: string;
}

export interface Ticket {
  id: string;
  reference: string;
  ownerName: string;
  ownerEmail: string;
  purchaseDate: string;
  quantity: number;
  totalPrice: number;
  status: 'PENDING' | 'VALIDATED' | 'USED' | 'REJECTED';
  paymentMethod: PaymentMethod;
  qrCodeData: string;
  paymentScreenshot?: string; // Base64 representation for demo
  senderPhone?: string;
}

export interface AppState {
  view: 'HOME' | 'PURCHASE' | 'DASHBOARD' | 'ADMIN';
  tickets: Ticket[];
  speakers: Speaker[];
  sessions: Session[];
  partners: Partner[];
  faqs: FAQ[];
  currentUser: UserInfo & { role?: string } | null;
  isAdmin: boolean;
}

