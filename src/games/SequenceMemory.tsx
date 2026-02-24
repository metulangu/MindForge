import { useState, useEffect, useCallback } from 'react';
import { GameShell } from '@/components/GameShell';
import { motion, AnimatePresence } from 'motion/react';
import { Grid3X3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = [
  { bg: 'bg-indigo-500', border: 'border-indigo-700', hover: 'hover:bg-indigo-400' },
  { bg: 'bg-rose-500', border: 'border-rose-700', hover: 'hover:bg-rose-400' },
  { bg: 'bg-emerald-500', border: 'border-emerald-700', hover: 'hover:bg-emerald-400' },
  { bg: 'bg-amber-500', border: 'border-amber-700', hover: 'hover:bg-amber-400' },
  { bg: 'bg-cyan-500', border: 'border-cyan-700', hover: 'hover:bg-cyan-400' },
  { bg: 'bg-violet-500', border: 'border-violet-700', hover: 'hover:bg-violet-400' },
  { bg: 'bg-orange-500', border: 'border-orange-700', hover: 'hover:bg-orange-400' },
  { bg: 'bg-pink-500', border: 'border-pink-700', hover: 'hover:bg-pink-400' },
];

export default function SequenceMemory() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [colorTheme, setColorTheme] = useState(COLORS[0]);
  const [showLevelIndicator, setShowLevelIndicator] = useState(false);
  const [gridSize, setGridSize] = useState<3 | 4>(3);
  const [isConfiguring, setIsConfiguring] = useState(true);

  const startGame = () => {
    setSequence([]);
    setUserSequence([]);
    setLevel(1);
    setGameOver(false);
    setIsPlaying(true);
    setIsConfiguring(false);
    setColorTheme(COLORS[0]);
    startLevel(1, []);
  };

  const startLevel = async (currentLevel: number, currentSequence: number[]) => {
    // Change color every level
    setColorTheme(COLORS[(currentLevel - 1) % COLORS.length]);
    
    // Show level indicator
    setShowLevelIndicator(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowLevelIndicator(false);
    
    // Small pause before sequence starts
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addToSequence(currentSequence);
  };

  const addToSequence = (currentSequence: number[]) => {
    const nextTile = Math.floor(Math.random() * (gridSize * gridSize));
    const newSequence = [...currentSequence, nextTile];
    setSequence(newSequence);
    setUserSequence([]);
    setIsShowingSequence(true);
    playSequence(newSequence);
  };

  const playSequence = async (seq: number[]) => {
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 300)); // Gap between flashes
      setActiveTile(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 600)); // Flash duration
      setActiveTile(null);
    }
    setIsShowingSequence(false);
  };

  const handleTileClick = (index: number) => {
    if (!isPlaying || isShowingSequence || gameOver || showLevelIndicator || isConfiguring) return;

    // Visual feedback
    setActiveTile(index);
    setTimeout(() => setActiveTile(null), 200);

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    // Check if correct
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }

    // Check if level complete
    if (newUserSequence.length === sequence.length) {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      // Wait a bit before starting next level
      setTimeout(() => startLevel(nextLevel, sequence), 500);
    }
  };

  const resetGame = () => {
    setIsConfiguring(true);
    setIsPlaying(false);
    setGameOver(false);
    setSequence([]);
    setUserSequence([]);
    setLevel(1);
  };

  return (
    <GameShell title="Sequence Memory" score={level - 1} onRestart={resetGame}>
      <div className="absolute inset-0 bg-[#0f172a] flex flex-col items-center justify-center text-white p-6 select-none overflow-hidden">
        
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              x: [0, 100, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-600 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              x: [0, -100, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-purple-600 rounded-full blur-[120px]" 
          />
        </div>

        {isConfiguring && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-12 p-6 max-w-2xl pointer-events-auto z-10 text-white"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
              <div className="relative bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl inline-block">
                <Grid3X3 size={100} className="text-indigo-400" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">Sequence Memory</h1>
              <p className="text-2xl text-slate-400 font-medium max-w-lg mx-auto">
                Watch the nodes resonate and repeat the sequence.
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Select Grid Density</p>
              <div className="grid grid-cols-2 gap-4">
                {[3, 4].map((size) => (
                  <button
                    key={size}
                    onClick={() => setGridSize(size as 3 | 4)}
                    className={cn(
                      "p-5 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-sm",
                      gridSize === size 
                        ? "border-indigo-500 bg-indigo-500/20 text-white shadow-[0_0_30px_rgba(99,102,241,0.3)]" 
                        : "border-white/10 bg-white/5 text-slate-500 hover:border-white/20"
                    )}
                  >
                    {size}x{size}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={startGame}
              className="group relative px-16 py-6 bg-indigo-600 rounded-2xl font-black text-2xl uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-indigo-50 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(79,70,229,0.3)]"
            >
              <span className="relative z-10">Initiate Sequence</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </motion.div>
        )}

        {gameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-12 z-20 absolute inset-0 flex flex-col items-center justify-center bg-[#0f172a]/90 backdrop-blur-sm"
          >
            <div className="space-y-4">
              <h3 className="text-8xl font-black italic uppercase tracking-tighter text-red-500">Sequence Broken</h3>
              <p className="text-2xl text-slate-400 font-medium">Neural link lost at Level {level}</p>
            </div>
            
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20" />
              <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] space-y-2">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Peak Resonance</p>
                <p className="text-9xl font-black italic tracking-tighter text-indigo-400">{level - 1}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={startGame}
                className="px-16 py-6 bg-white text-slate-900 rounded-2xl font-black text-2xl uppercase tracking-widest hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                Re-Initiate
              </button>
              <button
                onClick={resetGame}
                className="px-16 py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-2xl uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                Settings
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {showLevelIndicator && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, filter: "blur(20px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
              className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
            >
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-4">Sequence Level</span>
                <h2 className="text-[12rem] font-black italic tracking-tighter leading-none text-white drop-shadow-2xl">{level}</h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isConfiguring && (
          <div className="w-full max-w-4xl flex flex-col items-center z-10">
            <div className="w-full flex justify-between items-center px-12 mb-12">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Current Level</span>
                <span className="text-4xl font-black italic tracking-tighter">{level}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Progress</span>
                <span className="text-4xl font-black italic tracking-tighter">{userSequence.length} / {sequence.length}</span>
              </div>
            </div>

            <div 
              className={cn(
                "grid gap-4 sm:gap-6 p-4 w-full mx-auto transition-all duration-500",
                (!isPlaying && !gameOver) ? 'opacity-50 blur-sm pointer-events-none' : 'opacity-100'
              )}
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                maxWidth: gridSize === 3 ? '480px' : '600px'
              }}
            >
              {Array.from({ length: gridSize * gridSize }).map((_, i) => (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => handleTileClick(i)}
                  className={cn(
                    "aspect-square w-full rounded-2xl sm:rounded-[2rem] shadow-2xl transition-all duration-300 border border-white/5",
                    activeTile === i 
                      ? "bg-white scale-105 shadow-[0_0_40px_rgba(255,255,255,0.6)] z-10" 
                      : "bg-white/5 hover:bg-white/10"
                  )}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}
