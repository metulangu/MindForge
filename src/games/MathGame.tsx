import { useState, useEffect, useRef } from 'react';
import { GameShell } from '@/components/GameShell';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X as CloseIcon } from 'lucide-react';

type Operation = '+' | '-' | '*' | '/';

interface Question {
  text: string;
  answer: number;
  options: number[];
}

interface MathGameProps {
  operation: Operation;
  title: string;
}

export default function MathGame({ operation, title }: MathGameProps) {
  const [gameState, setGameState] = useState<'config' | 'playing' | 'gameOver'>('config');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [question, setQuestion] = useState<Question | null>(null);
  const [config, setConfig] = useState<{
    mode: 'random' | 'fixed';
    fixedValue?: number;
    difficulty: 'easy' | 'medium' | 'hard';
  }>({
    mode: 'random',
    difficulty: 'medium'
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateQuestion = (): Question => {
    let a = 0, b = 0, ans = 0;
    let opText = '';

    const getRange = () => {
      if (config.difficulty === 'easy') return 10;
      if (config.difficulty === 'medium') return 50;
      return 100;
    };

    const range = getRange();

    switch (operation) {
      case '+':
        a = Math.floor(Math.random() * range) + 1;
        b = Math.floor(Math.random() * range) + 1;
        ans = a + b;
        opText = '+';
        break;
      case '-':
        a = Math.floor(Math.random() * range) + range;
        b = Math.floor(Math.random() * a);
        ans = a - b;
        opText = '-';
        break;
      case '*':
        if (config.mode === 'fixed' && config.fixedValue) {
          a = config.fixedValue;
          b = Math.floor(Math.random() * 12) + 1;
        } else {
          const multRange = config.difficulty === 'easy' ? 10 : (config.difficulty === 'medium' ? 12 : 20);
          a = Math.floor(Math.random() * multRange) + 2;
          b = Math.floor(Math.random() * multRange) + 2;
        }
        ans = a * b;
        opText = '×';
        break;
      case '/':
        if (config.mode === 'fixed' && config.fixedValue) {
          b = config.fixedValue;
          ans = Math.floor(Math.random() * 12) + 1;
          a = b * ans;
        } else {
          const divRange = config.difficulty === 'easy' ? 10 : (config.difficulty === 'medium' ? 12 : 20);
          b = Math.floor(Math.random() * divRange) + 2;
          ans = Math.floor(Math.random() * divRange) + 1;
          a = b * ans;
        }
        opText = '÷';
        break;
    }

    // Generate options
    const options = new Set<number>();
    options.add(ans);
    while (options.size < 3) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const fakeAns = ans + offset;
      if (offset !== 0 && fakeAns >= 0) options.add(fakeAns);
    }

    return {
      text: `${a} ${opText} ${b}`,
      answer: ans,
      options: Array.from(options).sort(() => Math.random() - 0.5)
    };
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    setQuestion(generateQuestion());

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('gameOver');
  };

  const handleAnswer = (selected: number) => {
    if (!question) return;
    
    if (selected === question.answer) {
      setScore(s => s + 1);
      setQuestion(generateQuestion());
    } else {
      setTimeLeft(t => Math.max(0, t - 2));
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <GameShell title={title} score={score} onRestart={() => setGameState('config')}>
      {gameState === 'config' && (
        <div className="w-full max-w-md mx-auto space-y-8 p-6">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">Game Settings</h3>
            <p className="text-slate-500">Customize your challenge</p>
          </div>

          <div className="space-y-6">
            {(operation === '*' || operation === '/') && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Mode</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConfig(c => ({ ...c, mode: 'random' }))}
                    className={`p-3 rounded-xl border-2 transition-all font-bold ${config.mode === 'random' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                  >
                    Random
                  </button>
                  <button
                    onClick={() => setConfig(c => ({ ...c, mode: 'fixed', fixedValue: 2 }))}
                    className={`p-3 rounded-xl border-2 transition-all font-bold ${config.mode === 'fixed' ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                  >
                    Fixed Number
                  </button>
                </div>
              </div>
            )}

            {config.mode === 'fixed' && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Select Number (1-12)</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setConfig(c => ({ ...c, fixedValue: i + 1 }))}
                      className={`p-2 rounded-lg border-2 transition-all font-bold ${config.fixedValue === i + 1 ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Difficulty</label>
              <div className="grid grid-cols-3 gap-3">
                {(['easy', 'medium', 'hard'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setConfig(c => ({ ...c, difficulty: d }))}
                    className={`p-3 rounded-xl border-2 transition-all font-bold capitalize ${config.difficulty === d ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Sprint
          </button>
        </div>
      )}

      {gameState === 'gameOver' && (
        <div className="text-center space-y-6">
          <h3 className="text-4xl font-bold text-slate-900">Time's Up!</h3>
          <div className="text-6xl font-mono font-bold text-indigo-600">{score}</div>
          <p className="text-xl text-slate-600">Problems Solved</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={startGame}
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Try Again
            </button>
            <button
              onClick={() => setGameState('config')}
              className="px-8 py-4 bg-slate-100 text-slate-600 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all"
            >
              Change Settings
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && question && (
        <div className="w-full max-w-md mx-auto space-y-8 sm:space-y-12">
          <div className="flex justify-between items-center text-xl font-mono font-bold text-slate-500">
            <span>Time: {timeLeft}s</span>
          </div>

          <div className="text-center py-8 sm:py-12">
            <h3 className="text-5xl sm:text-6xl font-bold text-slate-900 tracking-wider">{question.text}</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {question.options.map((opt, i) => (
              <motion.button
                key={`${question.text}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(opt)}
                className="h-20 sm:h-24 bg-white border-2 border-slate-200 rounded-2xl text-2xl sm:text-3xl font-bold text-slate-700 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all shadow-sm"
              >
                {opt}
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </GameShell>
  );
}
