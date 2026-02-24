import { Zap, Grid3X3, Calculator, Target, Plus, Minus, X, Divide, Brain, Hash, BookOpen, Keyboard } from 'lucide-react';
import { GameConfig } from '@/types/game';

export const games: GameConfig[] = [
  {
    id: 'reaction-time',
    title: 'Reaction Time',
    description: 'Test your visual reflexes. Click as soon as the color changes.',
    category: 'reflex',
    icon: Zap,
    path: '/games/reaction-time',
    color: 'bg-blue-500',
    tags: ['Reflex', 'Speed', 'Focus', 'Visual', 'Timing', 'Quick', 'Brain']
  },
  {
    id: 'sequence-memory',
    title: 'Sequence Memory',
    description: 'Remember an increasingly long pattern of button presses.',
    category: 'memory',
    icon: Grid3X3,
    path: '/games/sequence-memory',
    color: 'bg-emerald-500',
    tags: ['Memory', 'Pattern', 'Focus', 'Logic', 'Recall', 'Visual', 'Brain']
  },
  {
    id: 'number-memory',
    title: 'Number Memory',
    description: 'The average person can remember 7 numbers at once. Can you do more?',
    category: 'memory',
    icon: Hash,
    path: '/games/number-memory',
    color: 'bg-blue-400',
    tags: ['Memory', 'Numbers', 'Focus', 'Brain', 'Recall', 'Logic', 'Digits']
  },
  {
    id: 'visual-memory',
    title: 'Visual Memory',
    description: 'Remember an increasingly large grid of tiles.',
    category: 'memory',
    icon: Grid3X3,
    path: '/games/visual-memory',
    color: 'bg-indigo-500',
    tags: ['Memory', 'Visual', 'Focus', 'Brain', 'Recall', 'Pattern', 'Grid']
  },
  {
    id: 'verbal-memory',
    title: 'Verbal Memory',
    description: 'Remember which words you have already seen.',
    category: 'memory',
    icon: BookOpen,
    path: '/games/verbal-memory',
    color: 'bg-blue-600',
    tags: ['Memory', 'Verbal', 'Words', 'Focus', 'Brain', 'Recall', 'Language']
  },
  {
    id: 'typing-test',
    title: 'Typing Test',
    description: 'How many words per minute can you type?',
    category: 'reflex',
    icon: Keyboard,
    path: '/games/typing-test',
    color: 'bg-slate-700',
    tags: ['Speed', 'Typing', 'Accuracy', 'Focus', 'Reflex', 'Keyboard']
  },
  {
    id: 'math-addition',
    title: 'Addition Sprint',
    description: 'How fast can you add numbers?',
    category: 'math',
    icon: Plus,
    path: '/games/math-addition',
    color: 'bg-violet-500',
    tags: ['Math', 'Addition', 'Speed', 'Numbers', 'Logic', 'Mental', 'Brain']
  },
  {
    id: 'math-subtraction',
    title: 'Subtraction Sprint',
    description: 'Test your subtraction speed.',
    category: 'math',
    icon: Minus,
    path: '/games/math-subtraction',
    color: 'bg-purple-500',
    tags: ['Math', 'Subtract', 'Speed', 'Numbers', 'Logic', 'Mental', 'Brain']
  },
  {
    id: 'math-multiplication',
    title: 'Multiplication Sprint',
    description: 'Master your times tables.',
    category: 'math',
    icon: X,
    path: '/games/math-multiplication',
    color: 'bg-indigo-500',
    tags: ['Math', 'Multiply', 'Speed', 'Tables', 'Logic', 'Mental', 'Brain']
  },
  {
    id: 'math-division',
    title: 'Division Sprint',
    description: 'Quick division challenges.',
    category: 'math',
    icon: Divide,
    path: '/games/math-division',
    color: 'bg-fuchsia-500',
    tags: ['Math', 'Division', 'Speed', 'Numbers', 'Logic', 'Mental', 'Brain']
  },
  {
    id: 'aim-trainer',
    title: 'Aim Trainer',
    description: 'Hit the targets as quickly as possible.',
    category: 'reflex',
    icon: Target,
    path: '/games/aim-trainer',
    color: 'bg-rose-500',
    tags: ['Reflex', 'Aim', 'Speed', 'Precision', 'Focus', 'Click', 'Brain']
  },
  {
    id: 'chimp-test',
    title: 'Chimp Test',
    description: 'Are you smarter than a chimpanzee? Test your working memory.',
    category: 'memory',
    icon: Brain,
    path: '/games/chimp-test',
    color: 'bg-blue-600',
    tags: ['Memory', 'Focus', 'Brain', 'Sequence', 'Visual', 'Logic', 'Chimp']
  }
];
