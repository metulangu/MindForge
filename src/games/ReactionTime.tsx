import { useState, useRef, useEffect } from 'react';
import { GameShell } from '@/components/GameShell';
import { motion } from 'motion/react';
import { Zap, RotateCcw } from 'lucide-react';

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
        className={`w-full h-full absolute inset-0 flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 select-none
          ${state === 'config' ? 'bg-slate-100' : ''}
          ${state === 'waiting' ? 'bg-rose-500' : ''}
          ${state === 'ready' ? 'bg-emerald-500' : ''}
          ${state === 'result' ? 'bg-slate-100' : ''}
        `}
        onMouseDown={handleClick}
      >
        {state === 'config' && (
          <div className="text-center space-y-8 p-6 max-w-md pointer-events-auto">
            <Zap size={64} className="mx-auto text-indigo-600" />
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-slate-900">Reaction Time</h3>
              <p className="text-slate-600">When the red box turns green, click as quickly as you can.</p>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Difficulty</label>
              <div className="grid grid-cols-3 gap-3">
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDifficulty(d);
                    }}
                    className={`p-3 rounded-xl border-2 transition-all font-bold capitalize ${difficulty === d ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
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
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Game
            </button>
          </div>
        )}

        {state === 'waiting' && (
          <div className="text-center pointer-events-none">
            <h3 className="text-4xl font-bold text-white">Wait for Green...</h3>
          </div>
        )}

        {state === 'ready' && (
          <div className="text-center pointer-events-none">
            <h3 className="text-5xl font-bold text-white">CLICK!</h3>
          </div>
        )}

        {state === 'result' && (
          <div className="text-center space-y-6 pointer-events-none z-10">
            {tooEarly ? (
              <>
                <h3 className="text-3xl font-bold text-rose-600">Too Early!</h3>
                <p className="text-slate-600">You clicked before the color changed.</p>
              </>
            ) : (
              <>
                <div className="text-6xl font-mono font-bold text-slate-900">
                  {reactionTime} <span className="text-2xl text-slate-500">ms</span>
                </div>
                <p className="text-slate-600 text-lg">Click to try again</p>
              </>
            )}
            <button 
              onMouseDown={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors pointer-events-auto shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </GameShell>
  );
}
