import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Camera, Upload, Trash2, Heart } from 'lucide-react';
import { analyzeSouthAsianOutfit } from './services/geminiService';
import { AnalysisResult, AnalysisStatus } from './types';
import AnalysisReport from './components/AnalysisReport';
import LoadingScreen from './components/LoadingScreen';
import AnnotatedImage from './components/AnnotatedImage';
import PatchworkBackground from './components/PatchworkBackground';

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'ur'>('en');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image of a South Asian outfit.');
      return;
    }

    setStatus('uploading');
    setError(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImage(base64);
      
      try {
        setStatus('analyzing');
        const analysisBase64 = base64.split(',')[1];
        const res = await analyzeSouthAsianOutfit(analysisBase64);
        setResult(res);
        setStatus('completed');
      } catch (err: any) {
        console.error("Analysis Error:", err);
        const errorMessage = err?.message || 'The artisan is busy at the moment. Please try again.';
        setError(errorMessage.includes('not found') ? `Model error: ${errorMessage}` : 'The artisan is busy at the moment. Please try again.');
        setStatus('error');
      }
    };
    reader.onerror = () => {
      setError('Failed to read the image file.');
      setStatus('error');
    };
    reader.readAsDataURL(file);
  };

  const content = {
    en: {
      tagline: "South Asian Embroidery Analysis & Artisan Consultation",
      title: "Share Your Inspiration",
      description: "Upload a photo of an outfit. Naqsh AI will break down the craft, provide expert insights, and connect you to skilled artisans.",
      button: "Choose Image",
      startOver: "Start Over",
      complete: "Analysis Complete",
      footer: "© 2026 NaqshAI Heritage Studio · Lahore"
    },
    ur: {
      tagline: "جنوبی ایشیائی کڑھائی کا تجزیہ اور کاریگروں سے مشاورت",
      title: "اپنی پسند شیئر کریں",
      description: "کسی بھی لباس کی تصویر اپ لوڈ کریں۔ نقش اے آئی اس کی کاریگری کی تفصیل بتائے گا، اور آپ کو ماہر کاریگروں سے جوڑے گا۔",
      button: "تصویر منتخب کریں",
      startOver: "دوبارہ شروع کریں",
      complete: "تجزیہ مکمل",
      footer: "© 2026 نقش اے آئی ہیریٹیج اسٹوڈیو · لاہور"
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setStatus('idle');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden relative">
      <PatchworkBackground />

      {/* Language Toggle */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-1 p-1 bg-white/50 backdrop-blur-md rounded-full border border-heritage-gold/20 shadow-lg">
        <button 
          onClick={() => setLang('en')}
          className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all ${lang === 'en' ? 'bg-heritage-gold text-white shadow-md' : 'text-silk-charcoal/40 hover:text-silk-charcoal'}`}
        >
          EN
        </button>
        <button 
          onClick={() => setLang('ur')}
          className={`px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full transition-all ${lang === 'ur' ? 'bg-heritage-gold text-white shadow-md' : 'text-silk-charcoal/40 hover:text-silk-charcoal'} urdu-text`}
          style={{ fontSize: lang === 'ur' ? '12px' : '10px' }}
        >
          اردو
        </button>
      </div>
      
      <header className="relative z-10 mb-16 text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex items-center justify-center gap-3 mb-2 drop-shadow-sm"
        >
          <span className="text-6xl md:text-7xl text-silk-charcoal tracking-tight font-serif drop-shadow-[0_2px_8px_rgba(255,255,255,1)]">AI</span>
          <span className="text-5xl md:text-6xl text-royal-maroon leading-none relative top-3 drop-shadow-[0_2px_8px_rgba(255,255,255,1)]" style={{ fontFamily: 'var(--font-gulzar)' }}>نقش</span>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-lg md:text-xl text-black font-bold serif-display max-w-xl mx-auto drop-shadow-sm ${lang === 'ur' ? 'urdu-text' : ''}`}
        >
          {content[lang].tagline}
        </motion.p>
      </header>

      <main className="relative z-10 w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {status === 'idle' || status === 'error' ? (
            <motion.div
              layoutId="uploader"
              key="uploader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="arch-card p-12 text-center max-w-[420px] mx-auto pt-24"
            >
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 rounded-full bg-heritage-gold/5 flex items-center justify-center border border-heritage-gold/20">
                  <Camera className="w-10 h-10 text-heritage-gold" />
                </div>
              </div>
              
              <h2 className={`text-3xl mb-4 text-black ${lang === 'ur' ? 'urdu-text' : ''}`}>
                {content[lang].title}
              </h2>
              <p className={`text-black mb-10 max-w-md mx-auto font-medium ${lang === 'ur' ? 'urdu-text leading-relaxed' : ''}`}>
                {content[lang].description}
              </p>

              <label className="luxury-button inline-flex items-center gap-3 cursor-pointer">
                <Upload className="w-5 h-5" />
                <span className={lang === 'ur' ? 'urdu-text' : ''}>{content[lang].button}</span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
              </label>

              {error && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 text-royal-maroon text-sm font-medium"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>
          ) : status === 'analyzing' || status === 'uploading' ? (
            <LoadingScreen key="loading" language={lang} />
          ) : result && image ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className={`flex justify-between items-center px-4 ${lang === 'ur' ? 'flex-row-reverse' : ''}`}>
                <button 
                  onClick={reset}
                  className={`text-sm font-medium text-silk-charcoal/40 hover:text-royal-maroon transition-colors flex items-center gap-2 ${lang === 'ur' ? 'flex-row-reverse urdu-text' : ''}`}
                >
                  <Trash2 className="w-4 h-4" /> {content[lang].startOver}
                </button>
                <div className={`text-xs uppercase tracking-widest font-semibold text-heritage-gold flex items-center gap-2 ${lang === 'ur' ? 'flex-row-reverse urdu-text' : ''}`}>
                  <Sparkles className="w-3 h-3" /> {content[lang].complete}
                </div>
              </div>
              
              <AnnotatedImage 
                imageUrl={image} 
                annotations={result.annotations} 
                language={lang}
              />

              <AnalysisReport result={result} language={lang} setLanguage={setLang} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <footer className={`mt-20 text-center opacity-30 text-[10px] uppercase tracking-[0.3em] font-semibold ${lang === 'ur' ? 'urdu-text' : ''}`}>
        {content[lang].footer}
      </footer>
    </div>
  );
}
