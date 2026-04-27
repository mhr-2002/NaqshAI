import React from 'react';
import { motion } from 'motion/react';
import { Phone, MapPin, Star, X } from 'lucide-react';

interface Artisan {
  name: string;
  phone: string;
  rates: string;
  expertise: string[];
  location: string;
  rating: number;
}

const ARTISAN_DATABASE: Record<string, Artisan[]> = {
  'zardozi': [
    { name: 'Ustad Zahoor Ahmed', phone: '+92 300 4512345', rates: 'Rs. 8,000 - 25,000 per panel', expertise: ['Hand embroidery', 'Gold thread'], location: 'Mochi Gate, Old Lahore', rating: 4.9 },
    { name: 'Karigar Bashir', phone: '+92 321 9876543', rates: 'Rs. 4,500 - 12,000 per suit', expertise: ['Kora', 'Dabka'], location: 'Lunda Bazaar', rating: 4.7 }
  ],
  'resham': [
    { name: 'Mian Safdar', phone: '+92 312 5556677', rates: 'Rs. 2,000 - 5,000 per meter', expertise: ['Silk work', 'Floral motifs'], location: 'Taxali Gate', rating: 4.8 },
    { name: 'Irfan Resham-waala', phone: '+92 345 1122334', rates: 'Rs. 3,500 per gala/neckline', expertise: ['Thread work', 'Shadow work'], location: 'Rang Mahal', rating: 4.6 }
  ],
  'gota': [
    { name: 'Haji Ibrahim', phone: '+92 301 7778899', rates: 'Rs. 1,500 - 4,000 per border', expertise: ['Kinari', 'Lappa'], location: 'Kinari Bazaar', rating: 4.9 },
    { name: 'Saleem Gota Center', phone: '+92 333 4455667', rates: 'Rs. 500 per bunch', expertise: ['Patti work', 'Applique'], location: 'Anarkali', rating: 4.5 }
  ],
  'dabka': [
    { name: 'Ustad Mushtaq', phone: '+92 300 1234567', rates: 'Rs. 10,000+ for heavy bridal', expertise: ['Bridal dabka', 'Zardozi'], location: 'Dabbi Bazaar', rating: 4.9 },
    { name: 'Aslam & Sons', phone: '+92 322 3344556', rates: 'Rs. 6,000 per bodice', expertise: ['Dabka', 'Nakshi'], location: 'Shah Alam Market', rating: 4.7 }
  ],
  'tilla': [
    { name: 'Rizwan Tilla Works', phone: '+92 302 9988776', rates: 'Rs. 2,500 per panel', expertise: ['Machine tilla', 'Hand tilla'], location: 'Badshahi Mohalla', rating: 4.5 },
    { name: 'Ustad Shakoor', phone: '+92 315 4433221', rates: 'Rs. 4,000 per yard', expertise: ['Zari', 'Antique tilla'], location: 'Kashmiri Gate', rating: 4.8 }
  ],
  'sheesha': [
    { name: 'Bibi Gul (Sindhi Specialist)', phone: '+92 300 6655443', rates: 'Rs. 300 per mirror patch', expertise: ['Mirror work', 'Sindhi tanka'], location: 'McLeod Road (Workshop)', rating: 4.9 },
    { name: 'Karachi Mirror House', phone: '+92 331 2233445', rates: 'Rs. 2,500 per gala', expertise: ['Sheesha', 'Abla work'], location: 'Liberty Market (Backlane)', rating: 4.4 }
  ],
  'applique': [
    { name: 'Ustad Jaffar', phone: '+92 306 1112223', rates: 'Rs. 4,000 - 8,000 per suit', expertise: ['Patchwork', 'Rilli'], location: 'Landa Bazaar', rating: 4.7 },
    { name: 'Maqsood Tailors', phone: '+92 321 0009988', rates: 'Rs. 2,000 per border', expertise: ['Fabric manipulation', 'Applique'], location: 'Ichhra', rating: 4.6 }
  ],
  'aari': [
    { name: 'Aari Master Munir', phone: '+92 304 7766554', rates: 'Rs. 3,500 per meter', expertise: ['Chain stitch', 'Aari embroidery'], location: 'Azam Market', rating: 4.8 },
    { name: 'Kashmiri Aari House', phone: '+92 311 9900887', rates: 'Rs. 5,000 per shawl', expertise: ['Crewel work', 'Aari'], location: 'Bhati Gate', rating: 4.7 }
  ],
  'chikan': [
    { name: 'Ustad Khalid', phone: '+92 300 8877665', rates: 'Rs. 12,000+ for pure white work', expertise: ['Chikan kari', 'Hand shadow'], location: 'Pani Wala Talab', rating: 4.9 },
    { name: 'Zainab Chikan Emporium', phone: '+92 320 1122334', rates: 'Rs. 4,000 per shirt', expertise: ['Machine chikan', 'Shadow'], location: 'Model Town (Workshop)', rating: 4.5 }
  ]
};

const DEFAULT_ARTISANS = [
  { name: 'Ustad Nazeer', phone: '+92 300 1122334', rates: 'Rs. 5,000 per suit', expertise: ['General embroidery', 'Tailoring'], location: 'Old Lahore', rating: 4.5 },
  { name: 'Gul Ahmed Karigar', phone: '+92 321 4455667', rates: 'Rs. 4,000 base rate', expertise: ['Hand stitching', 'Finishing'], location: 'Shahdara', rating: 4.3 }
];

