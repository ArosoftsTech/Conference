
import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Ticket as TicketIcon, 
  CheckCircle2, 
  Loader2, 
  AlertCircle,
  Coins,
  CreditCard,
  Minus,
  Plus,
  Camera,
  Upload,
  Phone,
  RefreshCw
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { EVENT_DETAILS, CRYPTO_WALLETS, CFA_TO_USD_RATE } from '../constants';
import { PaymentMethod, CryptoCurrency, CryptoNetwork, Ticket, UserInfo } from '../types';

interface PurchaseFlowProps {
  onSuccess: (ticket: Ticket) => void;
  onCancel: () => void;
}

export const PurchaseFlow: React.FC<PurchaseFlowProps> = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [senderPhone, setSenderPhone] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.MOBILE_MONEY);
  const [cryptoConfig, setCryptoConfig] = useState({
    currency: CryptoCurrency.USDT,
    network: CryptoNetwork.TRC20
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cryptoConfig.currency === CryptoCurrency.USDT) {
      setCryptoConfig(prev => ({ ...prev, network: CryptoNetwork.TRC20 }));
    } else {
      setCryptoConfig(prev => ({ ...prev, network: CryptoNetwork.BSC }));
    }
  }, [cryptoConfig.currency]);

  useEffect(() => {
    const saved = localStorage.getItem('purchase_draft');
    if (saved) {
      setUserInfo(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('purchase_draft', JSON.stringify(userInfo));
  }, [userInfo]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!userInfo.firstName) newErrors.firstName = "Prénom requis";
    if (!userInfo.lastName) newErrors.lastName = "Nom requis";
    if (!userInfo.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)) newErrors.email = "Email invalide";
    if (!userInfo.phone) newErrors.phone = "Téléphone requis";
    if (!confirmEmail) newErrors.confirmEmail = "Veuillez confirmer votre email";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePayment = () => {
    const newErrors: Record<string, string> = {};
    if (paymentMethod === PaymentMethod.MOBILE_MONEY) {
      if (!senderPhone) newErrors.senderPhone = "Numéro d'expédition requis";
      if (!screenshot) newErrors.screenshot = "Capture d'écran requise";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 2 && !validateForm()) return;
    if (step === 3 && !validatePayment()) return;
    setStep(prev => prev + 1);
  };

  const handlePrev = () => setStep(prev => prev - 1);

  const simulatePayment = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const ref = Math.random().toString(36).substr(2, 5).toUpperCase();
    const reference = `SL2026-${ref}`;
    
    // Encode full user info in the QR Code data
    const qrData = JSON.stringify({
      ref: reference,
      nom: userInfo.lastName,
      prenom: userInfo.firstName,
      email: userInfo.email,
      tel: userInfo.phone,
      pay: paymentMethod,
      qty: quantity
    });

    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      reference,
      ownerName: `${userInfo.firstName} ${userInfo.lastName}`,
      ownerEmail: userInfo.email,
      purchaseDate: new Date().toISOString().split('T')[0],
      quantity,
      totalPrice: quantity * EVENT_DETAILS.pricePerTicket,
      status: 'PENDING',
      paymentMethod,
      qrCodeData: qrData,
      paymentScreenshot: screenshot || undefined,
      senderPhone: senderPhone || undefined
    };
    
    setIsProcessing(false);
    onSuccess(newTicket);
  };

  const totalPrice = quantity * EVENT_DETAILS.pricePerTicket;
  const cryptoAmount = (totalPrice * CFA_TO_USD_RATE).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-16 px-4 md:px-12">
        {[
          { id: 1, label: 'Tickets' },
          { id: 2, label: 'Informations' },
          { id: 3, label: 'Paiement' },
          { id: 4, label: 'Confirmation' }
        ].map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center gap-3 relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all z-10 ${
                step >= s.id ? 'bg-[#0056b3] text-white' : 'bg-[#f0f7ff] text-slate-400'
              }`}>
                {s.id}
              </div>
              <span className={`text-xs font-bold transition-colors ${
                step >= s.id ? 'text-slate-900' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
            </div>
            {i < 3 && (
              <div className="flex-1 h-[2px] mb-8 mx-2 bg-[#f0f7ff] overflow-hidden">
                <div 
                  className="h-full bg-[#0056b3] transition-all duration-500" 
                  style={{ width: step > s.id ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 md:p-12 space-y-10">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#f0f7ff] flex items-center justify-center text-[#0056b3]">
                <TicketIcon size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Pass Success Life 2026</h2>
                <p className="text-slate-500 font-medium">10 000 F CFA par ticket</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-12">
              {[
                "Accès à toutes les conférences",
                "Documentation exclusive",
                "Pause café et déjeuner",
                "Certificat de participation"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-600">
                  <CheckCircle2 size={20} className="text-[#0056b3]" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#f0f7ff] p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
              <span className="text-lg font-bold text-slate-900">Nombre de tickets</span>
              <div className="flex items-center gap-8">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0056b3] transition-colors shadow-sm"
                >
                  <Minus size={20} />
                </button>
                <span className="text-3xl font-bold text-slate-900 w-6 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#0056b3] transition-colors shadow-sm"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="bg-white border border-[#f0f7ff] p-8 rounded-3xl flex items-center justify-between shadow-inner">
              <span className="text-xl font-bold text-slate-900">Total à payer</span>
              <div className="text-right">
                <div className="text-3xl font-black text-[#0056b3]">
                  {totalPrice.toLocaleString()} F CFA
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {quantity} ticket{quantity > 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleNext} className="w-full bg-[#0056b3] py-5 rounded-2xl font-bold text-white text-xl hover:bg-[#004494] transition-all shadow-xl shadow-blue-200">Continuer</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 md:p-12 space-y-8">
            <h2 className="text-3xl font-bold text-slate-900">Vos Informations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Prénom</label>
                <input 
                  type="text" 
                  className={`w-full bg-[#f8fafc] border ${errors.firstName ? 'border-red-500' : 'border-slate-200'} rounded-xl p-4 outline-none focus:border-blue-500 transition-colors`}
                  value={userInfo.firstName}
                  onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}
                  placeholder="Jean"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-900">Nom</label>
                <input 
                  type="text" 
                  className={`w-full bg-[#f8fafc] border ${errors.lastName ? 'border-red-500' : 'border-slate-200'} rounded-xl p-4 outline-none focus:border-blue-500 transition-colors`}
                  value={userInfo.lastName}
                  onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}
                  placeholder="Kouassi"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Email</label>
              <input 
                type="email" 
                className={`w-full bg-[#f8fafc] border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl p-4 outline-none focus:border-blue-500 transition-colors`}
                value={userInfo.email}
                onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                placeholder="jean.kouassi@email.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-900">Téléphone (CI)</label>
              <div className="flex gap-2">
                <div className="bg-slate-100 rounded-xl px-5 flex items-center text-slate-500 font-bold border border-slate-200">+225</div>
                <input 
                  type="tel" 
                  className={`w-full bg-[#f8fafc] border ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-xl p-4 outline-none focus:border-blue-500 transition-colors`}
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                  placeholder="0700000000"
                />
              </div>
            </div>
            <label className="flex items-start gap-4 cursor-pointer group pt-2">
              <input 
                type="checkbox" 
                className="mt-1 w-6 h-6 rounded-lg border-slate-200 bg-[#f8fafc] text-[#0056b3]" 
                checked={confirmEmail}
                onChange={() => setConfirmEmail(!confirmEmail)}
              />
              <span className="text-sm text-slate-500 font-medium select-none">Je confirme que l'adresse email est correcte.</span>
            </label>
          </div>
          <div className="flex gap-4">
            <button onClick={handlePrev} className="flex-1 bg-white border border-slate-200 py-5 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Précédent</button>
            <button onClick={handleNext} className="flex-[2] bg-[#0056b3] py-5 rounded-2xl font-bold text-white text-xl hover:bg-[#004494] transition-all shadow-xl shadow-blue-200">Continuer</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-500">
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-8 md:p-12 space-y-10">
            <h2 className="text-3xl font-bold text-slate-900">Mode de Paiement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => setPaymentMethod(PaymentMethod.MOBILE_MONEY)}
                className={`p-8 rounded-[2rem] border transition-all text-left group ${
                  paymentMethod === PaymentMethod.MOBILE_MONEY ? 'border-[#0056b3] bg-blue-50/50' : 'border-slate-100 bg-[#f8fafc]'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${paymentMethod === PaymentMethod.MOBILE_MONEY ? 'bg-[#0056b3] text-white' : 'bg-white text-slate-400'}`}><CreditCard size={28} /></div>
                  {paymentMethod === PaymentMethod.MOBILE_MONEY && <CheckCircle2 size={24} className="text-[#0056b3]" />}
                </div>
                <div className="font-bold text-xl text-slate-900">Mobile Money</div>
                <div className="text-sm text-slate-500 mt-2 font-medium">Orange Money & Wave</div>
              </button>
              <button 
                onClick={() => setPaymentMethod(PaymentMethod.CRYPTO)}
                className={`p-8 rounded-[2rem] border transition-all text-left group ${
                  paymentMethod === PaymentMethod.CRYPTO ? 'border-[#0056b3] bg-blue-50/50' : 'border-slate-100 bg-[#f8fafc]'
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-4 rounded-2xl ${paymentMethod === PaymentMethod.CRYPTO ? 'bg-[#0056b3] text-white' : 'bg-white text-slate-400'}`}><Coins size={28} /></div>
                  {paymentMethod === PaymentMethod.CRYPTO && <CheckCircle2 size={24} className="text-[#0056b3]" />}
                </div>
                <div className="font-bold text-xl text-slate-900">Cryptomonnaie</div>
                <div className="text-sm text-slate-500 mt-2 font-medium">USDT / USDC</div>
              </button>
            </div>

            {paymentMethod === PaymentMethod.MOBILE_MONEY ? (
              <div className="bg-[#f0f7ff] p-8 rounded-[2rem] border border-blue-100/50 space-y-8">
                <div className="text-center space-y-4">
                   <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">Effectuez le transfert vers ce numéro</div>
                   <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-sm inline-flex items-center gap-4">
                      <Phone className="text-[#0056b3]" size={24} />
                      <span className="text-3xl font-black text-slate-900">07 78 80 59 51</span>
                   </div>
                   <div className="flex justify-center gap-6 pt-2">
                      <div className="flex flex-col items-center gap-2">
                         <div className="w-16 h-10 bg-orange-500 text-white rounded-lg flex items-center justify-center font-black text-[10px]">ORANGE</div>
                         <span className="text-[10px] font-bold text-slate-400">Orange Money</span>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                         <div className="w-16 h-10 bg-cyan-400 text-white rounded-lg flex items-center justify-center font-black text-[10px]">WAVE</div>
                         <span className="text-[10px] font-bold text-slate-400">Wave</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-900">Votre numéro d'expédition</label>
                      <input 
                        type="tel" 
                        className={`w-full bg-white border ${errors.senderPhone ? 'border-red-500' : 'border-slate-200'} p-4 rounded-xl outline-none focus:border-blue-500`}
                        value={senderPhone}
                        onChange={(e) => setSenderPhone(e.target.value)}
                        placeholder="07 XX XX XX XX"
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-900">Preuve de paiement (Capture d'écran)</label>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full aspect-video md:aspect-[21/9] bg-white border-2 border-dashed ${errors.screenshot ? 'border-red-500 bg-red-50/10' : 'border-blue-200 hover:border-blue-400'} rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group`}
                      >
                         {screenshot ? (
                           <>
                             <img src={screenshot} alt="Preview" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                               <RefreshCw className="text-white" />
                             </div>
                           </>
                         ) : (
                           <>
                             <div className="p-4 bg-blue-50 rounded-full text-[#0056b3] mb-3"><Upload size={24} /></div>
                             <p className="text-sm font-bold text-slate-500">Cliquez pour uploader la capture</p>
                             <p className="text-[10px] text-slate-400 mt-1">PNG, JPG ou JPEG</p>
                           </>
                         )}
                      </div>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                   </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#f0f7ff] p-8 rounded-[2rem] border border-blue-100/50 space-y-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Devise</label>
                    <select 
                      className="w-full bg-white border border-slate-200 p-4 rounded-xl font-bold text-slate-700 outline-none"
                      value={cryptoConfig.currency}
                      onChange={(e) => setCryptoConfig({...cryptoConfig, currency: e.target.value as CryptoCurrency})}
                    >
                      <option value={CryptoCurrency.USDT}>Tether (USDT)</option>
                      <option value={CryptoCurrency.USDC}>USD Coin (USDC)</option>
                    </select>
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Réseau</label>
                    <select 
                      className="w-full bg-white border border-slate-200 p-4 rounded-xl font-bold text-slate-700 outline-none bg-slate-50"
                      value={cryptoConfig.network}
                      disabled
                    >
                      <option value={CryptoNetwork.TRC20}>Réseau: TRC-20</option>
                      <option value={CryptoNetwork.BSC}>Réseau: BSC (BEP-20)</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-6 py-4">
                  <div className="p-6 bg-white rounded-3xl shadow-lg border border-slate-100">
                    <QRCodeSVG value={CRYPTO_WALLETS[cryptoConfig.network]} size={160} />
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-slate-400 uppercase font-black">Montant estimé</div>
                    <div className="text-4xl font-black text-[#0056b3]">≈ {cryptoAmount} {cryptoConfig.currency}</div>
                  </div>
                  <div className="w-full">
                    <div className="text-xs text-slate-400 uppercase font-black mb-2">Adresse du portefeuille ({cryptoConfig.network})</div>
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 text-sm font-mono break-all text-slate-600 shadow-inner">
                      {CRYPTO_WALLETS[cryptoConfig.network]}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            <button onClick={handlePrev} className="flex-1 bg-white border border-slate-200 py-5 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Précédent</button>
            <button onClick={handleNext} className="flex-[2] bg-[#0056b3] py-5 rounded-2xl font-bold text-white text-xl hover:bg-[#004494] transition-all shadow-xl shadow-blue-200">Continuer</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-10 animate-in fade-in zoom-in duration-500">
          {isProcessing ? (
            <div className="bg-white p-16 rounded-[3rem] border border-slate-100 shadow-2xl w-full max-w-2xl flex flex-col items-center space-y-8">
              <div className="w-32 h-32 rounded-full border-t-8 border-[#0056b3] border-r-8 border-transparent animate-spin relative z-10"></div>
              <h2 className="text-3xl font-black text-slate-900">Finalisation en cours...</h2>
            </div>
          ) : (
            <>
              <div className="bg-white p-12 md:p-16 rounded-[3rem] border border-slate-100 shadow-2xl w-full max-w-2xl space-y-10">
                <div className="w-24 h-24 rounded-full bg-[#f0f7ff] flex items-center justify-center text-[#0056b3] mx-auto border-4 border-white shadow-lg">
                  <CheckCircle2 size={48} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Prêt pour confirmation</h2>
                  <p className="text-slate-500 font-medium">Votre demande de ticket sera envoyée pour validation.</p>
                </div>
                <div className="bg-[#f8fafc] p-8 rounded-3xl border border-slate-100 text-left space-y-6 shadow-inner">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-slate-500 font-medium">Pass Success Life x{quantity}</span>
                    <span className="font-black text-slate-900">{totalPrice.toLocaleString()} F CFA</span>
                  </div>
                  <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-xl font-bold text-slate-900">Total Final</span>
                    <span className="text-3xl font-black text-[#0056b3]">{totalPrice.toLocaleString()} F CFA</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-6 w-full max-w-2xl">
                <button onClick={handlePrev} className="flex-1 py-5 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold text-xl hover:bg-slate-50">Retour</button>
                <button onClick={simulatePayment} className="flex-[2] py-5 rounded-2xl bg-[#0056b3] text-white font-black text-2xl hover:bg-[#004494] shadow-2xl shadow-blue-200">Soumettre le paiement</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
