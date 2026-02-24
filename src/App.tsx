/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/pages/Dashboard';
import ReactionTime from '@/games/ReactionTime';
import SequenceMemory from '@/games/SequenceMemory';
import MathGame from '@/games/MathGame';
import AimTrainer from '@/games/AimTrainer';
import ChimpTest from '@/games/ChimpTest';
import NumberMemory from '@/games/NumberMemory';
import VisualMemory from '@/games/VisualMemory';
import VerbalMemory from '@/games/VerbalMemory';
import TypingTest from '@/games/TypingTest';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="games/reaction-time" element={<ReactionTime />} />
          <Route path="games/sequence-memory" element={<SequenceMemory />} />
          <Route path="games/number-memory" element={<NumberMemory />} />
          <Route path="games/visual-memory" element={<VisualMemory />} />
          <Route path="games/verbal-memory" element={<VerbalMemory />} />
          <Route path="games/typing-test" element={<TypingTest />} />
          <Route path="games/math-addition" element={<MathGame operation="+" title="Addition Sprint" />} />
          <Route path="games/math-subtraction" element={<MathGame operation="-" title="Subtraction Sprint" />} />
          <Route path="games/math-multiplication" element={<MathGame operation="*" title="Multiplication Sprint" />} />
          <Route path="games/math-division" element={<MathGame operation="/" title="Division Sprint" />} />
          <Route path="games/aim-trainer" element={<AimTrainer />} />
          <Route path="games/chimp-test" element={<ChimpTest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
