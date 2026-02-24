import { useState, useEffect, useCallback } from 'react';
import { GameShell } from '@/components/GameShell';
import { motion, AnimatePresence } from 'motion/react';
import { Grid3X3, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

type GameState = 'start' | 'blinking' | 'showing' | 'playing' | 'result' | 'gameOver';

export default function VisualMemory() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(3);
  const [tilesToRemember, setTilesToRemember] = useState(1);
  const [targetTiles, setTargetTiles] = useState<number[]>([]);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [lives, setLives] = useState(3);
  const [maxLevel, setMaxLevel] = useState(1);

  const calculateLevelConfig = (lvl: number) => {
    let gSize = 3;
    let tCount = lvl;

    if (lvl > 8) {
      gSize = 4;
      tCount = lvl - 8;
    }
    if (lvl > 23) {
      gSize = 5;
      tCount = lvl - 23;
    }
    if (lvl > 47) {
      gSize = 6;
      tCount = lvl - 47;
    }
    
    // Cap tile count to grid capacity - 1
    const maxPossible = (gSize * gSize) - 1;
    if (tCount > maxPossible) tCount = maxPossible;

    return { gSize, tCount };
  };

  const startLevel = useCallback((targetLevel: number) => {
    const { gSize, tCount } = calculateLevelConfig(targetLevel);
    
    setGridSize(gSize);
    setTilesToRemember(tCount);
    
    const totalTiles = gSize * gSize;
    const newTargets: number[] = [];
    while (newTargets.length < tCount) {
      const rand = Math.floor(Math.random() * totalTiles);
      if (!newTargets.includes(rand)) {
        newTargets.push(rand);
      }
    }
    
    setTargetTiles(newTargets);
    setSelectedTiles([]);
    
    // Step 1: Blinking transition (all tiles light up briefly)
    setGameState('blinking');
    
    setTimeout(() => {
      // Step 2: Show target tiles
      setGameState('showing');
      
      setTimeout(() => {
        // Step 3: Start playing
        setGameState('playing');
      }, 1000);
    }, 400);
  }, []);

  const handleTileClick = (index: number) => {
    if (gameState !== 'playing') return;
    if (selectedTiles.includes(index)) return;

    const newSelected = [...selectedTiles, index];
    setSelectedTiles(newSelected);

    if (!targetTiles.includes(index)) {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameState('gameOver');
        } else {
          setGameState('result');
        }
        return newLives;
      });
      return;
    }

    if (newSelected.length === targetTiles.length) {
      setMaxLevel(Math.max(maxLevel, level));
      const nextLvl = level + 1;
      setLevel(nextLvl);
      setTimeout(() => {
        startLevel(nextLvl);
      }, 500);
    }
  };

  const resetGame = () => {
    setLevel(1);
    setLives(3);
    setMaxLevel(1);
    setGameState('start');
  };

  return (
    <GameShell title="Visual Memory" score={level} onRestart={resetGame}>
      <div className="absolute inset-0 bg-[#0f172a] flex flex-col items-center justify-center text-white p-6 select-none overflow-hidden">
        
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              x: [0, -100, 0],
              y: [0, 100, 0]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] right-[-20%] w-[70%] h-[70%] bg-blue-600 rounded-full blur-[150px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.4, 1],
              x: [0, 100, 0],
              y: [0, -100, 0]
            }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] left-[-20%] w-[70%] h-[70%] bg-indigo-600 rounded-full blur-[150px]" 
          />
        </div>

        {/* Header Info */}
        {(gameState === 'showing' || gameState === 'playing' || gameState === 'blinking') && (
          <div className="absolute top-8 left-0 w-full flex justify-between items-center px-12 z-20">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Current Level</span>
              <span className="text-4xl font-black italic tracking-tighter">{level}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-2">Stability</span>
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={{ 
                      scale: i < lives ? 1 : 0.8,
                      opacity: i < lives ? 1 : 0.2
                    }}
                    className="w-8 h-1.5 bg-white rounded-full"
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {gameState === 'start' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-12 max-w-2xl z-10"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 animate-pulse" />
              <div className="relative bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                <Grid3X3 size={100} className="text-blue-400" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">Visual Memory</h1>
              <p className="text-2xl text-slate-400 font-medium max-w-lg mx-auto">
                Memorize the spatial configuration of the active nodes.
              </p>
            </div>
            <button
              onClick={() => {
                setLevel(1);
                startLevel(1);
              }}
              className="group relative px-16 py-6 bg-blue-600 rounded-2xl font-black text-2xl uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-blue-500 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(37,99,235,0.3)]"
            >
              <span className="relative z-10">Initiate Sequence</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </motion.div>
        )}

        {(gameState === 'showing' || gameState === 'playing' || gameState === 'blinking') && (
          <motion.div 
            layout
            className="grid gap-2 sm:gap-3 w-full max-w-[420px] aspect-square z-10"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` 
            }}
          >
            {Array.from({ length: gridSize * gridSize }).map((_, i) => {
              const isTarget = targetTiles.includes(i);
              const isSelected = selectedTiles.includes(i);
              
              return (
                <motion.button
                  key={i}
                  layout
                  whileTap={gameState === 'playing' ? { scale: 0.92 } : {}}
                  onClick={() => handleTileClick(i)}
                  className={cn(
                    "rounded-xl sm:rounded-2xl transition-all duration-300 shadow-lg border border-white/5",
                    gameState === 'blinking'
                      ? "bg-white scale-105 shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                      : gameState === 'showing' 
                        ? (isTarget ? "bg-white scale-100 shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "bg-white/5")
                        : (isSelected 
                            ? (isTarget ? "bg-white shadow-[0_0_20px_rgba(255,255,255,0.3)]" : "bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]") 
                            : "bg-white/5 hover:bg-white/10")
                  )}
                />
              );
            })}
          </motion.div>
        )}

        {gameState === 'result' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-12 z-10"
          >
            <div className="space-y-4">
              <h2 className="text-8xl font-black italic uppercase tracking-tighter text-amber-400">Interrupted</h2>
              <p className="text-2xl text-slate-400 font-medium">Synchronization failed at Level {level}</p>
            </div>
            <button
              onClick={() => startLevel(level)}
              className="px-16 py-6 bg-white text-slate-900 rounded-2xl font-black text-2xl uppercase tracking-widest hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              Retry Level {level}
            </button>
          </motion.div>
        )}

        {gameState === 'gameOver' && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-12 z-10"
          >
            <div className="space-y-4">
              <h3 className="text-8xl font-black italic uppercase tracking-tighter text-red-500">Critical Failure</h3>
              <p className="text-2xl text-slate-400 font-medium">Neural link lost</p>
            </div>
            
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20" />
              <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] space-y-2">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Peak Performance</p>
                <p className="text-9xl font-black italic tracking-tighter text-blue-400">{maxLevel}</p>
              </div>
            </div>

            <button
              onClick={resetGame}
              className="px-16 py-6 bg-white text-slate-900 rounded-2xl font-black text-2xl uppercase tracking-widest hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              Re-Initiate
            </button>
          </motion.div>
        )}
      </div>
    </GameShell>
  );
}
