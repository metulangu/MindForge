import { useState, useCallback, useEffect } from 'react';
import { GameShell } from '@/components/GameShell';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

type GameState = 'start' | 'playing' | 'gameOver';

const WORD_POOL = [
  'apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon',
  'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli', 'vanilla',
  'watermelon', 'xylophone', 'yam', 'zucchini', 'ocean', 'mountain', 'river', 'forest', 'desert', 'island',
  'planet', 'galaxy', 'star', 'comet', 'asteroid', 'nebula', 'cosmos', 'universe', 'earth', 'moon',
  'sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto', 'rocket',
  'shuttle', 'astronaut', 'satellite', 'telescope', 'microscope', 'camera', 'laptop', 'tablet', 'phone', 'watch',
  'clock', 'compass', 'map', 'globe', 'anchor', 'bridge', 'castle', 'tower', 'palace', 'temple',
  'pyramid', 'sphinx', 'statue', 'museum', 'library', 'school', 'university', 'college', 'hospital', 'clinic',
  'pharmacy', 'bakery', 'market', 'store', 'shop', 'mall', 'theater', 'cinema', 'stadium', 'arena',
  'park', 'garden', 'zoo', 'aquarium', 'beach', 'valley', 'canyon', 'cliff', 'cave', 'waterfall',
  'volcano', 'glacier', 'iceberg', 'tundra', 'savanna', 'prairie', 'swamp', 'marsh', 'reef', 'lagoon',
  'negatives', 'positive', 'neutral', 'active', 'passive', 'dynamic', 'static', 'simple', 'complex', 'easy',
  'hard', 'fast', 'slow', 'loud', 'quiet', 'bright', 'dark', 'hot', 'cold', 'wet', 'dry',
  'heavy', 'light', 'strong', 'weak', 'brave', 'coward', 'smart', 'stupid', 'happy', 'sad',
  'angry', 'calm', 'excited', 'bored', 'hungry', 'thirsty', 'tired', 'awake', 'sleepy', 'dreamy'
];

export default function VerbalMemory() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [seenWords, setSeenWords] = useState<Set<string>>(new Set());
  const [currentWord, setCurrentWord] = useState('');
  const [isNewWord, setIsNewWord] = useState(true);

  const nextWord = useCallback(() => {
    const shouldShowSeen = seenWords.size > 0 && Math.random() < 0.5;
    
    if (shouldShowSeen) {
      const seenArray = Array.from(seenWords);
      const randomSeen = seenArray[Math.floor(Math.random() * seenArray.length)];
      setCurrentWord(randomSeen);
      setIsNewWord(false);
    } else {
      const availableWords = WORD_POOL.filter(w => !seenWords.has(w));
      if (availableWords.length === 0) {
        const seenArray = Array.from(seenWords);
        setCurrentWord(seenArray[Math.floor(Math.random() * seenArray.length)]);
        setIsNewWord(false);
      } else {
        const randomNew = availableWords[Math.floor(Math.random() * availableWords.length)];
        setCurrentWord(randomNew);
        setIsNewWord(true);
      }
    }
  }, [seenWords]);

  const handleChoice = (choice: 'seen' | 'new') => {
    if (gameState !== 'playing') return;

    const correct = (choice === 'new' && isNewWord) || (choice === 'seen' && !isNewWord);

    if (correct) {
      setScore(s => s + 1);
      if (isNewWord) {
        setSeenWords(prev => new Set(prev).add(currentWord));
      }
      nextWord();
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setGameState('gameOver');
      } else {
        if (isNewWord) {
           setSeenWords(prev => new Set(prev).add(currentWord));
        }
        nextWord();
      }
    }
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setSeenWords(new Set());
    setGameState('playing');
    
    const firstWord = WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)];
    setCurrentWord(firstWord);
    setIsNewWord(true);
  };

  const resetGame = () => {
    setGameState('start');
  };

  return (
    <GameShell title="Verbal Memory Test" score={score} onRestart={resetGame}>
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
                <BookOpen size={100} className="text-indigo-400" />
              </div>
            </div>
            <div className="space-y-4">
              <h1 className="text-7xl font-black italic uppercase tracking-tighter leading-none">Verbal Memory</h1>
              <p className="text-2xl text-slate-400 font-medium max-w-lg mx-auto">
                Test your lexical retention. Identify if you've encountered the word before.
              </p>
            </div>
            <button
              onClick={startGame}
              className="group relative px-16 py-6 bg-indigo-600 rounded-2xl font-black text-2xl uppercase tracking-[0.2em] overflow-hidden transition-all hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(79,70,229,0.3)]"
            >
              <span className="relative z-10">Initiate Test</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </motion.div>
        )}

        {gameState === 'playing' && (
          <div className="text-center space-y-16 w-full max-w-3xl z-10">
            <div className="flex justify-between items-center px-8">
              <div className="flex items-center gap-4 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10">
                <Heart size={20} className={cn("text-red-500", lives < 3 && "opacity-50")} fill={lives >= 1 ? "currentColor" : "none"} />
                <span className="text-xl font-black font-mono">{lives}</span>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-1">Current Score</p>
                <p className="text-5xl font-black italic tracking-tighter">{score}</p>
              </div>
              <div className="w-12" /> {/* Spacer */}
            </div>

            <div className="relative min-h-[300px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentWord}
                  initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -30, scale: 1.1, filter: "blur(10px)" }}
                  transition={{ type: "spring", damping: 15 }}
                  className="text-9xl font-black italic uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-500 drop-shadow-2xl"
                >
                  {currentWord}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-8">
              <button
                onClick={() => handleChoice('seen')}
                className="group relative px-16 py-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl font-black text-2xl uppercase tracking-widest overflow-hidden transition-all hover:bg-white/10 hover:scale-105 active:scale-95 min-w-[240px]"
              >
                <span className="relative z-10">Seen</span>
                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button
                onClick={() => handleChoice('new')}
                className="group relative px-16 py-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl font-black text-2xl uppercase tracking-widest overflow-hidden transition-all hover:bg-white/10 hover:scale-105 active:scale-95 min-w-[240px]"
              >
                <span className="relative z-10">New</span>
                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>
        )}

        {gameState === 'gameOver' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-12 z-10"
          >
            <div className="space-y-4">
              <h3 className="text-8xl font-black italic uppercase tracking-tighter text-red-500">Terminated</h3>
              <p className="text-2xl text-slate-400 font-medium">Memory capacity reached</p>
            </div>
            
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20" />
              <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[3rem] space-y-2">
                <p className="text-xs font-black uppercase tracking-[0.4em] text-slate-500">Final Score</p>
                <p className="text-9xl font-black italic tracking-tighter text-amber-400">{score}</p>
              </div>
            </div>

            <button
              onClick={startGame}
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
