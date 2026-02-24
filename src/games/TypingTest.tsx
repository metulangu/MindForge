import { useState, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import { GameShell } from '@/components/GameShell';
import { motion, AnimatePresence } from 'motion/react';
import { Keyboard, Timer, Zap, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const TEXT_POOL = [
  "To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her gender. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind.",
  "The quick brown fox jumps over the lazy dog. This classic sentence contains every letter of the alphabet, making it a perfect exercise for typing practice. Speed and accuracy are both important when you are trying to improve your skills at the keyboard.",
  "In a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.",
  "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
  "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world."
];

export default function TypingTest() {
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start');
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const startTest = useCallback(() => {
    const randomText = TEXT_POOL[Math.floor(Math.random() * TEXT_POOL.length)];
    setText(randomText);
    setUserInput('');
    setGameState('playing');
    setTimeLeft(60);
    setStartTime(Date.now());
    setErrors(0);
    setWpm(0);
    setAccuracy(100);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameState('result');
            return 0;
          }
          return prev - 1;
        });

        // Calculate WPM in real-time
        if (startTime) {
          const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
          const wordsTyped = userInput.trim().split(/\s+/).length;
          setWpm(Math.round(wordsTyped / timeElapsed) || 0);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft, userInput, startTime]);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setUserInput(value);

    // Calculate errors
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== text[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);
    setAccuracy(Math.round(((value.length - errorCount) / value.length) * 100) || 100);

    if (value.length >= text.length) {
      setGameState('result');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <GameShell title="Typing Test" score={wpm} onRestart={() => setGameState('start')}>
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
            className="text-center space-y-8 max-w-2xl z-10"
          >
            <div className="bg-white/10 p-8 rounded-[2rem] inline-block mb-4 backdrop-blur-xl border border-white/10 shadow-2xl">
              <Keyboard size={80} className="text-indigo-400" />
            </div>
            <h1 className="text-7xl font-black tracking-tighter italic uppercase">Typing Test</h1>
            <p className="text-2xl text-slate-400 font-medium">
              How many words per minute can you type? Test your speed and accuracy.
            </p>
            <button
              onClick={startTest}
              className="group relative px-16 py-5 bg-indigo-600 rounded-2xl font-black text-2xl uppercase tracking-widest overflow-hidden transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(79,70,229,0.4)]"
            >
              <span className="relative z-10">Start Test</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-5xl space-y-8 z-10">
            <div className="flex justify-between items-end px-4">
              <div className="flex gap-8">
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Time Left</p>
                  <p className="text-4xl font-mono font-bold">{formatTime(timeLeft)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-400">WPM</p>
                  <p className="text-4xl font-mono font-bold">{wpm}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest text-amber-400">Accuracy</p>
                  <p className="text-4xl font-mono font-bold">{accuracy}%</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black uppercase tracking-widest text-red-400">Errors</p>
                <p className="text-4xl font-mono font-bold">{errors}</p>
              </div>
            </div>

            <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 shadow-2xl">
              <div className="text-2xl leading-relaxed font-medium text-slate-400 relative">
                {text.split('').map((char, i) => {
                  let color = 'text-slate-400';
                  let bg = '';
                  if (i < userInput.length) {
                    if (userInput[i] === text[i]) {
                      color = 'text-white';
                    } else {
                      color = 'text-white';
                      bg = 'bg-red-500/50 rounded-sm';
                    }
                  }
                  return (
                    <span key={i} className={cn("transition-colors duration-100", color, bg, i === userInput.length && "border-l-2 border-indigo-500 animate-pulse")}>
                      {char}
                    </span>
                  );
                })}
              </div>
              <textarea
                ref={inputRef}
                autoFocus
                value={userInput}
                onChange={handleInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-default resize-none"
              />
            </div>
          </div>
        )}

        {gameState === 'result' && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-12 z-10"
          >
            <div className="space-y-4">
              <h2 className="text-8xl font-black italic uppercase tracking-tighter">Results</h2>
              <p className="text-2xl text-slate-400 font-medium">Your typing performance</p>
            </div>

            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { label: 'WPM', value: wpm, color: 'text-indigo-400', icon: Zap },
                { label: 'Accuracy', value: `${accuracy}%`, color: 'text-emerald-400', icon: Timer },
                { label: 'Errors', value: errors, color: 'text-red-400', icon: RotateCcw },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-2">
                  <stat.icon size={24} className={cn("mx-auto mb-2", stat.color)} />
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
                  <p className={cn("text-5xl font-black italic", stat.color)}>{stat.value}</p>
                </div>
              ))}
            </div>

            <button
              onClick={startTest}
              className="px-16 py-5 bg-white text-slate-900 rounded-2xl font-black text-2xl uppercase tracking-widest hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-2xl"
            >
              Try Again
            </button>
          </motion.div>
        )}
      </div>
    </GameShell>
  );
}
