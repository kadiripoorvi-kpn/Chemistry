import { ChemicalElement } from '../types';

export const ELEMENTS: Record<string, ChemicalElement> = {
  H: {
    symbol: 'H',
    name: 'Hydrogen',
    atomicNumber: 1,
    category: 'nonmetal',
    color: '#f43f5e', // rose-500
    textColor: '#ffffff',
    accentColor: '#be123c', // rose-700 border
    description: 'The lightest and most abundant element in the universe! Powers the Sun.',
    valency: 1,
  },
  He: {
    symbol: 'He',
    name: 'Helium',
    atomicNumber: 2,
    category: 'noble-gas',
    color: '#a855f7', // purple-500
    textColor: '#ffffff',
    accentColor: '#7e22ce', // purple-700
    description: 'Lighter than air noble gas used in balloons and cooling magnets.',
    valency: 0,
  },
  C: {
    symbol: 'C',
    name: 'Carbon',
    atomicNumber: 6,
    category: 'nonmetal',
    color: '#475569', // slate-600
    textColor: '#ffffff',
    accentColor: '#0f172a', // slate-900 border
    description: 'The chemical backbone of all known life on Earth! Found in diamonds and graphite.',
    valency: 4,
  },
  N: {
    symbol: 'N',
    name: 'Nitrogen',
    atomicNumber: 7,
    category: 'nonmetal',
    color: '#3b82f6', // blue-500
    textColor: '#ffffff',
    accentColor: '#1d4ed8', // blue-700
    description: 'Makes up about 78% of the Earth atmosphere. Essential for plant growth.',
    valency: 3,
  },
  O: {
    symbol: 'O',
    name: 'Oxygen',
    atomicNumber: 8,
    category: 'nonmetal',
    color: '#10b981', // emerald-500
    textColor: '#ffffff',
    accentColor: '#047857', // emerald-700
    description: 'Essential for breathing and combustion. Makes up 21% of our air.',
    valency: 2,
  },
  Na: {
    symbol: 'Na',
    name: 'Sodium',
    atomicNumber: 11,
    category: 'alkali-metal',
    color: '#f97316', // orange-500
    textColor: '#ffffff',
    accentColor: '#c2410c', // orange-700
    description: 'A soft, reactive metal that combines with chlorine to make table salt.',
    valency: 1,
  },
  Mg: {
    symbol: 'Mg',
    name: 'Magnesium',
    atomicNumber: 12,
    category: 'alkaline-earth',
    color: '#a855f7', // purple-500
    textColor: '#ffffff',
    accentColor: '#7e22ce', // purple-700
    description: 'Burns with a brilliant white light. Central atom in chlorophyll for plants.',
    valency: 2,
  },
  Al: {
    symbol: 'Al',
    name: 'Aluminum',
    atomicNumber: 13,
    category: 'post-transition',
    color: '#64748b', // slate-500
    textColor: '#ffffff',
    accentColor: '#334155',
    description: 'Lightweight, strong, rust-resistant metal used in airplanes and cans.',
    valency: 3,
  },
  Si: {
    symbol: 'Si',
    name: 'Silicon',
    atomicNumber: 14,
    category: 'nonmetal',
    color: '#06b6d4', // cyan-500
    textColor: '#ffffff',
    accentColor: '#0e7490',
    description: 'Semiconductor material powering computer microchips and found in sand.',
    valency: 4,
  },
  P: {
    symbol: 'P',
    name: 'Phosphorus',
    atomicNumber: 15,
    category: 'nonmetal',
    color: '#ea580c', // orange-600
    textColor: '#ffffff',
    accentColor: '#9a3412',
    description: 'Glows in the dark when exposed to oxygen; vital for DNA and cell energy (ATP).',
    valency: 3,
  },
  S: {
    symbol: 'S',
    name: 'Sulfur',
    atomicNumber: 16,
    category: 'nonmetal',
    color: '#f59e0b', // amber-500
    textColor: '#ffffff',
    accentColor: '#b45309', // amber-700
    description: 'Bright yellow solid found near volcanoes, gives match heads their scent.',
    valency: 2,
  },
  Cl: {
    symbol: 'Cl',
    name: 'Chlorine',
    atomicNumber: 17,
    category: 'halogen',
    color: '#84cc16', // lime-500
    textColor: '#ffffff',
    accentColor: '#4d7c0f', // lime-700
    description: 'A yellow-green halogen used to disinfect swimming pools and make salt.',
    valency: 1,
  },
  K: {
    symbol: 'K',
    name: 'Potassium',
    atomicNumber: 19,
    category: 'alkali-metal',
    color: '#8b5cf6', // violet-500
    textColor: '#ffffff',
    accentColor: '#6d28d9',
    description: 'Important mineral found in bananas that helps nerve signals and muscles work.',
    valency: 1,
  },
  Ca: {
    symbol: 'Ca',
    name: 'Calcium',
    atomicNumber: 20,
    category: 'alkaline-earth',
    color: '#06b6d4', // cyan-500
    textColor: '#ffffff',
    accentColor: '#0e7490',
    description: 'Crucial for strong bones, teeth, eggshells, and seashell structures.',
    valency: 2,
  },
  Fe: {
    symbol: 'Fe',
    name: 'Iron',
    atomicNumber: 26,
    category: 'transition-metal',
    color: '#d97706', // amber-600
    textColor: '#78350f',
    accentColor: '#b45309',
    description: 'Magnetic metal that carries oxygen in our blood and builds bridges.',
    valency: 2,
  },
  Cu: {
    symbol: 'Cu',
    name: 'Copper',
    atomicNumber: 29,
    category: 'transition-metal',
    color: '#f97316', // orange-500
    textColor: '#7c2d12',
    accentColor: '#ea580c',
    description: 'Reddish metal that conducts electricity exceptionally well.',
    valency: 2,
  },
  Zn: {
    symbol: 'Zn',
    name: 'Zinc',
    atomicNumber: 30,
    category: 'transition-metal',
    color: '#64748b', // slate-500
    textColor: '#1e293b',
    accentColor: '#475569',
    description: 'Protects steel from rusting and boosts immune system health.',
    valency: 2,
  },
  Ag: {
    symbol: 'Ag',
    name: 'Silver',
    atomicNumber: 47,
    category: 'transition-metal',
    color: '#cbd5e1', // slate-300
    textColor: '#334155',
    accentColor: '#94a3b8',
    description: 'Shiny precious metal with the highest electrical and thermal conductivity.',
    valency: 1,
  },
  Au: {
    symbol: 'Au',
    name: 'Gold',
    atomicNumber: 79,
    category: 'transition-metal',
    color: '#facc15', // yellow-400
    textColor: '#713f12',
    accentColor: '#eab308',
    description: 'Noble precious metal that never tarnishes or rusts.',
    valency: 1,
  },
};

export const ELEMENT_CATEGORIES: { id: string; label: string; bg: string }[] = [
  { id: 'all', label: 'All Elements', bg: 'bg-slate-700' },
  { id: 'nonmetal', label: 'Non-Metals', bg: 'bg-sky-500' },
  { id: 'alkali-metal', label: 'Alkali Metals', bg: 'bg-amber-500' },
  { id: 'alkaline-earth', label: 'Alkaline Earth', bg: 'bg-emerald-500' },
  { id: 'halogen', label: 'Halogens', bg: 'bg-lime-500' },
  { id: 'transition-metal', label: 'Metals', bg: 'bg-orange-500' },
];
