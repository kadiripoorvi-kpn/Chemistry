import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ELEMENTS, ELEMENT_CATEGORIES } from '../data/elements';
import { ChemicalElement } from '../types';
import { sound } from '../utils/audio';
import { Search, Sparkles, Hand } from 'lucide-react';

interface ElementInventoryProps {
  availableElementSymbols: string[];
  selectedElementForPlacement: string | null;
  onSelectElement: (symbol: string) => void;
  showAllAvailable?: boolean; // For sandbox mode
}

export const ElementInventory: React.FC<ElementInventoryProps> = ({
  availableElementSymbols,
  selectedElementForPlacement,
  onSelectElement,
  showAllAvailable = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const symbolsToDisplay = showAllAvailable
    ? Object.keys(ELEMENTS)
    : availableElementSymbols;

  const filteredElements = symbolsToDisplay
    .map((sym) => ELEMENTS[sym])
    .filter((el): el is ChemicalElement => {
      if (!el) return false;
      if (activeCategory !== 'all' && el.category !== activeCategory) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          el.name.toLowerCase().includes(q) ||
          el.symbol.toLowerCase().includes(q) ||
          el.description.toLowerCase().includes(q)
        );
      }
      return true;
    });

  const handleDragStart = (e: React.DragEvent, symbol: string) => {
    e.dataTransfer.setData('text/plain', symbol);
    e.dataTransfer.effectAllowed = 'copy';
    sound.playPop();
  };

  return (
    <div className="w-full bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-xl border-b-8 border-slate-950 text-white flex flex-col gap-3.5">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
          <h3 className="text-xs sm:text-sm font-black text-slate-300 uppercase tracking-widest">
            Element Inventory
          </h3>
          <span className="text-xs text-slate-400 hidden sm:inline font-medium">
            (Drag or tap a card to place into formula)
          </span>
        </div>

        {/* Categories / Search for Sandbox or large trays */}
        {showAllAvailable && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search element..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Pills (if sandbox mode or > 6 elements) */}
      {(showAllAvailable || symbolsToDisplay.length > 8) && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {ELEMENT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                sound.playClick();
                setActiveCategory(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-indigo-500 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Element Cards Carousel / Grid */}
      <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto py-2.5 px-1 no-scrollbar select-none">
        {filteredElements.map((element) => {
          const isSelected = selectedElementForPlacement === element.symbol;

          return (
            <motion.div
              key={element.symbol}
              draggable
              onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, element.symbol)}
              onClick={() => {
                sound.playPop();
                onSelectElement(element.symbol);
              }}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.95 }}
              id={`element-card-${element.symbol}`}
              className={`relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-2xl p-2 flex flex-col justify-between items-center transition-all cursor-grab active:cursor-grabbing shadow-lg ${
                isSelected
                  ? 'ring-4 ring-white ring-offset-2 ring-offset-indigo-600 scale-105'
                  : ''
              }`}
              style={{
                backgroundColor: element.color,
                borderBottomWidth: '6px',
                borderBottomColor: element.accentColor,
              }}
              title={`${element.name} (${element.symbol}) - ${element.description}`}
            >
              {/* Top Row: Atomic number */}
              <div className="w-full flex items-center justify-between text-[10px] font-mono leading-none">
                <span className="text-white/80 font-bold">{element.atomicNumber}</span>
              </div>

              {/* Big Chemical Symbol */}
              <div className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-none">
                {element.symbol}
              </div>

              {/* Element Name */}
              <div className="w-full text-center">
                <p className="text-[10px] font-bold text-white/90 truncate leading-none">
                  {element.name}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Touch/Mouse Hint Bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 px-1">
        <div className="flex items-center gap-1.5">
          <Hand className="w-3.5 h-3.5 text-cyan-400" />
          <span>Desktop: <strong>Drag & Drop</strong> &nbsp;|&nbsp; Mobile: <strong>Tap element then tap slot</strong></span>
        </div>
      </div>
    </div>
  );
};
