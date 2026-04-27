import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function LoadingScreen({ language = 'en' }: { language?: 'en' | 'ur', key?: string | number }) {
  const content = {
    en: {
      title: "Consulting our AI Artisans...",
      subtitle: "Breaking down every thread and motif"
    },
    ur: {
      title: "ہمارے اے آئی کاریگروں سے مشاورت جاری ہے...",
      subtitle: "ہر دھاگے اور نقش کی تفصیل دیکھی جا رہی ہے"
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="glass-card p-16 flex flex-col items-center justify-center rounded-3xl min-h-[400px]"
    >
      <div className="relative mb-12">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          className="w-32 h-32 border-2 border-heritage-gold/20 border-t-heritage-gold rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-heritage-gold animate-pulse" />
        </div>
      </div>
      
      <h2 className={`text-2xl mb-3 ${language === 'ur' ? 'urdu-text' : ''}`}>
        {content[language].title}
      </h2>
      <p className={`text-silk-charcoal/40 serif-display italic text-lg ${language === 'ur' ? 'urdu-text' : ''}`}>
        {content[language].subtitle}
      </p>
      
      <div className="mt-12 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
            className="w-1.5 h-1.5 bg-heritage-gold rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
}
