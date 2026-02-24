import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface GameShellProps {
  title: string;
  children: ReactNode;
  score?: number | string;
  onRestart?: () => void;
  isGameOver?: boolean;
}

export function GameShell({ title, children, score, onRestart, isGameOver }: GameShellProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Link 
          to="/" 
          className="flex items-center text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </Link>
        
        {score !== undefined && (
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-sm font-mono font-bold text-slate-900">
            Score: {score}
          </div>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px] sm:min-h-[600px] relative flex flex-col"
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          {onRestart && (
            <button
              onClick={onRestart}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Restart Game"
            >
              <RotateCcw size={20} />
            </button>
          )}
        </div>
        
        <div className="flex-grow relative p-6 flex flex-col items-center justify-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
