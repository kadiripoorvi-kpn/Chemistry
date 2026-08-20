import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Hand,
  CheckCircle2,
  Lightbulb,
  Plus,
  Minus,
  Sparkles,
  FlaskConical,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TutorialStep {
  title: string;
  subtitle: string;
  description: string;
  visualType: 'drag' | 'slots' | 'subscript' | 'formula' | 'hints' | 'ready';
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: '1. Welcome to the Chemistry Lab!',
    subtitle: 'Learn how molecules are built from elements',
    description:
      'In this game, you will act as a chemist constructing real chemical formulas. Every chemical compound (like water or salt) is made of specific elements combined in exact numbers!',
    visualType: 'ready',
  },
  {
    title: '2. Drag or Tap Element Cards',
    subtitle: 'Selecting chemical elements',
    description:
      'Look at the Element Inventory at the bottom of the screen. You can DRAG any element card with your mouse/touch, or TAP a card and then TAP a formula slot to place it!',
    visualType: 'drag',
  },
  {
    title: '3. Formula Slots & Order',
    subtitle: 'Arranging elements in the compound',
    description:
      'Chemical formulas have specific element orders. For example, Table Salt (NaCl) puts Sodium [Na] in the first slot and Chlorine [Cl] in the second slot.',
    visualType: 'slots',
  },
  {
    title: '4. Atom Counts & Subscripts',
    subtitle: 'Setting how many atoms bond together',
    description:
      'Use the (−) and (+) buttons under each element to adjust the atom count. For Water (H₂O), set Hydrogen to 2 and Oxygen to 1! The small number 2 is called a chemical subscript.',
    visualType: 'subscript',
  },
  {
    title: '5. AI Hints & Diagnostic Feedback',
    subtitle: 'Need help? Ask Dr. Atom!',
    description:
      'If you ever get stuck, click the Hint button. Dr. Atom gives 3 levels of progressive clues to teach you the concept rather than just giving away the solution.',
    visualType: 'hints',
  },
  {
    title: '6. Check Formula & Level Up!',
    subtitle: 'Submit your solution for synthesis',
    description:
      'When your slots match the target formula, press CHECK FORMULA! Watch the 2D molecular simulation assemble and learn fascinating facts about the compound!',
    visualType: 'ready',
  },
];

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  if (!isOpen) return null;

  const currentStep = TUTORIAL_STEPS[currentStepIndex];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl border-b-8 border-indigo-200 shadow-2xl p-6 sm:p-8 text-slate-800 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            id="btn-close-tutorial"
            className="absolute top-5 right-5 p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 border-b-2 border-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 border border-indigo-200">
              Tutorial ({currentStepIndex + 1}/{TUTORIAL_STEPS.length})
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-800">{currentStep.title}</h3>
          <p className="text-xs sm:text-sm font-semibold text-indigo-600 mb-4">{currentStep.subtitle}</p>

          {/* Interactive Visual Demonstration Box */}
          <div className="w-full h-36 bg-slate-900 rounded-2xl border-4 border-slate-800 flex items-center justify-center p-4 mb-4 relative overflow-hidden text-white shadow-inner">
            {currentStep.visualType === 'drag' && (
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ x: [0, 60, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-16 h-20 rounded-2xl bg-sky-500 border-b-4 border-sky-700 flex flex-col items-center justify-center shadow-lg text-white font-bold"
                >
                  <span className="text-2xl font-black">H</span>
                  <span className="text-[9px] text-white/90">Hydrogen</span>
                </motion.div>
                <Hand className="w-6 h-6 text-sky-400 animate-bounce" />
                <div className="w-16 h-20 rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950 flex flex-col items-center justify-center text-slate-500 text-xs font-bold">
                  Slot 1
                </div>
              </div>
            )}

            {currentStep.visualType === 'slots' && (
              <div className="flex items-center gap-3">
                <div className="w-16 h-20 rounded-2xl bg-amber-500 border-b-4 border-amber-700 flex flex-col items-center justify-center text-white font-bold shadow-md">
                  <span className="text-2xl font-black">Na</span>
                  <span className="text-[9px] text-white/90">Sodium</span>
                </div>
                <span className="text-slate-500 font-black text-lg">+</span>
                <div className="w-16 h-20 rounded-2xl bg-emerald-500 border-b-4 border-emerald-700 flex flex-col items-center justify-center text-white font-bold shadow-md">
                  <span className="text-2xl font-black">Cl</span>
                  <span className="text-[9px] text-white/90">Chlorine</span>
                </div>
                <span className="text-sky-400 font-black text-lg">➔</span>
                <div className="px-4 py-2 rounded-2xl bg-indigo-600 border-b-4 border-indigo-800 text-white font-mono font-black text-lg shadow-md">
                  NaCl
                </div>
              </div>
            )}

            {currentStep.visualType === 'subscript' && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-14 h-16 rounded-2xl bg-sky-500 border-b-4 border-sky-700 flex flex-col items-center justify-center text-white font-bold shadow-md">
                    <span className="text-xl font-black">H</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-700">
                    <Minus className="w-3 h-3 text-slate-400" />
                    <span className="text-sm font-black text-amber-400 px-1 font-mono">2</span>
                    <Plus className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-300">
                  Displays as: <strong className="text-base font-mono text-white font-black">H₂</strong>
                </div>
              </div>
            )}

            {currentStep.visualType === 'hints' && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 border-b-4 border-amber-600 flex items-center justify-center text-amber-950 shadow-md">
                  <Lightbulb className="w-7 h-7" />
                </div>
                <div className="text-xs text-slate-200">
                  <div className="font-black text-amber-400">Dr. Atom’s Clues:</div>
                  <div className="text-slate-300 text-[11px] font-medium mt-0.5 leading-relaxed">
                    Hint 1: General guidance <br />
                    Hint 2: Exact atom quantities <br />
                    Hint 3: Complete formula structure
                  </div>
                </div>
              </div>
            )}

            {currentStep.visualType === 'ready' && (
              <div className="flex flex-col items-center justify-center text-center gap-1.5">
                <FlaskConical className="w-10 h-10 text-emerald-400 animate-bounce" />
                <span className="text-sm font-black text-emerald-400">
                  You are ready to experiment!
                </span>
                <span className="text-xs text-slate-400 max-w-xs">
                  Construct your first chemical formula and discover the molecular world.
                </span>
              </div>
            )}
          </div>

          {/* Description Text */}
          <div className="bg-indigo-50/80 rounded-2xl p-4 border-2 border-indigo-100 mb-5 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed shadow-inner">
            {currentStep.description}
          </div>

          {/* Pagination Indicators & Buttons */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {TUTORIAL_STEPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    sound.playClick();
                    setCurrentStepIndex(idx);
                  }}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex
                      ? 'bg-indigo-600 w-7'
                      : 'bg-slate-200 hover:bg-slate-300 w-2.5'
                  }`}
                  aria-label={`Go to tutorial step ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {currentStepIndex > 0 && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentStepIndex((prev) => prev - 1);
                  }}
                  id="btn-prev-tutorial-step"
                  className="p-2.5 rounded-2xl bg-white border-b-4 border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shadow-xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}

              {currentStepIndex < TUTORIAL_STEPS.length - 1 ? (
                <button
                  onClick={() => {
                    sound.playClick();
                    setCurrentStepIndex((prev) => prev + 1);
                  }}
                  id="btn-next-tutorial-step"
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs sm:text-sm flex items-center gap-1 border-b-4 border-indigo-800 active:border-b-0 shadow-md cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    sound.playClick();
                    onClose();
                  }}
                  id="btn-finish-tutorial"
                  className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 border-b-4 border-emerald-700 active:border-b-0 shadow-md cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Start Playing!</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
