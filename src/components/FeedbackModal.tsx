import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Star,
  ArrowRight,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { LevelData } from '../types';
import { MoleculeViewer2D } from './MoleculeViewer2D';
import { sound } from '../utils/audio';

interface FeedbackModalProps {
  isOpen: boolean;
  level: LevelData;
  scoreEarned: number;
  starsEarned: number;
  streak: number;
  onNextLevel: () => void;
  onReplayLevel: () => void;
  onOpenCodex: () => void;
  isLastLevel: boolean;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  level,
  scoreEarned,
  starsEarned,
  streak,
  onNextLevel,
  onReplayLevel,
  onOpenCodex,
  isLastLevel,
}) => {
  useEffect(() => {
    if (isOpen) {
      sound.playSuccess();
      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#4ade80', '#fbbf24', '#a855f7', '#f43f5e'],
        });
      } catch {
        // Safe fallback if canvas-confetti blocked
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          className="relative w-full max-w-lg bg-white rounded-3xl border-b-8 border-indigo-200 shadow-2xl p-6 sm:p-8 text-slate-800 overflow-hidden"
        >
          {/* Top celebration icon */}
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 border-b-4 border-emerald-300 flex items-center justify-center text-emerald-600 mb-2 shadow-md">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs uppercase font-black tracking-widest text-emerald-600">
              Reaction Complete!
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
              Correct Formula!
            </h2>
            <div className="text-2xl sm:text-3xl font-mono font-black text-indigo-900 bg-sky-50 px-5 py-1.5 rounded-2xl border-2 border-sky-200 mt-2 shadow-xs">
              {level.targetFormula}
            </div>
            <span className="text-xs font-bold text-slate-500 mt-1">
              {level.targetCompoundName}
            </span>
          </div>

          {/* 2D Molecule Visualizer Preview */}
          <div className="mb-4">
            <MoleculeViewer2D
              slots={level.targetSlots.map((s, idx) => ({
                id: `solved_${idx}`,
                elementSymbol: s.elementSymbol,
                count: s.count,
              }))}
              isSolved={true}
              highlightCorrect={true}
              targetFormula={level.targetFormula}
            />
          </div>

          {/* Educational Explanation Box */}
          <div className="bg-indigo-50/80 rounded-2xl p-4 border-2 border-indigo-100 mb-4 text-xs sm:text-sm text-indigo-950 leading-relaxed shadow-inner">
            <p className="font-black text-indigo-700 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Chemistry Insight:</span>
            </p>
            <p className="font-medium text-slate-700">{level.educationalFact}</p>
          </div>

          {/* Points, Stars, and Streak Summary */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3.5 rounded-2xl border-2 border-slate-200 mb-5 text-center">
            {/* Stars */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Mastery</span>
              <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= starsEarned
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Score Earned */}
            <div className="flex flex-col items-center justify-center border-x-2 border-slate-200">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Points</span>
              <span className="text-base sm:text-lg font-black text-amber-600 font-mono mt-0.5">
                +{scoreEarned}
              </span>
            </div>

            {/* Streak */}
            <div className="flex flex-col items-center justify-center">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Streak</span>
              <div className="flex items-center gap-1 text-rose-600 font-bold text-sm sm:text-base mt-0.5">
                <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>{streak}x</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onReplayLevel();
                }}
                id="btn-replay-level"
                className="p-3 rounded-2xl bg-white border-b-4 border-slate-200 active:border-b-0 hover:bg-slate-50 text-slate-600 transition-all cursor-pointer shadow-xs"
                title="Replay this level"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenCodex();
                }}
                id="btn-feedback-codex"
                className="p-3 rounded-2xl bg-sky-100 border-b-4 border-sky-300 active:border-b-0 hover:bg-sky-200 text-sky-800 transition-all cursor-pointer shadow-xs"
                title="View in Almanac"
              >
                <BookOpen className="w-4 h-4 text-sky-600" />
              </button>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              id="btn-next-level"
              className="flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 text-white font-black text-sm sm:text-base border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>{isLastLevel ? 'Complete Laboratory!' : 'Next Level'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