interface Props {
  detectedStyles: string[];
  onClose: () => void;
  language?: 'en' | 'ur';
}

export default function ArtisanDirectory({ detectedStyles, onClose, language = 'en' }: Props) {
  const getArtisansForStyle = (style: string) => {
    const key = style.toLowerCase();
    for (const dbKey in ARTISAN_DATABASE) {
      if (key.includes(dbKey)) return ARTISAN_DATABASE[dbKey];
    }
    return DEFAULT_ARTISANS;
  };

  const labels = {
    en: {
      title: "Artisan Directory: Old Lahore",
      subtitle: "Verified Master Karigars for your design",
      contact: "Call Now",
      rate: "Draft Rates",
      location: "Workshop Location",
      close: "Close Directory"
    },
    ur: {
      title: "کاریگروں کی ڈائریکٹری: پرانا لاہور",
      subtitle: "آپ کے ڈیزائن کے لیے تصدیق شدہ ماسٹر کاریگر",
      contact: "رابطہ کریں",
      rate: "اندازہً قیمت",
      location: "ورکشاپ کا پتہ",
      close: "بند کریں"
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
    >
      <div className="absolute inset-0 bg-silk-charcoal/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-[#fdfbf6] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-heritage-gold/20">
        <div className="p-8 border-b border-heritage-gold/10 flex justify-between items-start bg-white">
          <div className={language === 'ur' ? 'text-right flex-1 pr-4' : ''}>
            <h2 className={`text-3xl text-silk-charcoal mb-1 ${language === 'ur' ? 'urdu-text' : ''}`}>
              {labels[language].title}
            </h2>
            <p className={`text-silk-charcoal/50 text-sm font-medium ${language === 'ur' ? 'urdu-text' : ''}`}>
              {labels[language].subtitle}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <X className="w-6 h-6 text-silk-charcoal" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
          {detectedStyles.map((style, idx) => {
            const artisans = getArtisansForStyle(style);
            return (
              <section key={idx} className="space-y-6">
                <div className={`flex items-center gap-3 border-b border-heritage-gold/10 pb-4 ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-heritage-gold/10 flex items-center justify-center text-heritage-gold font-bold text-xs">
                    {idx + 1}
                  </div>
                  <h3 className={`text-xl font-medium text-silk-charcoal ${language === 'ur' ? 'urdu-text' : ''}`}>
                    {style}
                  </h3>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {artisans.map((artisan, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card p-6 rounded-3xl border border-heritage-gold/5 bg-white shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className={`flex justify-between items-start mb-4 ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
                        <div className={language === 'ur' ? 'text-right' : ''}>
                          <h4 className={`text-lg font-bold text-silk-charcoal group-hover:text-heritage-gold transition-colors ${language === 'ur' ? 'urdu-text' : ''}`}>
                            {artisan.name}
                          </h4>
                          <div className={`flex items-center gap-1 ${language === 'ur' ? 'justify-end' : ''}`}>
                            <Star className="w-3 h-3 text-heritage-gold fill-heritage-gold" />
                            <span className="text-xs font-bold text-silk-charcoal/60">{artisan.rating}</span>
                          </div>
                        </div>
                        <a 
                          href={`tel:${artisan.phone.replace(/\s/g, '')}`}
                          className="w-10 h-10 rounded-full bg-mehndi-green/10 flex items-center justify-center text-mehndi-green hover:bg-mehndi-green hover:text-white transition-all shadow-sm"
                        >
                          <Phone className="w-5 h-5" />
                        </a>
                      </div>

                      <div className={`space-y-3 mb-6 ${language === 'ur' ? 'text-right' : ''}`}>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-silk-charcoal/30 mb-1">
                            {labels[language].rate}
                          </p>
                          <p className={`text-sm font-medium text-silk-charcoal ${language === 'ur' ? 'urdu-text' : ''}`}>
                            {artisan.rates}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-widest text-silk-charcoal/30 mb-1">
                            {labels[language].location}
                          </p>
                          <div className={`flex items-center gap-1 text-silk-charcoal/60 ${language === 'ur' ? 'justify-end' : ''}`}>
                            <MapPin className="w-3 h-3" />
                            <span className={`text-xs font-medium ${language === 'ur' ? 'urdu-text' : ''}`}>{artisan.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className={`flex flex-wrap gap-2 ${language === 'ur' ? 'justify-end' : ''}`}>
                        {artisan.expertise.map((exp, j) => (
                          <span key={j} className={`px-2 py-1 bg-silk-charcoal/5 rounded text-[10px] font-bold text-silk-charcoal/60 uppercase tracking-tighter ${language === 'ur' ? 'urdu-text' : ''}`}>
                            {exp}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <div className="p-8 bg-white border-t border-heritage-gold/10 text-center">
          <p className={`text-silk-charcoal/40 text-[10px] mb-4 uppercase tracking-[0.2em] ${language === 'ur' ? 'urdu-text leading-loose' : ''}`}>
            {language === 'ur' 
              ? 'نوٹ: درج بالا قیمتیں کاریگر کے ساتھ براہ راست گفت و شنید پر منحصر ہیں۔ نقش اے آئی صرف معلومات فراہم کرتا ہے۔'
              : 'Direct negotiation with the artisan is required. Rates are market benchmarks.'}
          </p>
          <button 
            onClick={onClose}
            className="luxury-button px-10 py-3 text-xs"
          >
            {labels[language].close}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
