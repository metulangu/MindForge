import { useState, useEffect, useCallback } from 'react';
import { GameShell } from '@/components/GameShell';
import { motion, AnimatePresence } from 'motion/react';

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
      {isConfiguring && (
        <div className="text-center space-y-8 p-6 max-w-md mx-auto">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">Memorize the Pattern</h3>
            <p className="text-slate-600">Watch the tiles light up and repeat the sequence.</p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Grid Size</label>
            <div className="grid grid-cols-2 gap-3">
              {[3, 4].map((size) => (
                <button
                  key={size}
                  onClick={() => setGridSize(size as 3 | 4)}
                  className={`p-4 rounded-xl border-2 transition-all font-bold ${gridSize === size ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                >
                  {size}x{size}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Game
          </button>
        </div>
      )}

      {gameOver && (
        <div className="text-center space-y-6 absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center">
          <h3 className="text-4xl font-bold text-slate-900">Game Over</h3>
          <p className="text-xl text-slate-600">You reached Level {level}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={startGame}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Try Again
            </button>
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all"
            >
              Change Settings
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showLevelIndicator && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          >
            <div className="bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-xl border border-slate-200">
              <h2 className="text-4xl font-bold text-slate-900">Level {level}</h2>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isConfiguring && (
        <div 
          className={`grid gap-3 sm:gap-4 p-4 sm:p-8 w-full mx-auto transition-opacity duration-300 ${(!isPlaying && !gameOver) ? 'opacity-50 blur-sm pointer-events-none' : 'opacity-100'}`}
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            maxWidth: gridSize === 3 ? '480px' : '600px'
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTileClick(i)}
              className={`
                aspect-square w-full rounded-xl sm:rounded-2xl shadow-sm transition-all duration-200 border-b-4
                ${activeTile === i 
                  ? 'bg-white border-white shadow-[0_0_30px_rgba(255,255,255,0.8)] z-10 scale-105' 
                  : `${colorTheme.bg} ${colorTheme.border} ${colorTheme.hover}`
                }
              `}
            />
          ))}
        </div>
      )}
    </GameShell>
  );
}
