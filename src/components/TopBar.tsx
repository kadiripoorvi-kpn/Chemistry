import React from 'react';
import {
  FlaskConical,
  Sparkles,
  Volume2,
  VolumeX,
  HelpCircle,
  BookOpen,
  Beaker,
  Flame,
  Grid,
} from 'lucide-react';
import { GameStats } from '../types';
import { sound } from '../utils/audio';

interface TopBarProps {
  currentLevelIndex: number;
  totalLevels: number;
  stats: GameStats;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenTutorial: () => void;
  onOpenLevelSelect: () => void;
  onOpenCodex: () => void;
  onToggleSandbox: () => void;
  isSandboxMode: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentLevelIndex,
  totalLevels,
  stats,
  isMuted,
  onToggleMute,
  onOpenTutorial,
  onOpenLevelSelect,
  onOpenCodex,
  onToggleSandbox,
  isSandboxMode,
}) => {
  const progressPercent = Math.round(((currentLevelIndex + 1) / totalLevels) * 100);

  return (
    <header className="w-full bg-white px-4 sm:px-8 py-3.5 sm:py-4 shadow-sm border-b-4 border-sky-200 text-slate-800 sticky top-0 z-30 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        {/* Left: App Logo & Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg shadow-indigo-500/30 border-b-4 border-indigo-700">
            <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-indigo-900 tracking-tight leading-none">
              CHEM-BUILDER <span className="text-sky-500">PRO</span>
            </h1>
            <p className="text-xs font-semibold text-slate-400 hidden sm:block mt-0.5">
              Interactive 2D Chemistry Laboratory
            </p>
          </div>
        </div>

        {/* Middle: Game Stats / Progress */}
        {!isSandboxMode ? (
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Level & Progress */}
            <div className="flex flex-col items-end">
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenLevelSelect();
                }}
                id="btn-level-select"
                className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 flex items-center gap-1.5 cursor-pointer transition-colors"
                title="Change Level"
              >
                <Grid className="w-3.5 h-3.5 text-indigo-500" />
                <span>
                  Level <span className="text-indigo-900 font-black">{currentLevelIndex + 1}</span> of {totalLevels}
                </span>
              </button>
              <div className="w-28 sm:w-48 h-3 bg-slate-100 rounded-full mt-1 overflow-hidden border border-slate-200 shadow-inner">
                <div
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Score */}
            <div className="bg-amber-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border-2 border-amber-200 flex items-center gap-2 shadow-xs">
              <span className="text-base sm:text-xl">⭐</span>
              <span className="text-sm sm:text-xl font-black text-amber-700 font-mono">
                {stats.score.toLocaleString()}
              </span>
            </div>

            {/* Combo Streak */}
            {stats.streak > 1 && (
              <div className="bg-rose-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl border-2 border-rose-200 flex items-center gap-1.5 text-rose-700 font-black text-xs sm:text-sm shadow-xs animate-bounce">
                <Flame className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>{stats.streak}x Combo</span>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-purple-100 px-4 py-2 rounded-2xl border-2 border-purple-200 flex items-center gap-2 text-purple-800 font-black text-xs sm:text-sm shadow-xs">
            <Beaker className="w-4 h-4 text-purple-600 animate-spin" />
            <span>Sandbox Discovery Lab</span>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Sandbox Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSandbox();
            }}
            id="btn-toggle-sandbox"
            className={`px-3 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              isSandboxMode
                ? 'bg-purple-600 text-white border-b-4 border-purple-800 active:border-b-0 hover:bg-purple-500'
                : 'bg-white border-b-4 border-slate-200 active:border-b-0 hover:bg-slate-50 text-slate-600'
            }`}
            title="Free Experimentation Sandbox"
          >
            <Beaker className="w-3.5 h-3.5 text-purple-500" />
            <span className="hidden sm:inline">{isSandboxMode ? 'Exit Lab' : 'Sandbox'}</span>
          </button>

          {/* Codex / Almanac */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenCodex();
            }}
            id="btn-open-codex"
            className="px-3 py-2 rounded-2xl bg-white border-b-4 border-slate-200 active:border-b-0 hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Discovered Compounds Almanac"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden md:inline">Almanac</span>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-300 font-black">
              {stats.discoveredCompounds.length}
            </span>
          </button>

          {/* Tutorial Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenTutorial();
            }}
            id="btn-open-tutorial"
            className="px-3 py-2 rounded-2xl bg-white border-b-4 border-slate-200 active:border-b-0 hover:bg-slate-50 text-slate-600 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Interactive Tutorial"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden md:inline">Guide</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              onToggleMute();
              sound.playClick();
            }}
            id="btn-sound-toggle"
            className="p-2 rounded-2xl bg-white border-b-4 border-slate-200 active:border-b-0 hover:bg-slate-50 text-slate-600 transition-all cursor-pointer shadow-xs"
            title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            aria-label="Toggle Sound"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-4 h-4 text-sky-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
