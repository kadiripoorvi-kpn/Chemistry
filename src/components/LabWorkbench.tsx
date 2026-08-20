import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  RotateCcw,
  Lightbulb,
  Plus,
  Minus,
  X,
  Sparkles,
  Info,
} from 'lucide-react';
import { LevelData, FormulaSlotItem } from '../types';
import { MoleculeViewer2D } from './MoleculeViewer2D';
import { ELEMENTS } from '../data/elements';
import { slotsToFormattedFormula } from '../utils/formula';
import { sound } from '../utils/audio';

interface LabWorkbenchProps {
  level: LevelData;
  slots: FormulaSlotItem[];
  onDropElement: (slotIndex: number, elementSymbol: string) => void;
  onRemoveElement: (slotIndex: number) => void;
  onUpdateCount: (slotIndex: number, newCount: number) => void;
  onCheckAnswer: () => void;
  onReset: () => void;
  onOpenHint: () => void;
  hintLevelUsed: number;
  highlightCorrect?: boolean;
  selectedElementForPlacement: string | null;
  onSelectSlotToPlace: (slotIndex: number) => void;
  errorFeedback: string | null;
}

export const LabWorkbench: React.FC<LabWorkbenchProps> = ({
  level,
  slots,
  onDropElement,
  onRemoveElement,
  onUpdateCount,
  onCheckAnswer,
  onReset,
  onOpenHint,
  hintLevelUsed,
  highlightCorrect = false,
  selectedElementForPlacement,
  onSelectSlotToPlace,
  errorFeedback,
}) => {
  const currentFormulaFormatted = slotsToFormattedFormula(slots);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDropOnSlot = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    const symbol = e.dataTransfer.getData('text/plain');
    if (symbol && ELEMENTS[symbol]) {
      sound.playSnap();
      onDropElement(slotIndex, symbol);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch">
      {/* LEFT COLUMN: Current Mission & Information Card */}
      <div className="w-full lg:w-1/3 flex flex-col gap-5 justify-between">
        <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-xl border-b-8 border-indigo-100 flex-1 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl select-none pointer-events-none">
            🔬
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black text-indigo-500 uppercase tracking-widest">
                Tier {level.tier} Mission
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold border border-sky-200">
                {level.title}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 leading-tight mb-3">
              Build the formula for{' '}
              <span className="text-indigo-600">{level.targetCompoundName}</span>
            </h2>

            <p className="text-slate-500 leading-relaxed text-sm sm:text-base mb-6">
              {level.prompt}
              {level.subPrompt && (
                <span className="block mt-2 text-indigo-700 font-medium text-xs sm:text-sm">
                  {level.subPrompt}
                </span>
              )}
            </p>
          </div>

          {/* Target Structure Box */}
          <div className="bg-sky-50 p-4 sm:p-5 rounded-2xl border-2 border-dashed border-sky-200 shadow-inner">
            <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
              Target Structure
            </div>
            <div className="text-3xl sm:text-4xl font-black tracking-tighter text-sky-900 font-mono">
              {level.targetFormula}
            </div>
          </div>
        </div>

        {/* Action Controls for Reset & Hint */}
        <div className="flex gap-3 sm:gap-4">
          <button
            onClick={() => {
              sound.playBubble();
              onReset();
            }}
            id="btn-reset-workbench"
            className="flex-1 bg-white border-b-4 border-slate-200 active:border-b-0 hover:bg-slate-50 py-3.5 sm:py-4 rounded-2xl font-bold text-slate-600 transition-all flex items-center justify-center gap-2 shadow-sm active:translate-y-1 cursor-pointer"
            title="Reset slots"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span>RESET</span>
          </button>

          <button
            onClick={() => {
              sound.playHint();
              onOpenHint();
            }}
            id="btn-open-hint"
            className={`flex-1 border-b-4 active:border-b-0 py-3.5 sm:py-4 rounded-2xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-md active:translate-y-1 cursor-pointer ${
              hintLevelUsed > 0
                ? 'bg-amber-500 border-amber-700 hover:bg-amber-400'
                : 'bg-rose-500 border-rose-700 hover:bg-rose-400'
            }`}
            title="Get Chemistry Clue"
          >
            <Lightbulb className="w-4 h-4 text-white" />
            <span>{hintLevelUsed > 0 ? `HINT (${hintLevelUsed}/3)` : 'GET HINT'}</span>
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: Interactive Formula Assembly Stage */}
      <div className="flex-1 bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl border-b-[10px] sm:border-b-[12px] border-indigo-100 p-5 sm:p-8 flex flex-col items-center justify-between relative overflow-hidden gap-6">
        {/* Subtle dot grid pattern */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#6366f1 2px, transparent 2px)',
            backgroundSize: '30px 30px',
          }}
        />

        {/* 2D Molecule Visualizer Chamber */}
        <div className="w-full relative z-10">
          <MoleculeViewer2D
            slots={slots}
            isSolved={highlightCorrect}
            highlightCorrect={highlightCorrect}
            targetFormula={level.targetFormula}
          />
        </div>

        {/* Helper toast when an element is tapped on touch device */}
        {selectedElementForPlacement && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full relative z-10 bg-indigo-50 border-2 border-indigo-200 text-indigo-900 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>
                Selected <strong>[{selectedElementForPlacement}]</strong> — Tap an empty slot below to place it!
              </span>
            </div>
          </motion.div>
        )}

        {/* Formula Slots Container */}
        <div className="relative z-10 flex flex-col items-center gap-6 w-full">
          <div className="flex items-center gap-3 sm:gap-4 bg-slate-50 p-4 sm:p-6 rounded-[2.5rem] border-4 border-dashed border-slate-200 justify-center flex-wrap min-w-full sm:min-w-[460px]">
            {slots.map((slot, index) => {
              const element = slot.elementSymbol ? ELEMENTS[slot.elementSymbol] : null;
              const isClickTarget = selectedElementForPlacement !== null && !slot.locked;

              return (
                <React.Fragment key={slot.id}>
                  {index > 0 && (
                    <div className="text-3xl sm:text-4xl font-black text-slate-300 select-none">
                      +
                    </div>
                  )}

                  <div className="flex flex-col items-center gap-2.5">
                    {/* Element Tile / Drop Target */}
                    <div
                      id={`slot-${index}`}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnSlot(e, index)}
                      onClick={() => {
                        if (selectedElementForPlacement && !slot.locked) {
                          sound.playSnap();
                          onSelectSlotToPlace(index);
                        }
                      }}
                      className={`relative w-20 h-22 sm:w-24 sm:h-26 rounded-3xl flex flex-col items-center justify-center transition-all select-none cursor-pointer ${
                        slot.locked
                          ? 'opacity-80 cursor-not-allowed shadow-md'
                          : element
                          ? 'shadow-lg hover:scale-105 active:scale-95'
                          : isClickTarget
                          ? 'bg-sky-100 text-sky-500 border-4 border-dashed border-sky-400 animate-pulse shadow-md'
                          : 'bg-emerald-50 text-emerald-300 border-4 border-dashed border-emerald-200 hover:border-emerald-400'
                      }`}
                      style={{
                        backgroundColor: element ? element.color : undefined,
                        borderBottomWidth: element ? '8px' : undefined,
                        borderBottomColor: element ? element.accentColor : undefined,
                        color: element ? '#ffffff' : undefined,
                      }}
                    >
                      {element ? (
                        <>
                          <span className="text-3xl sm:text-4xl font-black tracking-tight leading-none">
                            {element.symbol}
                          </span>
                          <span className="text-[10px] font-bold text-white/90 truncate max-w-[85%] mt-0.5">
                            {element.name}
                          </span>

                          {/* Atomic number badge */}
                          <span className="absolute top-1.5 left-2.5 text-[9px] font-mono font-bold text-white/70">
                            {element.atomicNumber}
                          </span>

                          {/* Remove button if not locked */}
                          {!slot.locked && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                sound.playPop();
                                onRemoveElement(index);
                              }}
                              id={`btn-remove-slot-${index}`}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white hover:bg-rose-600 flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer border-2 border-white"
                              title="Remove element"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-0.5">
                          <span className="text-2xl sm:text-3xl font-black">?</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                            {isClickTarget ? 'Place' : 'Slot'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Subscript / Atom Quantity Controls */}
                    {level.allowSubscripts ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (slot.count > 1) {
                              sound.playCountTick(false);
                              onUpdateCount(index, slot.count - 1);
                            }
                          }}
                          disabled={slot.count <= 1 || slot.locked || !element}
                          id={`btn-dec-count-${index}`}
                          className="w-7 h-7 sm:w-8 sm:h-8 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center font-bold text-slate-400 hover:text-slate-700 disabled:opacity-30 shadow-xs active:scale-95 transition-all cursor-pointer"
                          title="Decrease atoms"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className="text-xl sm:text-2xl font-black text-slate-700 w-6 text-center font-mono">
                          {slot.count}
                        </span>

                        <button
                          onClick={() => {
                            if (slot.count < 24) {
                              sound.playCountTick(true);
                              onUpdateCount(index, slot.count + 1);
                            }
                          }}
                          disabled={slot.count >= 24 || slot.locked || !element}
                          id={`btn-inc-count-${index}`}
                          className="w-7 h-7 sm:w-8 sm:h-8 bg-white border-2 border-slate-200 rounded-xl flex items-center justify-center font-bold text-slate-400 hover:text-slate-700 disabled:opacity-30 shadow-xs active:scale-95 transition-all cursor-pointer"
                          title="Increase atoms"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="h-7 sm:h-8" />
                    )}
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Active Compound Formula Banner */}
          <div className="flex flex-col items-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
              Active Compound Formula
            </div>
            <div className="text-4xl sm:text-6xl font-black text-indigo-900 tracking-tighter font-mono">
              {currentFormulaFormatted || (
                <span className="text-slate-300">Empty Formula</span>
              )}
            </div>
          </div>
        </div>

        {/* Error Feedback Box if formula check failed */}
        <AnimatePresence>
          {errorFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full relative z-10 bg-rose-50 border-2 border-rose-200 text-rose-800 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 shadow-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping flex-shrink-0" />
              <span>{errorFeedback}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Check Answer Button */}
        <div className="w-full flex justify-center sm:justify-end relative z-10 pt-2">
          <button
            onClick={() => onCheckAnswer()}
            id="btn-check-formula"
            className="w-full sm:w-auto bg-indigo-600 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-lg sm:text-xl shadow-xl border-b-8 border-indigo-800 hover:bg-indigo-500 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>CHECK FORMULA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
