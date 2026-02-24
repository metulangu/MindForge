import { useState, useEffect, useRef, useCallback } from 'react';
import { GameShell } from '@/components/GameShell';
import { motion, AnimatePresence } from 'motion/react';
import { Brain } from 'lucide-react';

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
        className="absolute inset-0 bg-blue-600 overflow-hidden select-none"
      >
        {gameState === 'start' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center space-y-8 z-30">
            <Brain size={80} className="mb-4" />
            <div className="space-y-4">
              <h3 className="text-4xl font-bold">The Chimp Test</h3>
              <p className="text-xl opacity-90 max-w-md">
                Are you smarter than a chimpanzee? Click the numbers in order. 
                After you click 1, the rest will be hidden!
              </p>
            </div>
            <button
              onClick={startLevel}
              className="px-12 py-4 bg-amber-400 text-blue-900 rounded-xl font-bold text-2xl hover:bg-amber-300 transition-all shadow-lg transform hover:-translate-y-1"
            >
              Start Test
            </button>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="w-full h-full relative">
            {tiles.map(tile => (
              <motion.button
                key={tile.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                  position: 'absolute',
                  left: tile.x,
                  top: tile.y,
                  width: 64,
                  height: 64,
                }}
                onClick={() => handleTileClick(tile)}
                className={`
                  flex items-center justify-center text-3xl font-bold rounded-lg border-2 border-white/30 transition-colors
                  ${isHidden ? 'bg-white text-transparent' : 'bg-transparent text-white hover:bg-white/10'}
                `}
              >
                {!isHidden && tile.value}
              </motion.button>
            ))}
          </div>
        )}

        {gameState === 'result' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center space-y-12 z-30">
            <div className="space-y-2">
              <p className="text-2xl font-bold opacity-70 uppercase tracking-widest">Numbers</p>
              <p className="text-8xl font-bold">{numberCount - (tiles.length === 0 ? 1 : 0)}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-2xl font-bold opacity-70 uppercase tracking-widest">Strikes</p>
              <p className="text-5xl font-bold">{strikes} of {MAX_STRIKES}</p>
            </div>

            <button
              onClick={startLevel}
              className="px-12 py-4 bg-amber-400 text-blue-900 rounded-xl font-bold text-2xl hover:bg-amber-300 transition-all shadow-lg transform hover:-translate-y-1"
            >
              Continue
            </button>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center space-y-12 z-30">
            <div className="space-y-4">
              <h3 className="text-5xl font-bold">Test Over</h3>
              <p className="text-2xl opacity-80">Your memory score</p>
            </div>
            
            <div className="text-9xl font-bold text-amber-400">
              {maxNumbersReached}
            </div>

            <button
              onClick={resetGame}
              className="px-12 py-4 bg-white text-blue-900 rounded-xl font-bold text-2xl hover:bg-slate-100 transition-all shadow-lg transform hover:-translate-y-1"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
