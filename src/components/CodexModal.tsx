import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Sparkles, Beaker, Search, Lock } from 'lucide-react';
import { COMPOUNDS_DATABASE } from '../data/compounds';
import { MoleculeViewer2D } from './MoleculeViewer2D';
import { sound } from '../utils/audio';

interface CodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  discoveredFormulas: string[];
}

export const CodexModal: React.FC<CodexModalProps> = ({
  isOpen,
  onClose,
  discoveredFormulas,
}) => {
  const [selectedFormula, setSelectedFormula] = useState<string>(
    discoveredFormulas[0] || 'H2O'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const allCompounds = Object.values(COMPOUNDS_DATABASE);

  const filteredCompounds = allCompounds.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.formula.toLowerCase().includes(q) ||
      (c.commonName && c.commonName.toLowerCase().includes(q)) ||
      c.category.toLowerCase().includes(q)
    );
  });

  const selectedCompound =
    COMPOUNDS_DATABASE[selectedFormula] || allCompounds[0];
  const isUnlocked = discoveredFormulas.includes(selectedCompound.formula);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl border-b-8 border-indigo-200 shadow-2xl p-5 sm:p-7 text-slate-800 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 border-b-2 border-emerald-300 flex items-center justify-center text-emerald-700 shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2">
                  <span>Compounds Almanac</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold">
                    {discoveredFormulas.length}/{allCompounds.length} Discovered
                  </span>
                </h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Explore molecular geometries and real-world chemical facts
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              id="btn-close-codex"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 border-b-2 border-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="pt-3 pb-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search compound by name or formula (e.g. Water, CO2, Sugar)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-2xl bg-slate-50 border-2 border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* Body: Left List, Right Detail */}
          <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden pt-2">
            {/* Left list of compounds */}
            <div className="w-full md:w-5/12 overflow-y-auto space-y-2 pr-1 max-h-52 md:max-h-full no-scrollbar">
              {filteredCompounds.map((comp) => {
                const unlocked = discoveredFormulas.includes(comp.formula);
                const isSelected = selectedFormula === comp.formula;

                return (
                  <div
                    key={comp.formula}
                    onClick={() => {
                      sound.playClick();
                      setSelectedFormula(comp.formula);
                    }}
                    className={`p-3 rounded-2xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 border-emerald-700 text-white shadow-md'
                        : unlocked
                        ? 'bg-white hover:bg-emerald-50/40 border-slate-200 text-slate-800 shadow-xs'
                        : 'bg-slate-100 border-slate-200 opacity-60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isSelected
                            ? 'bg-emerald-700 text-white'
                            : unlocked
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {unlocked ? <Beaker className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5 leading-snug">
                          <span>{unlocked ? comp.name : 'Unknown Compound'}</span>
                        </div>
                        <span className={`text-[11px] font-mono font-black ${isSelected ? 'text-white' : 'text-indigo-700'}`}>
                          {comp.formula}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold capitalize ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {comp.category}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right details view */}
            <div className="w-full md:w-7/12 bg-slate-50 rounded-2xl border-2 border-slate-200 p-4 flex flex-col justify-between overflow-y-auto no-scrollbar">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                      {selectedCompound.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
                      {isUnlocked ? selectedCompound.name : '??? (Undiscovered)'}
                    </h3>
                    {selectedCompound.commonName && isUnlocked && (
                      <p className="text-xs font-semibold text-slate-500 mt-0.5">
                        Common name: <strong className="text-indigo-900">{selectedCompound.commonName}</strong>
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-mono font-black text-indigo-900">
                      {selectedCompound.formula}
                    </span>
                  </div>
                </div>

                {/* 2D Molecule Viewer */}
                <div className="mb-4">
                  <MoleculeViewer2D
                    slots={[]}
                    isSolved={true}
                    highlightCorrect={isUnlocked}
                    targetFormula={selectedCompound.formula}
                  />
                </div>

                {/* Structure / Summary */}
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <div className="bg-white p-3.5 rounded-2xl border-2 border-slate-200 shadow-xs">
                    <span className="text-[11px] font-black text-indigo-700 block mb-0.5 uppercase tracking-wider">
                      Atom Composition:
                    </span>
                    <p className="text-slate-800 font-bold">{selectedCompound.atomsSummary}</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border-2 border-slate-200 shadow-xs">
                    <span className="text-[11px] font-black text-emerald-700 block mb-0.5 uppercase tracking-wider">
                      Scientific Description & Use:
                    </span>
                    <p className="leading-relaxed text-slate-600 font-medium">
                      {isUnlocked
                        ? selectedCompound.description
                        : 'Construct this formula during the campaign levels or in the sandbox lab to reveal its scientific notes and real-world applications!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
