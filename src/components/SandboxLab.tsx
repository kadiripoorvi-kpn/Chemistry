import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Beaker,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  X,
  BookOpen,
} from 'lucide-react';
import { FormulaSlotItem } from '../types';
import { MoleculeViewer2D } from './MoleculeViewer2D';
import { ElementInventory } from './ElementInventory';
import { ELEMENTS } from '../data/elements';
import { COMPOUNDS_DATABASE } from '../data/compounds';
import { slotsToRawFormula, slotsToFormattedFormula } from '../utils/formula';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface SandboxLabProps {
  onDiscoverCompound: (formula: string) => void;
  discoveredFormulas: string[];
  onOpenCodex: () => void;
}

export const SandboxLab: React.FC<SandboxLabProps> = ({
  onDiscoverCompound,
  discoveredFormulas,
  onOpenCodex,
}) => {
  const [slots, setSlots] = useState<FormulaSlotItem[]>([
    { id: 'sb_0', elementSymbol: 'H', count: 2 },
    { id: 'sb_1', elementSymbol: 'O', count: 1 },
  ]);
  const [selectedElementForPlacement, setSelectedElementForPlacement] = useState<string | null>(null);
  const [synthesisResult, setSynthesisResult] = useState<{
    status: 'success' | 'unknown' | 'empty';
    message: string;
    compoundName?: string;
  } | null>(null);

  const currentRawFormula = slotsToRawFormula(slots);
  const currentFormattedFormula = slotsToFormattedFormula(slots);

  const handleAddSlot = () => {
    if (slots.length < 6) {
      sound.playClick();
      setSlots((prev) => [
        ...prev,
        { id: `sb_${Date.now()}_${prev.length}`, elementSymbol: null, count: 1 },
      ]);
    }
  };

  const handleRemoveSlot = (index: number) => {
    if (slots.length > 1) {
      sound.playPop();
      setSlots((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleDropElement = (slotIndex: number, symbol: string) => {
    setSlots((prev) =>
      prev.map((slot, idx) => (idx === slotIndex ? { ...slot, elementSymbol: symbol } : slot))
    );
    setSelectedElementForPlacement(null);
    setSynthesisResult(null);
  };

  const handleUpdateCount = (slotIndex: number, newCount: number) => {
    setSlots((prev) =>
      prev.map((slot, idx) => (idx === slotIndex ? { ...slot, count: newCount } : slot))
    );
    setSynthesisResult(null);
  };

  const handleReset = () => {
    sound.playBubble();
    setSlots([
      { id: 'sb_0', elementSymbol: null, count: 1 },
      { id: 'sb_1', elementSymbol: null, count: 1 },
    ]);
    setSelectedElementForPlacement(null);
    setSynthesisResult(null);
  };

  const handleSynthesize = () => {
    const raw = currentRawFormula;
    if (!raw) {
      sound.playWrong();
      setSynthesisResult({
        status: 'empty',
        message: 'Place at least one element into the slots to synthesize a compound!',
      });
      return;
    }

    const matched = COMPOUNDS_DATABASE[raw];
    if (matched) {
      sound.playSuccess();
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}

      onDiscoverCompound(matched.formula);
      setSynthesisResult({
        status: 'success',
        compoundName: matched.name,
        message: `Synthesized ${matched.name} (${matched.formula})! ${matched.description}`,
      });
    } else {
      sound.playBubble();
      setSynthesisResult({
        status: 'unknown',
        message: `Hypothetical or unstable combination! In nature, elements bond according to valence rules. Try common compounds like H₂O, CO₂, NaCl, NH₃, CH₄, H₂SO₄, or CaCO₃!`,
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Sandbox Header */}
      <div className="bg-white p-5 rounded-3xl border-b-8 border-indigo-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border-b-4 border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
            <Beaker className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
              <span>Free Chemistry Sandbox</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold">
                Discovery Lab
              </span>
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Freely combine any elements and discover valid chemical compounds!
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onOpenCodex();
          }}
          className="px-4 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-b-4 border-indigo-200 text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <BookOpen className="w-4 h-4" />
          <span>View Discovered ({discoveredFormulas.length})</span>
        </button>
      </div>

      {/* 2D Molecule Viewer */}
      <MoleculeViewer2D
        slots={slots}
        isSolved={synthesisResult?.status === 'success'}
        highlightCorrect={synthesisResult?.status === 'success'}
        targetFormula={synthesisResult?.status === 'success' ? currentRawFormula : undefined}
      />

      {/* Sandbox Formula Slots Area */}
      <div className="bg-white p-6 rounded-3xl border-b-8 border-indigo-200 flex flex-col items-center gap-5 shadow-xl">
        {/* Live Formula Banner */}
        <div className="w-full flex items-center justify-between bg-slate-50 px-5 py-3 rounded-2xl border-2 border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-black tracking-wider text-slate-400">Formula:</span>
            <span className="text-2xl sm:text-3xl font-black text-indigo-700 font-mono tracking-wide">
              {currentFormattedFormula || '—'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAddSlot}
              disabled={slots.length >= 6}
              className="px-3.5 py-1.5 text-xs font-black rounded-2xl bg-indigo-50 hover:bg-indigo-100 disabled:opacity-40 text-indigo-700 flex items-center gap-1.5 border-b-2 border-indigo-200 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Slot</span>
            </button>
          </div>
        </div>

        {/* Slots container */}
        <div className="w-full flex flex-wrap items-center justify-center gap-3.5 py-2">
          {slots.map((slot, index) => {
            const element = slot.elementSymbol ? ELEMENTS[slot.elementSymbol] : null;

            return (
              <div key={slot.id} className="flex flex-col items-center gap-2">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const sym = e.dataTransfer.getData('text/plain');
                    if (sym) {
                      sound.playSnap();
                      handleDropElement(index, sym);
                    }
                  }}
                  onClick={() => {
                    if (selectedElementForPlacement) {
                      sound.playSnap();
                      handleDropElement(index, selectedElementForPlacement);
                    }
                  }}
                  className={`relative w-22 h-26 sm:w-24 sm:h-28 rounded-3xl flex flex-col items-center justify-center transition-all cursor-pointer select-none border-3 ${
                    element
                      ? 'bg-white shadow-lg border-b-6'
                      : 'bg-slate-50 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/20'
                  }`}
                  style={{
                    borderColor: element ? element.color : undefined,
                  }}
                >
                  {element ? (
                    <>
                      <span
                        className="text-3xl sm:text-4xl font-black"
                        style={{ color: element.color }}
                      >
                        {element.symbol}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold truncate max-w-[85%]">
                        {element.name}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSlot(index);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 hover:bg-rose-600 text-white flex items-center justify-center shadow-md cursor-pointer border-2 border-white"
                        title="Delete slot"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-400 font-bold">Empty Slot</span>
                  )}
                </div>

                {/* Subscript Stepper */}
                <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-2xl border-2 border-slate-200 shadow-xs">
                  <button
                    onClick={() => {
                      if (slot.count > 1) {
                        sound.playCountTick(false);
                        handleUpdateCount(index, slot.count - 1);
                      }
                    }}
                    disabled={slot.count <= 1 || !element}
                    className="w-6 h-6 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-black text-indigo-900 font-mono">
                    {slot.count}
                  </span>
                  <button
                    onClick={() => {
                      if (slot.count < 24) {
                        sound.playCountTick(true);
                        handleUpdateCount(index, slot.count + 1);
                      }
                    }}
                    disabled={slot.count >= 24 || !element}
                    className="w-6 h-6 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center disabled:opacity-30 cursor-pointer shadow-xs active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Synthesis Result Feedback */}
        {synthesisResult && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full p-4 rounded-2xl border-2 text-xs sm:text-sm shadow-sm ${
              synthesisResult.status === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : synthesisResult.status === 'empty'
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : 'bg-indigo-50 border-indigo-300 text-indigo-900'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {synthesisResult.status === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Sparkles className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                {synthesisResult.compoundName && (
                  <h4 className="font-black text-slate-900 text-sm mb-0.5">
                    {synthesisResult.compoundName}
                  </h4>
                )}
                <p className="leading-relaxed font-medium">{synthesisResult.message}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Control Bar */}
        <div className="w-full flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handleReset}
            className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border-b-4 border-slate-200 text-xs sm:text-sm font-black flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSynthesize}
            className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm sm:text-base border-b-4 border-indigo-800 active:border-b-0 shadow-lg flex items-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>SYNTHESIZE COMPOUND</span>
          </button>
        </div>
      </div>

      {/* Complete Periodic Table Inventory for Sandbox */}
      <ElementInventory
        availableElementSymbols={Object.keys(ELEMENTS)}
        selectedElementForPlacement={selectedElementForPlacement}
        onSelectElement={(sym) => setSelectedElementForPlacement(sym)}
        showAllAvailable={true}
      />
    </div>
  );
};
