import { useState, useEffect, useRef, FormEvent } from 'react';
import { GameShell } from '@/components/GameShell';
import { motion, AnimatePresence } from 'motion/react';
import { Hash } from 'lucide-react';

type GameState = 'start' | 'showing' | 'input' | 'result' | 'gameOver';

export default function NumberMemory() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [level, setLevel] = useState(1);
  const [number, setNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [progress, setProgress] = useState(100);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateNumber = (digits: number) => {
    let result = '';
    for (let i = 0; i < digits; i++) {
      result += Math.floor(Math.random() * 10).toString();
    }
    // Ensure first digit isn't 0 if it's more than 1 digit
    if (result.length > 1 && result[0] === '0') {
      result = (Math.floor(Math.random() * 9) + 1).toString() + result.substring(1);
    }
    return result;
  };

  const startLevel = (targetLevel: number = level) => {
    const newNumber = generateNumber(targetLevel);
    setNumber(newNumber);
    setUserInput('');
    setGameState('showing');
    setProgress(100);

    // Duration increases with level: 2s base + 1s per digit
    const duration = 2000 + (targetLevel * 1000);
    const startTime = Date.now();

    if (timerRef.current) clearInterval(timerRef.current);
    
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (elapsed >= duration) {
        if (timerRef.current) clearInterval(timerRef.current);
        setGameState('input');
      }
    }, 16);
  };

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (gameState !== 'input') return;

    if (userInput === number) {
      setGameState('result');
    } else {
      setGameState('gameOver');
    }
  };

  const nextLevel = () => {
    setLevel(prev => prev + 1);
    setGameState('start'); // Go back to start to show level info or just auto-start?
    // Let's auto-start for better flow
  };

  useEffect(() => {
    if (gameState === 'result') {
      // Auto-advance or wait for button? The image shows a "NEXT" button.
    }
  }, [gameState]);

  const resetGame = () => {
    setLevel(1);
    setGameState('start');
    setUserInput('');
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <GameShell title="Number Memory" score={level} onRestart={resetGame}>
      <div className="absolute inset-0 bg-[#2b87d1] flex flex-col items-center justify-center text-white p-6 select-none">
        {gameState === 'start' && (
          <div className="text-center space-y-8 max-w-2xl">
            <div className="bg-white/20 p-6 rounded-3xl inline-block mb-4">
              <Hash size={80} />
            </div>
            <h1 className="text-6xl font-bold">Number Memory</h1>
            <p className="text-2xl opacity-90">
              The average person can remember 7 numbers at once. Can you do more?
            </p>
            <button
              onClick={() => startLevel()}
              className="px-16 py-4 bg-[#ffd152] text-slate-800 rounded-xl font-bold text-2xl hover:bg-[#ffc421] transition-all shadow-lg transform hover:-translate-y-1"
            >
              Start
            </button>
          </div>
        )}

        {gameState === 'showing' && (
          <div className="text-center space-y-12 w-full max-w-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl font-bold tracking-widest break-all"
            >
              {number}
            </motion.div>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-white"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {gameState === 'input' && (
          <form onSubmit={handleSubmit} className="text-center space-y-8 w-full max-w-2xl">
            <div className="space-y-2">
              <h3 className="text-3xl font-medium">What was the number?</h3>
              <p className="text-lg opacity-70">Press enter to submit</p>
            </div>
            
            <input
              autoFocus
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full bg-transparent border-2 border-white/30 rounded-xl p-6 text-5xl text-center font-bold focus:outline-none focus:border-white transition-colors"
            />

            <button
              type="submit"
              className="px-12 py-3 bg-white text-[#2b87d1] rounded-lg font-bold text-xl hover:bg-slate-100 transition-all"
            >
              Submit
            </button>
          </form>
        )}

        {gameState === 'result' && (
          <div className="text-center space-y-12">
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xl opacity-70 uppercase font-bold tracking-widest">Number</p>
                <p className="text-5xl font-bold">{number}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xl opacity-70 uppercase font-bold tracking-widest">Your answer</p>
                <p className="text-5xl font-bold">{userInput}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-8xl font-bold">Level {level}</h2>
              <button
                onClick={() => {
                  const nextLvl = level + 1;
                  setLevel(nextLvl);
                  startLevel(nextLvl);
                }}
                className="px-16 py-4 bg-[#ffd152] text-slate-800 rounded-xl font-bold text-2xl hover:bg-[#ffc421] transition-all shadow-lg transform hover:-translate-y-1"
              >
                NEXT
              </button>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="text-center space-y-12">
             <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xl opacity-70 uppercase font-bold tracking-widest">Number</p>
                <p className="text-5xl font-bold">{number}</p>
              </div>
              <div className="space-y-2">
                <p className="text-xl opacity-70 uppercase font-bold tracking-widest">Your answer</p>
                <p className="text-5xl font-bold line-through opacity-50">{userInput}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-8xl font-bold">Level {level}</h2>
              <button
                onClick={resetGame}
                className="px-16 py-4 bg-white text-[#2b87d1] rounded-xl font-bold text-2xl hover:bg-slate-100 transition-all shadow-lg transform hover:-translate-y-1"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </div>
    </GameShell>
  );
}
