import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scissors, Clock, Users, Lightbulb, BadgeCheck, MapPin, ExternalLink, Brush, Search } from 'lucide-react';
import { AnalysisResult } from '../types';
import ArtisanDirectory from './ArtisanDirectory';

interface Props {
  result: AnalysisResult;
  language: 'en' | 'ur';
  setLanguage: (lang: 'en' | 'ur') => void;
}

export default function AnalysisReport({ result, language, setLanguage }: Props) {
  const [showArtisans, setShowArtisans] = useState(false);
  const lang = language;
  const setLang = setLanguage;

  const formatter = new Intl.NumberFormat(lang === 'ur' ? 'ur-PK' : 'en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  const labels = {
    en: {
      boutique: "Boutique Breakdown",
      styles: "Key Embroidery Styles",
      craft: "Where the Craft Lies",
      cost: "Estimated Artisan Cost",
      insight: "Production Insight",
      smart: "Smart Insights",
      team: "Team",
      timeline: "Timeline",
      contact: "Contact Artisans in Old Lahore",
      palette: "Color Palette",
      complexity: "Complexity",
      findSimilar: "Search Similar"
    },
    ur: {
      boutique: "ڈیزائن کا مکمل تجزیہ",
      styles: "کڑھائی کی اقسام",
      craft: "کرافٹ کی تفصیل",
      cost: "کاریگر کی متوقع اجرت",
      insight: "تیاری کی تفصیلات",
      smart: "بصیرت و مشورہ",
      team: "ٹیم",
      timeline: "وقت",
      contact: "پرانے لاہور کے ماہر کاریگروں سے رابطہ کریں",
      palette: "رنگوں کا انتخاب",
      complexity: "مشکل کا درجہ",
      findSimilar: "ملتے جلتے ڈیزائن"
    }
  };

  const getEmbroideryImage = (styleName: string, description: string) => {
    const text = (styleName + " " + description).toLowerCase();
    
    // Exact mapping to available public assets
    if (text.includes('sheesha') || text.includes('mirror')) return '/embroidery-Sheesha.png';
    if (text.includes('applique') || text.includes('patchwork')) return '/embroidery-applique.png';
    if (text.includes('kantha')) return '/embroidery-kantha.png';
    if (text.includes('chain stitch') || text.includes('aari') || text.includes('magzi')) return '/embroidery-aari(chain stitch).png';
    if (text.includes('cross stitch') || text.includes('cross-stitch')) return '/embroidery-cross-stitch.png';
    if (text.includes('zardozi') || text.includes('metallic')) return '/Zardozi-1.png';
    if (text.includes('resham') || text.includes('silk thread')) return '/Resham-1.png';
    if (text.includes('punjabi') || text.includes('phulkari')) return '/Punjabi-1.png';
    if (text.includes('sindhi') || text.includes('tankay') || text.includes('hurmitch')) return '/Sindhi-1.png';
    if (text.includes('balochi') || text.includes('needlework')) return '/BalochiNeedlework-1.png';
    if (text.includes('gota') || text.includes('lappa')) return '/gota.png';
    if (text.includes('dabka') || text.includes('spring')) return '/embroidery-Dabka.png';
    if (text.includes('kora')) return '/embroidery-Kora.png';
    if (text.includes('tilla') || text.includes('zarri') || text.includes('zari')) return '/embroidery-Tilla:zarri.png';
    if (text.includes('marori')) return '/embroidery-Marori.png';
    if (text.includes('nakshi')) return '/embroidery-Nakshi.png';
    if (text.includes('pitta')) return '/embroidery-Pitta.png';
    if (text.includes('chikan') || text.includes('white work')) return '/embroidery-ChikanKari.png';
    if (text.includes('mukesh') || text.includes('kamdani') || text.includes('badla')) return '/embroidery-Kamdani(Mukesh).png';
    if (text.includes('stone') || text.includes('crystal') || text.includes('stonework') || text.includes('kundan')) return '/embroidery-StoneWork.png';
    if (text.includes('jaali') || text.includes('cutwork') || text.includes('jaal')) return '/embroidery-Jaali-Jaal.png';
    
    // Specific matches for other common types if I had them, but let's use motifs as fallbacks
    if (text.includes('motif')) return '/motif-1.png';
    
    // Better fallback: sequence through motifs or use generic embroidery
    const hash = styleName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const motifNum = (hash % 5) + 1;
    return `/motif-${motifNum}.png`;
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Language Toggle */}
      <div className="flex justify-center mb-4">
        <div className="bg-white/50 backdrop-blur-sm p-1 rounded-full border border-heritage-gold/20 flex gap-1 shadow-sm">
          <button 
            onClick={() => setLang('en')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-heritage-gold text-white shadow-md' : 'text-silk-charcoal/60 hover:text-silk-charcoal'}`}
          >
            ENGLISH
          </button>
          <button 
            onClick={() => setLang('ur')}
            className={`px-6 py-2 rounded-full text-xs font-bold transition-all urdu-text ${lang === 'ur' ? 'bg-royal-maroon text-white shadow-md' : 'text-silk-charcoal/60 hover:text-silk-charcoal'}`}
          >
            اردو
          </button>
        </div>
      </div>

      {/* Color Palette Display */}
      <motion.div variants={item} className="glass-card p-6 rounded-3xl overflow-hidden relative">
        <div className="flex items-center gap-3 mb-4">
          <Brush className="w-4 h-4 text-heritage-gold" />
          <h3 className={`text-sm font-bold tracking-widest ${lang === 'ur' ? 'urdu-text' : 'uppercase'}`}>
            {labels[lang].palette}
          </h3>
        </div>
        <div className="flex gap-3">
          {result.colors.map((color, i) => (
            <div key={i} className="group relative">
              <div 
                style={{ backgroundColor: color }}
                className="w-12 h-12 rounded-full border border-black/5 shadow-inner"
              />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                {color}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="glass-card p-10 rounded-3xl relative overflow-hidden bg-white/80">
        {/* Mughal Motif Design */}
        <div className="absolute top-0 right-0 w-48 h-48 opacity-[0.05] pointer-events-none">
          <svg viewBox="0 0 100 100" fill="currentColor" className="text-heritage-gold">
            <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
          </svg>
        </div>
        
        {/* Main Search Button */}
        <motion.div variants={item} className="mb-8 flex justify-center">
          <button 
            onClick={() => window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(result.title + ' south asian wear embroidery luxury')}`, '_blank')}
            className="flex items-center gap-3 px-6 py-3 bg-silk-charcoal text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-royal-maroon transition-all shadow-lg"
          >
            <Search className="w-4 h-4" />
            <span className={lang === 'ur' ? 'urdu-text' : ''}>
              {lang === 'ur' ? 'ملتے جلتے ڈیزائن تلاش کریں' : 'Find Similar Inspirations'}
            </span>
          </button>
        </motion.div>

        <motion.div variants={item} className="mb-10 text-center">
          <span className={`text-[10px] uppercase font-bold tracking-[0.4em] text-heritage-gold mb-3 block ${lang === 'ur' ? 'urdu-text text-sm' : ''}`}>
            {labels[lang].boutique}
          </span>
          <h2 className={`text-4xl md:text-5xl mb-4 ${lang === 'ur' ? 'urdu-text leading-tight' : ''}`}>
            {lang === 'ur' ? result.urduTitle : result.title}
          </h2>
          <div className="mt-4 flex justify-center gap-4">
            <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
              result.complexity === 'High' ? 'border-royal-maroon text-royal-maroon bg-royal-maroon/5' :
              result.complexity === 'Medium' ? 'border-mehndi-green text-mehndi-green bg-mehndi-green/5' :
              'border-heritage-gold text-heritage-gold bg-heritage-gold/5'
            } ${lang === 'ur' ? 'urdu-text' : ''}`}>
              {result.complexity} {labels[lang].complexity}
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Column 1: Embroidery Styles */}
          <motion.section variants={item}>
            <div className={`flex items-center gap-3 mb-6 ${lang === 'ur' ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-heritage-gold/10 flex items-center justify-center border border-heritage-gold/20">
                <Scissors className="w-5 h-5 text-heritage-gold" />
              </div>
              <h3 className={`text-xl font-medium ${lang === 'ur' ? 'urdu-text pt-2' : ''}`}>{labels[lang].styles}</h3>
            </div>
            <ul className="space-y-6">
              {result.embroideryStyles.map((style, i) => (
                <li key={i} className="flex gap-4 group">
                  <div className="w-16 h-16 rounded-xl bg-heritage-gold/5 flex-shrink-0 flex items-center justify-center border border-heritage-gold/10 overflow-hidden relative">
                    <img 
                      src={getEmbroideryImage(style.style, style.description)}
                      alt={style.style}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${encodeURIComponent(style.style)}/150/150`;
                      }}
                    />
                  </div>
                    <div className={`flex flex-col ${lang === 'ur' ? 'text-right' : ''}`}>
                    <div className={`flex items-center justify-between gap-2 ${lang === 'ur' ? 'flex-row-reverse' : ''}`}>
                      <span className={`font-semibold text-silk-charcoal text-sm ${lang === 'ur' ? 'urdu-text text-lg' : ''}`}>
                        {lang === 'ur' ? style.urduStyle : style.style}
                      </span>
                      <button 
                        onClick={() => window.open(`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(style.style + ' embroidery south asian wear')}`, '_blank')}
                        className="text-[10px] text-heritage-gold hover:underline flex items-center gap-1 uppercase tracking-widest font-bold"
                      >
                        <Search className="w-3 h-3" />
                        {labels[lang].findSimilar}
                      </button>
                    </div>
                    <p className={`text-silk-charcoal/60 text-sm leading-relaxed ${lang === 'ur' ? 'urdu-text' : ''}`}>
                      {lang === 'ur' ? style.urduDescription : style.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Column 2: Placement */}
          <motion.section variants={item}>
            <div className={`flex items-center gap-3 mb-6 ${lang === 'ur' ? 'flex-row-reverse' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-heritage-gold/10 flex items-center justify-center border border-heritage-gold/20">
                <MapPin className="w-5 h-5 text-heritage-gold" />
              </div>
              <h3 className={`text-xl font-medium ${lang === 'ur' ? 'urdu-text pt-2' : ''}`}>{labels[lang].craft}</h3>
            </div>
            <ul className="space-y-6">
              {result.craftPlacement.map((placement, i) => (
                <li key={i} className={`flex flex-col ${lang === 'ur' ? 'text-right' : ''}`}>
                  <span className={`font-semibold text-silk-charcoal text-sm ${lang === 'ur' ? 'urdu-text text-lg' : ''}`}>
                    {lang === 'ur' ? placement.urduLocation : placement.location}
                  </span>
                  <p className={`text-silk-charcoal/60 text-sm leading-relaxed ${lang === 'ur' ? 'urdu-text' : ''}`}>
                    {lang === 'ur' ? placement.urduDetail : placement.detail}
                  </p>
                </li>
              ))}
            </ul>
          </motion.section>
        </div>

        <div className="h-[1px] w-full bg-heritage-gold/10 my-10" />

        <div className="grid md:grid-cols-2 gap-12">
          {/* Cost Section */}
          <motion.section variants={item} className="p-8 rounded-3xl bg-heritage-gold/5 border-2 border-heritage-gold/10 shadow-sm">
            <div className={`flex items-center gap-3 mb-4 ${lang === 'ur' ? 'flex-row-reverse' : ''}`}>
              <BadgeCheck className="w-5 h-5 text-heritage-gold" />
              <h3 className={`text-lg font-medium text-heritage-gold ${lang === 'ur' ? 'urdu-text pt-1' : ''}`}>{labels[lang].cost}</h3>
            </div>
            <div className={`text-3xl font-serif text-silk-charcoal mb-2 ${lang === 'ur' ? 'urdu-text text-4xl' : ''}`}>
              {formatter.format(result.costEstimate.min)} – {formatter.format(result.costEstimate.max)}
            </div>
            <p className={`text-xs text-silk-charcoal/40 font-medium uppercase tracking-widest ${lang === 'ur' ? 'urdu-text text-[10px]' : ''}`}>
              {lang === 'ur' ? 'پاکستان کی مارکیٹ کے مطابق متوقع قیمت' : 'Realistic Pakistani Tailoring Rates'}
            </p>
          </motion.section>

          {/* Production Insights */}
          <motion.section variants={item} className="p-8 rounded-3xl bg-silk-charcoal text-white shadow-xl relative overflow-hidden">
             {/* Subtle Motif */}
            <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="white">
                <circle cx="50" cy="50" r="40" stroke="white" fill="none" strokeWidth="0.5" strokeDasharray="2 2" />
              </svg>
            </div>

            <div className={`flex items-center gap-3 mb-6 ${lang === 'ur' ? 'flex-row-reverse' : ''}`}>
              <Clock className="w-5 h-5 text-heritage-gold" />
              <h3 className={`text-lg font-medium ${lang === 'ur' ? 'urdu-text pt-1' : ''}`}>{labels[lang].insight}</h3>
            </div>
            <div className={`grid grid-cols-2 gap-6 ${lang === 'ur' ? 'direction-rtl' : ''}`}>
              <div className={lang === 'ur' ? 'text-right' : ''}>
                <div className={`flex items-center gap-2 text-white/50 text-[10px] uppercase font-bold tracking-widest mb-1 ${lang === 'ur' ? 'justify-end' : ''}`}>
                  <Users className="w-3 h-3 text-heritage-gold" /> {labels[lang].team}
                </div>
                <div className={`text-xl font-serif ${lang === 'ur' ? 'urdu-text' : ''}`}>
                  {lang === 'ur' ? result.productionInsight.urduArtisans : result.productionInsight.artisans}
                </div>
              </div>
              <div className={lang === 'ur' ? 'text-right' : ''}>
                <div className={`flex items-center gap-2 text-white/50 text-[10px] uppercase font-bold tracking-widest mb-1 ${lang === 'ur' ? 'justify-end' : ''}`}>
                  <Clock className="w-3 h-3 text-heritage-gold" /> {labels[lang].timeline}
                </div>
                <div className={`text-xl font-serif ${lang === 'ur' ? 'urdu-text' : ''}`}>
                  {lang === 'ur' ? result.productionInsight.urduDays : result.productionInsight.days}
                </div>
              </div>
            </div>
          </motion.section>
        </div>

        {/* Smart Insights */}
        <motion.section variants={item} className="mt-10 pt-10 border-t border-heritage-gold/10">
          <div className={`flex items-center gap-3 mb-6 ${lang === 'ur' ? 'flex-row-reverse' : ''}`}>
            <Lightbulb className="w-5 h-5 text-heritage-gold" />
            <h3 className={`text-xl font-medium ${lang === 'ur' ? 'urdu-text pt-2' : ''}`}>{labels[lang].smart}</h3>
          </div>
          <div className="grid gap-4">
            {(lang === 'ur' ? result.urduSmartInsight : result.smartInsight).map((insight, i) => (
              <div key={i} className={`flex gap-4 p-4 rounded-xl bg-white border border-heritage-gold/5 shadow-sm items-start ${lang === 'ur' ? 'flex-row-reverse' : ''}`}>
                <div className="w-6 h-6 rounded-full bg-heritage-gold/10 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-heritage-gold">
                  {i + 1}
                </div>
                <p className={`text-silk-charcoal/80 text-sm leading-relaxed ${lang === 'ur' ? 'urdu-text text-right px-2' : ''}`}>
                  {insight}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Contact Artisan Link */}
        <motion.div variants={item} className="mt-12 flex justify-center">
          <button 
            onClick={() => setShowArtisans(true)}
            className="flex items-center gap-3 px-8 py-4 bg-heritage-gold text-white rounded-full font-bold shadow-xl hover:scale-105 transition-all text-xs uppercase tracking-[0.2em]"
          >
            <MapPin className="w-4 h-4" />
            <span className={lang === 'ur' ? 'urdu-text' : ''}>
              {labels[lang].contact}
            </span>
          </button>
        </motion.div>
      </div>

      <AnimatePresence>
        {showArtisans && (
          <ArtisanDirectory 
            detectedStyles={result.embroideryStyles.map(s => s.style)}
            onClose={() => setShowArtisans(false)}
            language={lang}
          />
        )}
      </AnimatePresence>

      <motion.div variants={item} className="text-center pb-8">
        <p className={`text-silk-charcoal/30 text-[10px] italic ${lang === 'ur' ? 'urdu-text' : ''}`}>
          {lang === 'ur' 
            ? 'نوٹ: یہ تخمینہ اوسط مارکیٹ ریٹ کی بنیاد پر ہے۔ کاریگر کی مہارت اور ڈیزائن کی پیچیدگی کے لحاظ سے قیمت میں فرق ہو سکتا ہے۔'
            : 'Disclaimer: These estimates are based on industry standards in Pakistan and may vary by boutique and artisan skill level.'
          }
        </p>
      </motion.div>
    </motion.div>
  );
}
