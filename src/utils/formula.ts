import { FormulaSlotItem, LevelData } from '../types';
import { ELEMENTS } from '../data/elements';

const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
};

/**
 * Converts a raw formula like "H2O" or "C6H12O6" into unicode subscript formatted "H₂O", "C₆H₁₂O₆"
 */
export function formatFormulaSubscript(formula: string): string {
  return formula.replace(/\d+/g, (match) => {
    return match
      .split('')
      .map((d) => SUBSCRIPT_MAP[d] || d)
      .join('');
  });
}

/**
 * Converts formula slot items into a raw formula string (e.g. "H2O")
 */
export function slotsToRawFormula(slots: FormulaSlotItem[]): string {
  return slots
    .filter((slot) => slot.elementSymbol !== null)
    .map((slot) => {
      const sym = slot.elementSymbol;
      const count = slot.count;
      if (count <= 1) return sym;
      return `${sym}${count}`;
    })
    .join('');
}

/**
 * Formats a slots array directly into pretty chemical formula with subscripts
 */
export function slotsToFormattedFormula(slots: FormulaSlotItem[]): string {
  const raw = slotsToRawFormula(slots);
  return formatFormulaSubscript(raw);
}

export interface ValidationResult {
  isCorrect: boolean;
  errorType?: 'empty' | 'missing_element' | 'wrong_element' | 'wrong_count' | 'wrong_order';
  errorSlotIndex?: number;
  diagnosticFeedback: string;
}

/**
 * Validates the player's constructed formula slots against the level targets
 */
export function validateFormula(
  playerSlots: FormulaSlotItem[],
  level: LevelData
): ValidationResult {
  const activeSlots = playerSlots.filter((s) => s.elementSymbol !== null);

  if (activeSlots.length === 0) {
    return {
      isCorrect: false,
      errorType: 'empty',
      diagnosticFeedback: 'Your formula workbench is empty! Drag elements into the slots to build the compound.',
    };
  }

  // Check if all slots required by target are filled
  if (activeSlots.length < level.targetSlots.length) {
    const missingCount = level.targetSlots.length - activeSlots.length;
    return {
      isCorrect: false,
      errorType: 'missing_element',
      diagnosticFeedback: `You need ${missingCount} more element${missingCount > 1 ? 's' : ''} in the formula!`,
    };
  }

  // Check each slot in order
  for (let i = 0; i < level.targetSlots.length; i++) {
    const target = level.targetSlots[i];
    const player = activeSlots[i];

    if (!player) {
      return {
        isCorrect: false,
        errorType: 'missing_element',
        errorSlotIndex: i,
        diagnosticFeedback: `Slot ${i + 1} is empty!`,
      };
    }

    if (player.elementSymbol !== target.elementSymbol) {
      const elementName = ELEMENTS[target.elementSymbol]?.name || target.elementSymbol;
      return {
        isCorrect: false,
        errorType: 'wrong_element',
        errorSlotIndex: i,
        diagnosticFeedback: `Slot ${i + 1} has ${ELEMENTS[player.elementSymbol]?.name || player.elementSymbol}, but needs ${elementName} (${target.elementSymbol})!`,
      };
    }

    if (level.allowSubscripts && player.count !== target.count) {
      const elementName = ELEMENTS[target.elementSymbol]?.name || target.elementSymbol;
      const direction = player.count < target.count ? 'more' : 'fewer';
      return {
        isCorrect: false,
        errorType: 'wrong_count',
        errorSlotIndex: i,
        diagnosticFeedback: `Check the atom count of ${elementName}! You have ${player.count}, but need ${direction} (${target.count}).`,
      };
    }
  }

  // Check for extra slots beyond target
  if (activeSlots.length > level.targetSlots.length) {
    return {
      isCorrect: false,
      errorType: 'wrong_order',
      diagnosticFeedback: `Too many elements! This formula only contains ${level.targetSlots.length} different elements.`,
    };
  }

  return {
    isCorrect: true,
    diagnosticFeedback: 'Formula constructed accurately! Well done, chemist!',
  };
}

/**
 * Calculates points earned for a level completion
 */
export function calculatePoints(hintLevelUsed: number, comboStreak: number): number {
  let basePoints = 100;
  if (hintLevelUsed === 1) basePoints = 75;
  else if (hintLevelUsed === 2) basePoints = 50;
  else if (hintLevelUsed === 3) basePoints = 25;

  // Streak combo bonus: +10% per consecutive correct answer up to +50%
  const comboBonus = Math.min(comboStreak * 10, 50);
  return Math.round(basePoints * (1 + comboBonus / 100));
}
