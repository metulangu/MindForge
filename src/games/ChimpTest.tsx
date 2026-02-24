import { useState, useEffect, useRef, useCallback } from 'react';
import { GameShell } from '@/components/GameShell';
import { motion, AnimatePresence } from 'motion/react';
import { Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NumberTile {
  id: number;
  value: number;
  x: number;
  y: number;
}

export default function ChimpTest() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result' | 'gameOver'>('start');
  const [tiles, setTiles] = useState<NumberTile[]>([]);
  const [nextExpected, setNextExpected] = useState(1);
  const [isHidden, setIsHidden] = useState(false);
  const [strikes, setStrikes] = useState(0);
  const [numberCount, setNumberCount] = useState(1);
  const [maxNumbersReached, setMaxNumbersReached] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const MAX_STRIKES = 3;

  const generateTiles = useCallback((count: number) => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const tileSize = 64;
    const padding = 20;
    
    const newTiles: NumberTile[] = [];
    const positions: { x: number, y: number }[] = [];

    const isTooClose = (x: number, y: number) => {
      return positions.some(pos => {
        const dx = pos.x - x;
        const dy = pos.y - y;
        return Math.sqrt(dx * dx + dy * dy) < tileSize + padding;
      });
    };

    for (let i = 1; i <= count; i++) {
      let x, y, attempts = 0;
      do {
        x = Math.random() * (width - tileSize - padding * 2) + padding;
        y = Math.random() * (height - tileSize - padding * 2) + padding;
        attempts++;
      } while (isTooClose(x, y) && attempts < 100);

      positions.push({ x, y });
      newTiles.push({ id: i, value: i, x, y });
    }
    setTiles(newTiles);
  }, []);

  const startLevel = useCallback(() => {
    setGameState('playing');
    setNextExpected(1);
    setIsHidden(false);
    generateTiles(numberCount);
  }, [numberCount, generateTiles]);

  const handleTileClick = (tile: NumberTile) => {
    if (gameState !== 'playing') return;

    if (tile.value === nextExpected) {
      if (tile.value === 1) {
        setIsHidden(true);
      }
      
      const newTiles = tiles.filter(t => t.id !== tile.id);
      setTiles(newTiles);
      
      if (newTiles.length === 0) {
        setMaxNumbersReached(Math.max(maxNumbersReached, numberCount));
        setNumberCount(prev => prev + 1);
        setGameState('result');
      } else {
        setNextExpected(prev => prev + 1);
      }
    } else {
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      if (newStrikes >= MAX_STRIKES) {
        setGameState('gameOver');
      } else {
        setGameState('result');
      }
    }
  };

  const resetGame = () => {
    setStrikes(0);
    setNumberCount(1);
    setMaxNumbersReached(0);
    setGameState('start');
  };

  useEffect(() => {
    if (gameState === 'start' && containerRef.current) {
        // Just to ensure we have dimensions if we auto-start
    }
  }, [gameState]);

  return (
    <GameShell title="Chimp Test" score={numberCount} onRestart={resetGame}>
      <div 
        ref={containerRef}
        className="absolute inset-0 bg-[#0f172a] overflow-hidden select-none"
      >
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

        {gameState === 'start' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center space-y-12 z-30"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
              <div className="relative bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl inline-block">
                <Brain size={100} className="text-indigo-400" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">Chimp Test</h1>
              <p className="text-2xl text-slate-400 font-medium max-w-lg mx-auto">
                Are you smarter than a chimpanzee? Click the numbers in order. 
                After you click 1, the rest will be hidden!
              </p>
            </div>
            <button
              onClick={startLevel}
              className="group relative px-16 py-6 bg-indigo-600 rounded-2xl font-black text-2xl uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(79,70,229,0.3)]"
            >
              <span className="relative z-10">Initiate Test</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div className="w-full h-full relative z-10">
            <div className="absolute top-8 left-0 w-full flex justify-between items-center px-12 pointer-events-none">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Sequence Size</span>
                <span className="text-4xl font-black italic tracking-tighter text-white">{numberCount}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-400 mb-2">Strikes</span>
                <div className="flex gap-2">
                  {[...Array(MAX_STRIKES)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={false}
                      animate={{ 
                        scale: i < strikes ? 1.2 : 1,
                        opacity: i < strikes ? 1 : 0.2
                      }}
                      className={cn("w-8 h-1.5 rounded-full", i < strikes ? "bg-red-500" : "bg-white")}
                    />
                  ))}
                </div>
              </div>
            </div>

            {tiles.map(tile => (
              <motion.button
                key={tile.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileTap={{ scale: 0.92 }}
                style={{
                  position: 'absolute',
                  left: tile.x,
                  top: tile.y,
                  width: 80,
                  height: 80,
                }}
                onClick={() => handleTileClick(tile)}
                className={cn(
                  "flex items-center justify-center text-4xl font-black italic tracking-tighter rounded-2xl border-2 transition-all duration-300 shadow-2xl",
                  isHidden 
                    ? "bg-white border-white text-transparent" 
                    : "bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20"
                )}
              >
                {!isHidden && tile.value}
              </motion.button>
            ))}
          </div>
        )}

        {gameState === 'result' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center space-y-16 z-30"
          >
            <div className="grid grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="space-y-4 bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Numbers Cleared</p>
                <p className="text-8xl font-black italic tracking-tighter text-emerald-400">{numberCount - (tiles.length === 0 ? 1 : 0)}</p>
              </div>
              <div className="space-y-4 bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Strikes</p>
                <p className="text-8xl font-black italic tracking-tighter text-red-500">{strikes}</p>
              </div>
            </div>

            <button
              onClick={startLevel}
              className="px-20 py-6 bg-indigo-600 rounded-2xl font-black text-2xl uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              Next Sequence
            </button>
          </motion.div>
        )}

        {gameState === 'gameOver' && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center space-y-12 z-30"
          >
            <div className="space-y-4">
              <h3 className="text-8xl font-black italic uppercase tracking-tighter text-red-500">Test Over</h3>
              <p className="text-2xl text-slate-400 font-medium">Neural capacity exceeded</p>
            </div>
            
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20" />
              <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] space-y-2">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Peak Performance</p>
                <p className="text-9xl font-black italic tracking-tighter text-indigo-400">{maxNumbersReached}</p>
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
