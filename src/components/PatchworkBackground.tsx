import React, { useMemo } from 'react';

const PATTERNS = [
  '/BalochiNeedlework-1.png',
  '/Punjabi-1.png',
  '/Sindhi-1.png',
  '/gota.png',
  '/Zardozi-1.png',
  '/Resham-1.png',
  '/embroidery-Dabka.png',
  '/embroidery-Jaali-Jaal.png',
  '/embroidery-Kamdani(Mukesh).png',
  '/embroidery-StoneWork.png',
  '/embroidery-Resham-1.png',
  '/embroidery-Zardozi-1.png',
  '/embroidery-Sindhi.png',
  '/embroidery-Zardozi2.png',
];

export default function PatchworkBackground() {
  // Create a grid of patterns
  const gridItems = useMemo(() => {
    const items = [];
    const rows = 10;
    const cols = 6;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = (r * cols + c) % PATTERNS.length;
        items.push(PATTERNS[idx]);
      }
    }
    return items;
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] bg-[#fdfbf6]">
      <div 
        className="absolute top-[-5%] left-[-5%] w-[110%] grid grid-cols-6 gap-0 opacity-20"
      >
        {gridItems.map((pattern, i) => {
          let position = 'center';
          if (pattern.includes('gota')) position = 'right center';
          if (pattern.toLowerCase().includes('zardozi')) position = 'center top';

          return (
            <div 
              key={i}
              className="relative w-full aspect-square overflow-hidden border-[0.5px] border-black/5"
            >
               <div 
                 className="absolute inset-0 transition-transform duration-700 scale-[1.5] transform-gpu"
                 style={{ 
                   backgroundImage: `url('${pattern}')`, 
                   backgroundSize: 'cover', 
                   backgroundPosition: position,
                   backgroundRepeat: 'no-repeat'
                 }}
               />
               <div className="absolute inset-0 bg-white/10" />
            </div>
          );
        })}
      </div>
      
      {/* Readability gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fdfbf6]/40 via-transparent to-[#fdfbf6]/80" />
      <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
    </div>
  );
}
