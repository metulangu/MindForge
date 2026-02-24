import { useState, useEffect, useRef, MouseEvent } from 'react';
import { GameShell } from '@/components/GameShell';
import { motion, AnimatePresence } from 'motion/react';
import { Target } from 'lucide-react';

interface TargetPos {
  id: number;
  x: number;
  y: number;
}

export default function AimTrainer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [targets, setTargets] = useState<TargetPos[]>([]);
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(true);
  const [targetCount, setTargetCount] = useState(30);
  const [targetSize, setTargetSize] = useState<'small' | 'medium' | 'large'>('medium');
  const containerRef = useRef<HTMLDivElement>(null);
  
  const startGame = () => {
    setIsPlaying(true);
    setIsConfiguring(false);
    setScore(0);
    setMisses(0);
    setGameOver(false);
    setTargets([]);
    setStartTime(Date.now());
    spawnTarget();
  };

  const spawnTarget = () => {
    if (!containerRef.current) return;
    
    const { width, height } = containerRef.current.getBoundingClientRect();
    const padding = 60;
    
    const x = Math.random() * (width - padding * 2) + padding;
    const y = Math.random() * (height - padding * 2) + padding;
    
    setTargets([{ id: Date.now(), x, y }]);
  };

  const handleTargetClick = (e: MouseEvent, id: number) => {
    e.stopPropagation();
    
    if (score + 1 >= targetCount) {
      endGame();
    } else {
      setScore(s => s + 1);
      spawnTarget();
    }
  };

  const handleMiss = () => {
    if (isPlaying) {
      setMisses(m => m + 1);
    }
  };

  const endGame = () => {
    setEndTime(Date.now());
    setIsPlaying(false);
    setGameOver(true);
    setTargets([]);
  };

  const resetGame = () => {
    setIsConfiguring(true);
    setIsPlaying(false);
    setGameOver(false);
  };

  const sizeClasses = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  return (
    <GameShell title="Aim Trainer" score={`${score}/${targetCount}`} onRestart={resetGame}>
      <div 
        ref={containerRef}
        className="absolute inset-0 cursor-crosshair z-0"
        onMouseDown={handleMiss}
      >
        <AnimatePresence>
          {targets.map(target => (
            <motion.button
              key={target.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.1 }}
              style={{ 
                position: 'absolute', 
                left: target.x, 
                top: target.y,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseDown={(e) => handleTargetClick(e, target.id)}
              className={`${sizeClasses[targetSize]} rounded-full bg-rose-500 border-4 border-white shadow-lg flex items-center justify-center group hover:bg-rose-400 active:scale-90 transition-colors z-10`}
            >
              <div className="w-1/2 h-1/2 rounded-full bg-white/20 group-hover:bg-white/40" />
              <div className="absolute w-2 h-2 bg-white rounded-full" />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {isConfiguring && (
        <div className="text-center space-y-8 p-6 max-w-md mx-auto z-20 relative bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200 shadow-xl pointer-events-auto">
          <Target size={64} className="mx-auto text-rose-500" />
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">Aim Trainer Settings</h3>
            <p className="text-slate-600">Hit the targets as fast as you can.</p>
          </div>

          <div className="space-y-6 text-left">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Target Count</label>
              <div className="grid grid-cols-3 gap-3">
                {[10, 30, 50].map((count) => (
                  <button
                    key={count}
                    onClick={() => setTargetCount(count)}
                    className={`p-3 rounded-xl border-2 transition-all font-bold ${targetCount === count ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Target Size</label>
              <div className="grid grid-cols-3 gap-3">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setTargetSize(size)}
                    className={`p-3 rounded-xl border-2 transition-all font-bold capitalize ${targetSize === size ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onMouseDown={(e) => {
              e.stopPropagation();
              startGame();
            }}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Training
          </button>
        </div>
      )}

      {gameOver && (
        <div className="text-center space-y-6 z-20 relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl border border-slate-200 shadow-xl">
          <h3 className="text-4xl font-bold text-slate-900">Training Complete</h3>
          <div className="grid grid-cols-2 gap-8 text-left max-w-xs mx-auto">
            <div>
              <p className="text-sm text-slate-500 uppercase font-bold">Time</p>
              <p className="text-3xl font-mono font-bold text-slate-900">{((endTime - startTime) / 1000).toFixed(2)}s</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 uppercase font-bold">Avg Time</p>
              <p className="text-3xl font-mono font-bold text-slate-900">{((endTime - startTime) / targetCount).toFixed(0)}ms</p>
            </div>
            <div className="col-span-2 text-center mt-4">
              <p className="text-sm text-slate-500 uppercase font-bold">Misses</p>
              <p className="text-2xl font-mono font-bold text-rose-500">{misses}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Try Again
            </button>
            <button
              onMouseDown={(e) => {
                e.stopPropagation();
                resetGame();
              }}
              className="px-8 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all"
            >
              Change Settings
            </button>
          </div>
        </div>
      )}
    </GameShell>
  );
}
