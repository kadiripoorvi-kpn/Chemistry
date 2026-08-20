import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Lock, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { LevelData, GameStats } from '../types';
import { sound } from '../utils/audio';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  levels: LevelData[];
  currentLevelIndex: number;
  stats: GameStats;
  onSelectLevel: (index: number) => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  levels,
  currentLevelIndex,
  stats,
  onSelectLevel,
}) => {
  if (!isOpen) return null;

  const tiers = [
    { tier: 1, title: 'Tier 1 — Element Recognition', desc: 'Meet fundamental element symbols' },
    { tier: 2, title: 'Tier 2 — Simple Compounds', desc: 'Water, Carbon Dioxide & Salt' },
    { tier: 3, title: 'Tier 3 — Formula Construction & Modes', desc: 'Fix, Complete & Build' },
    { tier: 4, title: 'Tier 4 — Multi-Element Compounds', desc: 'Acids & Carbonate Minerals' },
    { tier: 5, title: 'Tier 5 — Advanced Chemistry Challenge', desc: 'Glucose & Complex Formulas' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative w-full max-w-2xl max-h-[88vh] bg-white rounded-3xl border-b-8 border-indigo-200 shadow-2xl p-5 sm:p-7 text-slate-800 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
                <span>Chemistry Levels Map</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                  {Object.keys(stats.completedLevels).length}/{levels.length} Solved
                </span>
              </h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Select any unlocked challenge to practice or beat your high score!
              </p>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              id="btn-close-level-select"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 border-b-2 border-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Level List grouped by Tier */}
          <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1 no-scrollbar">
            {tiers.map((tierGroup) => {
              const tierLevels = levels.filter((l) => l.tier === tierGroup.tier);
              if (tierLevels.length === 0) return null;

              return (
                <div key={tierGroup.tier} className="space-y-2.5">
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-indigo-700 uppercase tracking-wider">
                      {tierGroup.title}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-500">{tierGroup.desc}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tierLevels.map((lvl) => {
                      const levelIdx = levels.findIndex((l) => l.id === lvl.id);
                      const isUnlocked = levelIdx <= stats.unlockedLevel;
                      const isCompleted = !!stats.completedLevels[lvl.id];
                      const stars = stats.completedLevels[lvl.id]?.stars || 0;
                      const isCurrent = levelIdx === currentLevelIndex;

                      return (
                        <div
                          key={lvl.id}
                          onClick={() => {
                            if (isUnlocked) {
                              sound.playClick();
                              onSelectLevel(levelIdx);
                              onClose();
                            }
                          }}
                          className={`relative rounded-2xl p-3.5 border-2 transition-all flex items-center justify-between ${
                            !isUnlocked
                              ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                              : isCurrent
                              ? 'bg-indigo-50 border-indigo-500 shadow-md cursor-pointer'
                              : 'bg-white hover:bg-indigo-50/40 border-slate-200 hover:border-indigo-300 cursor-pointer shadow-xs'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {/* Level Number / Status Badge */}
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm ${
                                !isUnlocked
                                  ? 'bg-slate-200 text-slate-400'
                                  : isCompleted
                                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300'
                                  : 'bg-indigo-600 text-white shadow-xs'
                              }`}
                            >
                              {!isUnlocked ? (
                                <Lock className="w-4 h-4" />
                              ) : isCompleted ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : (
                                lvl.id
                              )}
                            </div>

                            {/* Details */}
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                                {lvl.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-[11px] font-mono font-black text-indigo-700">
                                  {lvl.targetFormula}
                                </span>
                                <span className="text-[10px] font-medium text-slate-500">
                                  ({lvl.targetCompoundName})
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Stars / Action */}
                          <div className="flex flex-col items-end gap-1">
                            {isUnlocked ? (
                              <>
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3].map((s) => (
                                    <Star
                                      key={s}
                                      className={`w-3.5 h-3.5 ${
                                        s <= stars
                                          ? 'text-amber-400 fill-amber-400'
                                          : 'text-slate-200'
                                      }`}
                                    />
                                  ))}
                                </div>
                                {isCompleted && (
                                  <span className="text-[10px] text-amber-600 font-mono font-bold">
                                    {stats.completedLevels[lvl.id]?.score} pts
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider">
                                Locked
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
