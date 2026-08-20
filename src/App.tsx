/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TopBar } from './components/TopBar';
import { LabWorkbench } from './components/LabWorkbench';
import { ElementInventory } from './components/ElementInventory';
import { FeedbackModal } from './components/FeedbackModal';
import { AiAssistant } from './components/AiAssistant';
import { TutorialModal } from './components/TutorialModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { CodexModal } from './components/CodexModal';
import { SandboxLab } from './components/SandboxLab';
import { GAME_LEVELS } from './data/levels';
import { GameStats, FormulaSlotItem } from './types';
import { validateFormula, calculatePoints } from './utils/formula';
import { sound } from './utils/audio';

const STORAGE_KEY = 'chem_formula_builder_v1_stats';

const DEFAULT_STATS: GameStats = {
  score: 0,
  highScore: 0,
  streak: 0,
  maxStreak: 0,
  completedLevels: {},
  unlockedLevel: 0,
  hintsUsedTotal: 0,
  discoveredCompounds: ['H2O', 'NaCl'],
};

export default function App() {
  // 1. Stats and Storage
  const [stats, setStats] = useState<GameStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return DEFAULT_STATS;
  });

  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const [isSandboxMode, setIsSandboxMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals state
  const [showTutorialModal, setShowTutorialModal] = useState<boolean>(false);
  const [showLevelSelectModal, setShowLevelSelectModal] = useState<boolean>(false);
  const [showCodexModal, setShowCodexModal] = useState<boolean>(false);
  const [showAiHintModal, setShowAiHintModal] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);

  // Gameplay state
  const currentLevel = GAME_LEVELS[currentLevelIndex] || GAME_LEVELS[0];
  const [slots, setSlots] = useState<FormulaSlotItem[]>([]);
  const [hintLevelUsed, setHintLevelUsed] = useState<number>(0);
  const [selectedElementForPlacement, setSelectedElementForPlacement] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [highlightCorrect, setHighlightCorrect] = useState<boolean>(false);
  const [lastScoreEarned, setLastScoreEarned] = useState<number>(0);
  const [lastStarsEarned, setLastStarsEarned] = useState<number>(0);

  // Save stats to localStorage on update
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {}
  }, [stats]);

  // First time visitor opens tutorial automatically
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('chem_formula_builder_seen_tutorial');
    if (!hasSeenTutorial) {
      setShowTutorialModal(true);
      localStorage.setItem('chem_formula_builder_seen_tutorial', 'true');
    }
  }, []);

  // Initialize slots whenever level changes
  const initLevel = useCallback((lvlIndex: number) => {
    const lvl = GAME_LEVELS[lvlIndex];
    if (!lvl) return;

    let newSlots: FormulaSlotItem[] = [];
    if (lvl.initialSlots && lvl.initialSlots.length > 0) {
      newSlots = lvl.initialSlots.map((s, idx) => ({
        id: `slot_${lvl.id}_${idx}`,
        elementSymbol: s.elementSymbol,
        count: s.count,
        locked: s.locked,
      }));
    } else {
      newSlots = Array.from({ length: lvl.maxSlots }, (_, idx) => ({
        id: `slot_${lvl.id}_${idx}`,
        elementSymbol: null,
        count: 1,
      }));
    }

    setSlots(newSlots);
    setHintLevelUsed(0);
    setErrorFeedback(null);
    setSelectedElementForPlacement(null);
    setHighlightCorrect(false);
  }, []);

  useEffect(() => {
    initLevel(currentLevelIndex);
  }, [currentLevelIndex, initLevel]);

  // Handle placing element into slot
  const handleDropElement = (slotIndex: number, elementSymbol: string) => {
    setSlots((prev) =>
      prev.map((slot, idx) => {
        if (idx === slotIndex && !slot.locked) {
          return { ...slot, elementSymbol };
        }
        return slot;
      })
    );
    setSelectedElementForPlacement(null);
    setErrorFeedback(null);
  };

  // Handle removing element from slot
  const handleRemoveElement = (slotIndex: number) => {
    setSlots((prev) =>
      prev.map((slot, idx) => {
        if (idx === slotIndex && !slot.locked) {
          return { ...slot, elementSymbol: null, count: 1 };
        }
        return slot;
      })
    );
    setErrorFeedback(null);
  };

  // Handle updating atom count
  const handleUpdateCount = (slotIndex: number, newCount: number) => {
    setSlots((prev) =>
      prev.map((slot, idx) => {
        if (idx === slotIndex && !slot.locked) {
          return { ...slot, count: Math.max(1, Math.min(24, newCount)) };
        }
        return slot;
      })
    );
    setErrorFeedback(null);
  };

  // Reset workbench
  const handleResetWorkbench = () => {
    initLevel(currentLevelIndex);
  };

  // Unlock next progressive hint
  const handleUnlockNextHint = () => {
    if (hintLevelUsed < 3) {
      const nextLevel = (hintLevelUsed + 1) as 1 | 2 | 3;
      setHintLevelUsed(nextLevel);
      setStats((prev) => ({
        ...prev,
        hintsUsedTotal: prev.hintsUsedTotal + 1,
      }));
    }
  };

  // Check player formula submission
  const handleCheckAnswer = () => {
    const validation = validateFormula(slots, currentLevel);

    if (validation.isCorrect) {
      setHighlightCorrect(true);
      const points = calculatePoints(hintLevelUsed, stats.streak);
      const stars = hintLevelUsed === 0 ? 3 : hintLevelUsed === 1 ? 2 : 1;
      const newStreak = stats.streak + 1;

      setLastScoreEarned(points);
      setLastStarsEarned(stars);

      setStats((prev) => {
        const nextUnlocked = Math.max(prev.unlockedLevel, currentLevelIndex + 1);
        const existingLevelRecord = prev.completedLevels[currentLevel.id];
        const bestStars = existingLevelRecord
          ? Math.max(existingLevelRecord.stars, stars)
          : stars;
        const bestScore = existingLevelRecord
          ? Math.max(existingLevelRecord.score, points)
          : points;

        const newDiscovered = prev.discoveredCompounds.includes(currentLevel.targetFormula)
          ? prev.discoveredCompounds
          : [...prev.discoveredCompounds, currentLevel.targetFormula];

        return {
          ...prev,
          score: prev.score + points,
          streak: newStreak,
          maxStreak: Math.max(prev.maxStreak, newStreak),
          unlockedLevel: nextUnlocked,
          completedLevels: {
            ...prev.completedLevels,
            [currentLevel.id]: {
              stars: bestStars,
              score: bestScore,
              date: new Date().toISOString(),
            },
          },
          discoveredCompounds: newDiscovered,
        };
      });

      setShowFeedbackModal(true);
    } else {
      sound.playWrong();
      setErrorFeedback(validation.diagnosticFeedback);
      // Reset streak on error
      setStats((prev) => ({ ...prev, streak: 0 }));
    }
  };

  // Next level handler
  const handleNextLevel = () => {
    setShowFeedbackModal(false);
    if (currentLevelIndex < GAME_LEVELS.length - 1) {
      setCurrentLevelIndex((prev) => prev + 1);
    } else {
      // Completed all levels - open Level Select map!
      setShowLevelSelectModal(true);
    }
  };

  // Replay current level
  const handleReplayLevel = () => {
    setShowFeedbackModal(false);
    initLevel(currentLevelIndex);
  };

  // Discover compound in sandbox
  const handleDiscoverInSandbox = (formula: string) => {
    setStats((prev) => {
      if (prev.discoveredCompounds.includes(formula)) return prev;
      return {
        ...prev,
        score: prev.score + 50,
        discoveredCompounds: [...prev.discoveredCompounds, formula],
      };
    });
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.setMuted(nextMuted);
  };

  return (
    <div className="min-h-screen bg-sky-50 text-slate-800 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Header TopBar */}
      <TopBar
        currentLevelIndex={currentLevelIndex}
        totalLevels={GAME_LEVELS.length}
        stats={stats}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onOpenTutorial={() => setShowTutorialModal(true)}
        onOpenLevelSelect={() => setShowLevelSelectModal(true)}
        onOpenCodex={() => setShowCodexModal(true)}
        onToggleSandbox={() => setIsSandboxMode((prev) => !prev)}
        isSandboxMode={isSandboxMode}
      />

      {/* 2. Main Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6">
        {!isSandboxMode ? (
          <>
            {/* Main Interactive Lab Workbench */}
            <LabWorkbench
              level={currentLevel}
              slots={slots}
              onDropElement={handleDropElement}
              onRemoveElement={handleRemoveElement}
              onUpdateCount={handleUpdateCount}
              onCheckAnswer={handleCheckAnswer}
              onReset={handleResetWorkbench}
              onOpenHint={() => setShowAiHintModal(true)}
              hintLevelUsed={hintLevelUsed}
              highlightCorrect={highlightCorrect}
              selectedElementForPlacement={selectedElementForPlacement}
              onSelectSlotToPlace={(idx) => {
                if (selectedElementForPlacement) {
                  handleDropElement(idx, selectedElementForPlacement);
                }
              }}
              errorFeedback={errorFeedback}
            />

            {/* Element Inventory Tray */}
            <ElementInventory
              availableElementSymbols={currentLevel.availableElements}
              selectedElementForPlacement={selectedElementForPlacement}
              onSelectElement={(symbol) => {
                setSelectedElementForPlacement((prev) => (prev === symbol ? null : symbol));
              }}
            />
          </>
        ) : (
          /* Free Experimentation Sandbox Mode */
          <SandboxLab
            onDiscoverCompound={handleDiscoverInSandbox}
            discoveredFormulas={stats.discoveredCompounds}
            onOpenCodex={() => setShowCodexModal(true)}
          />
        )}
      </main>

      {/* 3. Footer */}
      <footer className="w-full border-t-2 border-sky-200/80 bg-white/70 backdrop-blur-xs py-3.5 px-6 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-semibold text-slate-600">
          <span className="text-indigo-600 font-bold">CHEM-BUILDER PRO</span>
          <span>•</span>
          <span>Interactive 2D Chemistry Laboratory</span>
        </div>
        <div className="mt-1 sm:mt-0 text-slate-400 font-medium">
          Junior Chemists & Science Learners Learning Sandbox
        </div>
      </footer>

      {/* 4. Modals */}
      {/* AI Assistant Hints Modal */}
      <AiAssistant
        isOpen={showAiHintModal}
        onClose={() => setShowAiHintModal(false)}
        hints={currentLevel.hints}
        currentHintLevel={hintLevelUsed}
        onUnlockNextHint={handleUnlockNextHint}
        targetCompoundName={currentLevel.targetCompoundName}
      />

      {/* Level Complete Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        level={currentLevel}
        scoreEarned={lastScoreEarned}
        starsEarned={lastStarsEarned}
        streak={stats.streak}
        onNextLevel={handleNextLevel}
        onReplayLevel={handleReplayLevel}
        onOpenCodex={() => {
          setShowFeedbackModal(false);
          setShowCodexModal(true);
        }}
        isLastLevel={currentLevelIndex >= GAME_LEVELS.length - 1}
      />

      {/* Interactive Replayable Tutorial Modal */}
      <TutorialModal
        isOpen={showTutorialModal}
        onClose={() => setShowTutorialModal(false)}
      />

      {/* Level Select Map Modal */}
      <LevelSelectModal
        isOpen={showLevelSelectModal}
        onClose={() => setShowLevelSelectModal(false)}
        levels={GAME_LEVELS}
        currentLevelIndex={currentLevelIndex}
        stats={stats}
        onSelectLevel={(idx) => {
          setCurrentLevelIndex(idx);
          setIsSandboxMode(false);
        }}
      />

      {/* Discovered Compounds Codex / Almanac Modal */}
      <CodexModal
        isOpen={showCodexModal}
        onClose={() => setShowCodexModal(false)}
        discoveredFormulas={stats.discoveredCompounds}
      />
    </div>
  );
}
