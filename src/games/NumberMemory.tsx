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

        {gameState === 'start' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-12 max-w-2xl z-10"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
              <div className="relative bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl inline-block">
                <Hash size={100} className="text-indigo-400" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">Number Memory</h1>
              <p className="text-2xl text-slate-400 font-medium max-w-lg mx-auto">
                The average person can remember 7 numbers. Can you transcend the average?
              </p>
            </div>
            <button
              onClick={() => startLevel()}
              className="group relative px-16 py-6 bg-indigo-600 rounded-2xl font-black text-2xl uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(79,70,229,0.3)]"
            >
              <span className="relative z-10">Initiate Test</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </motion.div>
        )}

        {gameState === 'showing' && (
          <div className="text-center space-y-16 w-full max-w-4xl z-10">
            <div className="flex flex-col items-center">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 mb-4">Memorize Sequence</p>
              <motion.div
                initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
                animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                className="text-[12rem] font-black italic tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 drop-shadow-2xl break-all px-4"
              >
                {number}
              </motion.div>
            </div>
            <div className="w-full max-w-md mx-auto h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {gameState === 'input' && (
          <form onSubmit={handleSubmit} className="text-center space-y-12 w-full max-w-2xl z-10">
            <div className="space-y-4">
              <h3 className="text-5xl font-black italic uppercase tracking-tighter">Recall Sequence</h3>
              <p className="text-lg text-slate-400 font-medium uppercase tracking-widest">Type the number and press enter</p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
              <input
                autoFocus
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value.replace(/[^0-9]/g, ''))}
                className="relative w-full bg-white/5 backdrop-blur-2xl border-2 border-white/10 rounded-[2.5rem] p-10 text-8xl text-center font-black italic tracking-tighter focus:outline-none focus:border-indigo-500/50 transition-all shadow-2xl"
              />
            </div>

            <button
              type="submit"
              className="px-16 py-6 bg-white text-slate-900 rounded-2xl font-black text-2xl uppercase tracking-widest hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              Submit
            </button>
          </form>
        )}

        {gameState === 'result' && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-16 z-10"
          >
            <div className="grid grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="space-y-4 bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Target</p>
                <p className="text-6xl font-black italic tracking-tighter text-emerald-400">{number}</p>
              </div>
              <div className="space-y-4 bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Response</p>
                <p className="text-6xl font-black italic tracking-tighter text-emerald-400">{userInput}</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-2">Level Completed</span>
                <h2 className="text-9xl font-black italic tracking-tighter leading-none">{level}</h2>
              </div>
              <button
                onClick={() => {
                  const nextLvl = level + 1;
                  setLevel(nextLvl);
                  startLevel(nextLvl);
                }}
                className="px-20 py-6 bg-indigo-600 rounded-2xl font-black text-2xl uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                Next Sequence
              </button>
            </div>
          </motion.div>
        )}

        {gameState === 'gameOver' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-16 z-10"
          >
             <div className="grid grid-cols-2 gap-12 max-w-4xl mx-auto">
              <div className="space-y-4 bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Target</p>
                <p className="text-6xl font-black italic tracking-tighter text-white">{number}</p>
              </div>
              <div className="space-y-4 bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-red-500/20">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-red-400">Response</p>
                <p className="text-6xl font-black italic tracking-tighter text-red-400 line-through opacity-50">{userInput}</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500 mb-2">Final Level</span>
                <h2 className="text-9xl font-black italic tracking-tighter leading-none text-red-500">{level}</h2>
              </div>
              <button
                onClick={resetGame}
                className="px-16 py-6 bg-white text-slate-900 rounded-2xl font-black text-2xl uppercase tracking-widest hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-2xl"
              >
                Re-Initiate
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </GameShell>
  );
}
