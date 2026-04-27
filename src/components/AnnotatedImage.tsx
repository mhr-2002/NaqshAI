import React from 'react';
import { motion } from 'motion/react';
import { Annotation } from '../types';

interface Props {
  imageUrl: string;
  annotations: Annotation[];
}

export default function AnnotatedImage({ imageUrl, annotations, language = 'en' }: { imageUrl: string; annotations: Annotation[]; language?: 'en' | 'ur' }) {
  const [imageSize, setImageSize] = React.useState<{ width: number; height: number; top: number; left: number } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);

  const calculateImageBounds = () => {
    if (!imgRef.current || !containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const img = imgRef.current;
    
    const containerRatio = container.width / container.height;
    const imageRatio = img.naturalWidth / img.naturalHeight;
    
    let width, height, top, left;
    
    if (imageRatio > containerRatio) {
      // Image is wider than container
      width = container.width;
      height = container.width / imageRatio;
      left = 0;
      top = (container.height - height) / 2;
    } else {
      // Image is taller than container
      height = container.height;
      width = container.height * imageRatio;
      top = 0;
      left = (container.width - width) / 2;
    }
    
    setImageSize({ width, height, top, left });
  };

  React.useEffect(() => {
    const handleResize = () => calculateImageBounds();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square md:aspect-[3/4] max-h-[700px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white group bg-silk-charcoal/5"
    >
      <img 
        ref={imgRef}
        src={imageUrl} 
        alt="Target South Asian wear" 
        className="w-full h-full object-contain transition-transform duration-700"
        onLoad={calculateImageBounds}
      />
      
      {/* Annotations Overlay - Positioned to match the contained image */}
      {imageSize && (
        <div 
          className="absolute pointer-events-none"
          style={{
            top: imageSize.top,
            left: imageSize.left,
            width: imageSize.width,
            height: imageSize.height
          }}
        >
          {annotations.map((ann, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              style={{ 
                left: `${ann.x / 10}%`, 
                top: `${ann.y / 10}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className="absolute pointer-events-auto"
            >
            <div className="relative group/ann">
              {/* Dot */}
              <div className="w-5 h-5 bg-heritage-gold rounded-full border-2 border-white shadow-lg animate-pulse cursor-pointer" />
              
              {/* Label */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover/ann:opacity-100 transition-opacity duration-300 z-50">
                <div className={`bg-silk-charcoal text-white text-[10px] whitespace-nowrap px-4 py-2 rounded-lg font-bold shadow-xl border border-white/10 ${language === 'ur' ? 'urdu-text text-sm' : 'uppercase tracking-widest'}`}>
                  {language === 'ur' ? ann.urduLabel : ann.label}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
        <span className="inline-block px-3 py-1 bg-heritage-gold text-[10px] uppercase font-bold tracking-widest text-white rounded mb-2">
          {language === 'ur' ? 'کرافٹ تجزیہ' : 'Annotated Craftsmanship Analysis'}
        </span>
        <p className="text-white/70 text-[10px] italic">
          {language === 'ur' ? 'تفصیلات کے لیے نشانات پر ہور کریں' : 'Hover over dots to see detail'}
        </p>
      </div>
    </div>
  );
}
