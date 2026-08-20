import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Lightbulb, X, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';
import { LevelHint } from '../types';
import { sound } from '../utils/audio';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  hints: LevelHint[];
  currentHintLevel: number;
  onUnlockNextHint: () => void;
  targetCompoundName: string;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  isOpen,
  onClose,
  hints,
  currentHintLevel,
  onUnlockNextHint,
  targetCompoundName,
}) => {
  if (!isOpen) return null;

  const currentHintObj = hints.find((h) => h.level === currentHintLevel);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl border-b-8 border-indigo-200 shadow-2xl p-6 sm:p-7 text-slate-800 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            id="btn-close-ai-hint"
            className="absolute top-5 right-5 p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 border-b-2 border-slate-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Assistant Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="relative w-12 h-12 rounded-2xl bg-indigo-600 border-b-4 border-indigo-800 flex items-center justify-center shadow-md">
              <Bot className="w-7 h-7 text-white" />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-800">Dr. Atom</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-700 border border-indigo-200">
                  AI Lab Tutor
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Helping you solve: <strong className="text-indigo-900">{targetCompoundName}</strong>
              </p>
            </div>
          </div>

          {/* Tiered Hint Tabs */}
          <div className="flex items-center gap-2 mb-4 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {[1, 2, 3].map((lvl) => {
              const isUnlocked = lvl <= currentHintLevel;
              return (
                <div
                  key={lvl}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black text-center transition-all ${
                    isUnlocked
                      ? 'bg-white text-indigo-700 shadow-xs border-b-2 border-indigo-200'
                      : 'text-slate-400 bg-transparent'
                  }`}
                >
                  Hint {lvl} {lvl === 1 ? '(General)' : lvl === 2 ? '(Specific)' : '(Direct)'}
                </div>
              );
            })}
          </div>

          {/* Speech Bubble / Current Hint Content */}
          <div className="relative bg-sky-50 rounded-2xl p-4 sm:p-5 border-2 border-sky-100 mb-5 shadow-inner">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5 animate-bounce" />
              <div className="space-y-2">
                <p className="text-sm sm:text-base font-semibold text-slate-800 leading-relaxed">
                  {currentHintObj
                    ? currentHintObj.text
                    : 'Hello young chemist! Click "Reveal Hint" below if you need a helpful clue to construct this chemical formula.'}
                </p>
                {currentHintLevel > 0 && (
                  <p className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>
                      {currentHintLevel === 1
                        ? 'Hint 1 used: +75 points max'
                        : currentHintLevel === 2
                        ? 'Hint 2 used: +50 points max'
                        : 'Hint 3 used: +25 points max'}
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              id="btn-got-it-hint"
              className="px-5 py-2.5 rounded-2xl bg-white border-b-4 border-slate-200 active:border-b-0 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-black transition-all cursor-pointer shadow-xs"
            >
              I got it!
            </button>

            {currentHintLevel < 3 ? (
              <button
                onClick={() => {
                  sound.playHint();
                  onUnlockNextHint();
                }}
                id="btn-unlock-next-hint"
                className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-black text-xs sm:text-sm border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <span>
                  {currentHintLevel === 0 ? 'Reveal Hint 1' : `Unlock Hint ${currentHintLevel + 1}`}
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs text-slate-400 font-bold">All hints unlocked</span>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
