import { useState, useRef, useEffect } from 'react';
import { GameShell } from '@/components/GameShell';
import { motion } from 'motion/react';
import { Zap, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

type GameState = 'config' | 'waiting' | 'ready' | 'result';

export default function ReactionTime() {
  const [state, setState] = useState<GameState>('config');
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [tooEarly, setTooEarly] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    setState('waiting');
    setTooEarly(false);
    
    // Difficulty affects the random delay range
    const delayRanges = {
      easy: { min: 3000, max: 6000 },
      medium: { min: 2000, max: 5000 },
      hard: { min: 1000, max: 4000 }
    };
    const { min, max } = delayRanges[difficulty];
    const randomDelay = Math.floor(Math.random() * (max - min)) + min;
    
    timeoutRef.current = setTimeout(() => {
      setState('ready');
      setStartTime(Date.now());
    }, randomDelay);
  };

  const handleClick = () => {
    if (state === 'result') {
      startGame();
    } else if (state === 'waiting') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTooEarly(true);
      setState('result');
    } else if (state === 'ready') {
      const endTime = Date.now();
      setReactionTime(endTime - startTime);
      setState('result');
    }
  };

  const resetGame = () => {
    setState('config');
    setReactionTime(0);
    setTooEarly(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <GameShell title="Reaction Time" onRestart={resetGame}>
      <div 
        className={cn(
          "w-full h-full absolute inset-0 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none overflow-hidden",
          state === 'config' ? 'bg-[#0f172a]' : '',
          state === 'waiting' ? 'bg-rose-600' : '',
          state === 'ready' ? 'bg-emerald-500' : '',
          state === 'result' ? 'bg-[#0f172a]' : ''
        )}
        onMouseDown={handleClick}
      >
        {/* Background Decorative Elements (only for config and result) */}
        {(state === 'config' || state === 'result') && (
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
        )}

        {state === 'config' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-12 p-6 max-w-2xl pointer-events-auto z-10 text-white"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse" />
              <div className="relative bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl inline-block">
                <Zap size={100} className="text-indigo-400" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">Reaction Time</h1>
              <p className="text-2xl text-slate-400 font-medium max-w-lg mx-auto">
                When the red box turns green, click as quickly as you can.
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Select Difficulty</p>
              <div className="grid grid-cols-3 gap-4">
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDifficulty(d);
                    }}
                    className={cn(
                      "p-5 rounded-2xl border-2 transition-all font-black uppercase tracking-widest text-sm",
                      difficulty === d 
                        ? "border-indigo-500 bg-indigo-500/20 text-white shadow-[0_0_30px_rgba(99,102,241,0.3)]" 
                        : "border-white/10 bg-white/5 text-slate-500 hover:border-white/20"
                    )}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onMouseDown={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="group relative px-16 py-6 bg-indigo-600 rounded-2xl font-black text-2xl uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-indigo-50 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(79,70,229,0.3)]"
            >
              <span className="relative z-10">Initiate Test</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </motion.div>
        )}

        {state === 'waiting' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center pointer-events-none z-10"
          >
            <h3 className="text-8xl font-black italic uppercase tracking-tighter text-white animate-pulse">Wait for Green...</h3>
          </motion.div>
        )}

        {state === 'ready' && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center pointer-events-none z-10"
          >
            <h3 className="text-[12rem] font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">CLICK!</h3>
          </motion.div>
        )}

        {state === 'result' && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-12 pointer-events-none z-10 text-white"
          >
            {tooEarly ? (
              <div className="space-y-8">
                <h3 className="text-8xl font-black italic uppercase tracking-tighter text-rose-500">Too Early!</h3>
                <p className="text-2xl text-slate-400 font-medium">You clicked before the color changed.</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20" />
                  <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-16 rounded-[4rem] space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Reaction Time</p>
                    <div className="text-[10rem] font-black italic tracking-tighter leading-none text-indigo-400">
                      {reactionTime}<span className="text-4xl ml-2 text-slate-500">ms</span>
                    </div>
                  </div>
                </div>
                <p className="text-2xl text-slate-400 font-medium uppercase tracking-widest">Click anywhere to try again</p>
              </div>
            )}
            <button 
              onMouseDown={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="px-16 py-6 bg-white text-slate-900 rounded-2xl font-black text-2xl uppercase tracking-widest hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-2xl pointer-events-auto"
            >
              Re-Initiate
            </button>
          </motion.div>
        )}
      </div>
    </GameShell>
  );
}
