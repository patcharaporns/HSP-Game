import React from 'react';
import { FlowerType, PlantedFlower } from '../types';
import { FLOWERS } from '../constants';

interface GardenProps {
  plantedFlowers: PlantedFlower[];
  selectedFlowerType: FlowerType;
  isPlanting: boolean;
}

export const Garden: React.FC<GardenProps> = ({ plantedFlowers, selectedFlowerType, isPlanting }) => {
  const flowerConfig = FLOWERS.find(f => f.id === selectedFlowerType) || FLOWERS[0];

  return (
    <div className="relative w-full h-80 md:h-[450px] rounded-[2rem] overflow-hidden shadow-2xl border-8 border-white bg-sky-300">
      
      {/* --- SKY LAYER --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#4facfe] to-[#00f2fe] z-0"></div>
      
      {/* Sun & Rays */}
      <div className="absolute -top-10 -right-10 w-40 h-40 z-0">
        <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-60"></div>
        <div className="absolute inset-4 bg-yellow-200 rounded-full shadow-[0_0_60px_rgba(255,255,0,0.8)]"></div>
        {/* Sun Rays */}
        <div className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,255,255,0.4)_20deg,transparent_40deg,rgba(255,255,255,0.4)_60deg,transparent_80deg,rgba(255,255,255,0.4)_100deg,transparent_120deg,rgba(255,255,255,0.4)_140deg,transparent_160deg,rgba(255,255,255,0.4)_180deg,transparent_200deg,rgba(255,255,255,0.4)_220deg,transparent_240deg,rgba(255,255,255,0.4)_260deg,transparent_280deg,rgba(255,255,255,0.4)_300deg,transparent_320deg,rgba(255,255,255,0.4)_340deg,transparent_360deg)] animate-spin-slow opacity-30 pointer-events-none"></div>
      </div>

      {/* Clouds */}
      <div className="absolute top-10 left-10 text-7xl opacity-90 animate-float drop-shadow-lg z-10" style={{ filter: 'brightness(1.1)' }}>☁️</div>
      <div className="absolute top-24 right-1/3 text-6xl opacity-70 animate-float z-0" style={{ animationDelay: '2s' }}>☁️</div>

      {/* --- BACKGROUND HILLS --- */}
      <div className="absolute bottom-16 -left-20 w-[120%] h-64 bg-[#4ade80] rounded-[50%] z-10 shadow-inner"></div>
      <div className="absolute bottom-10 -right-20 w-[120%] h-56 bg-[#22c55e] rounded-[50%] z-20 shadow-lg"></div>

      {/* --- FOREGROUND GROUND --- */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-b from-[#16a34a] to-[#15803d] z-30 rounded-t-[50px] shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        {/* Grass Texture Pattern */}
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #a7f3d0 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>
      </div>

      {/* --- FLOWERS CONTAINER --- */}
      <div className="absolute inset-0 z-30 flex items-end justify-center pb-8 pointer-events-none">
        <div className="w-full h-full relative">
        {plantedFlowers.map((flower, idx) => {
          // Calculate depth-based scaling and positioning
          // y = 0 is top, 100 is bottom. We want y to reflect depth (higher Y = closer = larger)
          // But input Y is random. Let's map it: High Y = foreground (bottom), Low Y = background (top of grass)
          const bottomPos = 5 + (flower.y * 0.4); // 5% to 45% from bottom
          const scale = 0.6 + (flower.y * 0.008); // 0.6 to 1.4 scale
          const zIndex = Math.floor(flower.y);
          
          return (
            <div 
              key={`${flower.id}-${idx}`}
              className="absolute animate-pop-in origin-bottom"
              style={{
                left: `${flower.x}%`,
                bottom: `${bottomPos}%`,
                zIndex: zIndex + 30,
                transform: `scale(${scale})`,
              }}
            >
              <div className="flex flex-col items-center group animate-sway" style={{ animationDelay: `${idx * 0.2}s` }}>
                 {/* Flower Head */}
                <div className="text-5xl md:text-6xl filter drop-shadow-xl transform group-hover:scale-125 transition-transform duration-300 cursor-pointer relative">
                  {flowerConfig.emoji}
                  {/* Sparkle effect on bloom */}
                  <div className="absolute -top-2 -right-2 text-yellow-300 text-xl animate-pulse">✨</div>
                </div>
                {/* Stem */}
                <div className="w-2 h-8 md:h-12 bg-gradient-to-b from-green-500 to-green-800 rounded-full -mt-2 shadow-md"></div>
                {/* Leaves */}
                <div className="absolute bottom-2 flex w-12 justify-between px-1">
                   <div className="w-4 h-4 bg-green-600 rounded-full rounded-tr-none transform -rotate-45 shadow-sm"></div>
                   <div className="w-4 h-4 bg-green-600 rounded-full rounded-tl-none transform rotate-45 shadow-sm"></div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* --- CHARACTER --- */}
      {isPlanting && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce transition-all duration-500">
           <div className="text-8xl filter drop-shadow-2xl relative">
             🧑‍🌾
             <div className="absolute -top-4 right-0 text-4xl animate-ping">✨</div>
           </div>
           <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-2xl shadow-xl border-2 border-green-400 whitespace-nowrap animate-pop-in">
             <span className="text-green-600 font-bold font-disney">เยี่ยมมาก!</span>
             <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-green-400 transform rotate-45"></div>
           </div>
        </div>
      )}

      {/* --- FOREGROUND OVERLAY (Vignette) --- */}
      <div className="absolute inset-0 pointer-events-none rounded-[2rem] shadow-[inset_0_0_60px_rgba(0,0,0,0.1)] z-50"></div>
    </div>
  );
};
