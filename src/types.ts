export type ElementCategory =
  | 'nonmetal'
  | 'noble-gas'
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'halogen'
  | 'transition-metal'
  | 'post-transition';

export interface ChemicalElement {
  symbol: string;
  name: string;
  atomicNumber: number;
  category: ElementCategory;
  color: string;
  textColor: string;
  accentColor: string;
  description: string;
  valency?: number;
}

export interface FormulaSlotItem {
  id: string;
  elementSymbol: string | null;
  count: number;
  locked?: boolean; // For "Complete the Formula" mode where some parts are fixed
}

export type ChallengeMode =
  | 'build_formula'     // Mode A: Build given compound name (e.g. "Build Water")
  | 'complete_formula'  // Mode B: Fill in missing element/subscript
  | 'fix_formula'       // Mode C: Fix erroneous formula
  | 'elements_to_compound' // Mode D: Given elements, build the compound
  | 'formula_challenge'; // Mode E: Construct target formula e.g. C6H12O6

export interface LevelHint {
  level: 1 | 2 | 3;
  text: string;
}

export interface LevelData {
  id: number;
  tier: 1 | 2 | 3 | 4 | 5;
  title: string;
  targetCompoundName: string;
  targetFormula: string; // e.g. "H2O", "C6H12O6"
  mode: ChallengeMode;
  prompt: string;
  subPrompt?: string;
  educationalFact: string;
  availableElements: string[]; // Element symbols to show in inventory
  initialSlots?: { elementSymbol: string | null; count: number; locked?: boolean }[];
  targetSlots: { elementSymbol: string; count: number }[];
  hints: LevelHint[];
  maxSlots: number;
  allowSubscripts: boolean;
}

export interface DiscoveredCompound {
  formula: string;
  name: string;
  commonName?: string;
  description: string;
  category: string;
  atomsSummary: string;
  discoveredAt?: number;
}

export interface GameStats {
  score: number;
  highScore: number;
  streak: number;
  maxStreak: number;
  completedLevels: Record<number, { stars: number; score: number; date: string }>;
  unlockedLevel: number;
  hintsUsedTotal: number;
  discoveredCompounds: string[]; // Formulas
}
