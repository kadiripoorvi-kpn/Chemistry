import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ELEMENTS } from '../data/elements';
import { COMPOUNDS_DATABASE, MoleculeLayout } from '../data/compounds';
import { FormulaSlotItem } from '../types';
import { slotsToRawFormula } from '../utils/formula';

interface MoleculeViewer2DProps {
  slots: FormulaSlotItem[];
  isSolved?: boolean;
  highlightCorrect?: boolean;
  targetFormula?: string;
}

export const MoleculeViewer2D: React.FC<MoleculeViewer2DProps> = ({
  slots,
  isSolved = false,
  highlightCorrect = false,
  targetFormula,
}) => {
  const currentRawFormula = useMemo(() => slotsToRawFormula(slots), [slots]);

  // Determine which layout to show: either from database or fallback dynamic generator
  const moleculeData = useMemo(() => {
    const formulaKey = isSolved && targetFormula ? targetFormula : currentRawFormula;
    if (COMPOUNDS_DATABASE[formulaKey]?.layout) {
      return COMPOUNDS_DATABASE[formulaKey].layout!;
    }

    // Dynamic auto-layout generator for custom/sandbox formulas
    const activeSlots = slots.filter((s) => s.elementSymbol !== null);
    if (activeSlots.length === 0) return null;

    const totalAtoms = activeSlots.reduce((sum, s) => sum + s.count, 0);
    const nodes: MoleculeLayout['nodes'] = [];
    const bonds: MoleculeLayout['bonds'] = [];

    let nodeIdx = 0;
    // Distribute atoms in a balanced circular/linear arrangement
    activeSlots.forEach((slot, slotIdx) => {
      const sym = slot.elementSymbol!;
      const count = Math.min(slot.count, 12); // cap visual clutter

      for (let i = 0; i < count; i++) {
        const nodeId = `dyn_${slotIdx}_${i}`;
        let x = 50;
        let y = 50;

        if (totalAtoms === 1) {
          x = 50;
          y = 50;
        } else if (totalAtoms === 2) {
          x = nodeIdx === 0 ? 35 : 65;
          y = 50;
        } else if (totalAtoms === 3) {
          const angle = (nodeIdx / 3) * 2 * Math.PI - Math.PI / 2;
          x = 50 + 26 * Math.cos(angle);
          y = 50 + 26 * Math.sin(angle);
        } else {
          // Central-hub layout or circle
          if (nodeIdx === 0 && totalAtoms > 3) {
            x = 50;
            y = 50;
          } else {
            const surroundingCount = totalAtoms - 1;
            const surroundingIdx = nodeIdx - 1;
            const angle = (surroundingIdx / surroundingCount) * 2 * Math.PI - Math.PI / 2;
            const radius = Math.min(34, 18 + totalAtoms * 1.5);
            x = 50 + radius * Math.cos(angle);
            y = 50 + radius * Math.sin(angle);
          }
        }

        nodes.push({
          id: nodeId,
          symbol: sym,
          x,
          y,
          size: Math.max(20, Math.min(32, 40 - totalAtoms * 1.2)),
        });

        // Add bonds to center or previous
        if (nodeIdx > 0) {
          bonds.push({
            from: nodes[0].id,
            to: nodeId,
            type: 'single',
          });
        }

        nodeIdx++;
      }
    });

    return { nodes, bonds };
  }, [slots, currentRawFormula, isSolved, targetFormula]);

  return (
    <div className="relative w-full h-52 sm:h-64 bg-slate-900 rounded-3xl border-4 border-slate-800 overflow-hidden shadow-inner flex items-center justify-center p-3">
      {/* Background laboratory grid lines */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, #818cf8 1.5px, transparent 1.5px), linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)',
          backgroundSize: '24px 24px, 48px 48px, 48px 48px',
        }}
      />

      {/* Ambient Rising Bubbles in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-sky-400/20 border border-sky-300/40"
            style={{
              width: 8 + (i % 3) * 6,
              height: 8 + (i % 3) * 6,
              left: `${15 + i * 15}%`,
              bottom: '-20px',
            }}
            animate={{
              y: [-10, -260],
              opacity: [0, 0.7, 0],
              x: [0, (i % 2 === 0 ? 10 : -10)],
            }}
            transition={{
              duration: 3.5 + (i % 3),
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.6,
            }}
          />
        ))}
      </div>

      {/* Lab Flask Glow Aura */}
      {highlightCorrect && (
        <motion.div
          className="absolute inset-0 bg-emerald-500/20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Molecule 2D SVG rendering */}
      {moleculeData && moleculeData.nodes.length > 0 ? (
        <svg className="w-full h-full max-w-md max-h-56 select-none" viewBox="0 0 100 100">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="bondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#818cf8" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="ionicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#84cc16" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Render Bonds */}
          <g className="bonds">
            {moleculeData.bonds.map((bond, idx) => {
              const nodeA = moleculeData.nodes.find((n) => n.id === bond.from);
              const nodeB = moleculeData.nodes.find((n) => n.id === bond.to);
              if (!nodeA || !nodeB) return null;

              if (bond.type === 'single') {
                return (
                  <motion.line
                    key={`bond_${idx}`}
                    x1={nodeA.x}
                    y1={nodeA.y}
                    x2={nodeB.x}
                    y2={nodeB.y}
                    stroke="url(#bondGrad)"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                );
              }

              if (bond.type === 'double') {
                // Calculate perpendicular offset for double bond
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const len = Math.sqrt(dx * dx + dy * dy) || 1;
                const offsetX = (-dy / len) * 2;
                const offsetY = (dx / len) * 2;

                return (
                  <g key={`bond_${idx}`}>
                    <line
                      x1={nodeA.x + offsetX}
                      y1={nodeA.y + offsetY}
                      x2={nodeB.x + offsetX}
                      y2={nodeB.y + offsetY}
                      stroke="url(#bondGrad)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <line
                      x1={nodeA.x - offsetX}
                      y1={nodeA.y - offsetY}
                      x2={nodeB.x - offsetX}
                      y2={nodeB.y - offsetY}
                      stroke="url(#bondGrad)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </g>
                );
              }

              if (bond.type === 'triple') {
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const len = Math.sqrt(dx * dx + dy * dy) || 1;
                const offsetX = (-dy / len) * 2.8;
                const offsetY = (dx / len) * 2.8;

                return (
                  <g key={`bond_${idx}`}>
                    <line
                      x1={nodeA.x}
                      y1={nodeA.y}
                      x2={nodeB.x}
                      y2={nodeB.y}
                      stroke="url(#bondGrad)"
                      strokeWidth="1.6"
                    />
                    <line
                      x1={nodeA.x + offsetX}
                      y1={nodeA.y + offsetY}
                      x2={nodeB.x + offsetX}
                      y2={nodeB.y + offsetY}
                      stroke="url(#bondGrad)"
                      strokeWidth="1.6"
                    />
                    <line
                      x1={nodeA.x - offsetX}
                      y1={nodeA.y - offsetY}
                      x2={nodeB.x - offsetX}
                      y2={nodeB.y - offsetY}
                      stroke="url(#bondGrad)"
                      strokeWidth="1.6"
                    />
                  </g>
                );
              }

              if (bond.type === 'ionic') {
                return (
                  <motion.line
                    key={`bond_${idx}`}
                    x1={nodeA.x}
                    y1={nodeA.y}
                    x2={nodeB.x}
                    y2={nodeB.y}
                    stroke="url(#ionicGrad)"
                    strokeWidth="2.8"
                    strokeDasharray="3 3"
                    animate={{ strokeDashoffset: [0, -12] }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                );
              }

              return null;
            })}
          </g>

          {/* Render Atoms */}
          <g className="atoms">
            {moleculeData.nodes.map((node) => {
              const elInfo = ELEMENTS[node.symbol];
              const atomColor = elInfo ? elInfo.color : '#38bdf8';
              const radius = node.size / 2.4;

              return (
                <motion.g
                  key={node.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 14, stiffness: 200 }}
                >
                  {/* Outer glow aura */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius + 3.5}
                    fill={atomColor}
                    opacity="0.35"
                    filter="url(#glow)"
                  />

                  {/* Main Atom sphere */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={radius}
                    fill={atomColor}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* 3D highlight shine on atom */}
                  <ellipse
                    cx={node.x - radius * 0.3}
                    cy={node.y - radius * 0.3}
                    rx={radius * 0.4}
                    ry={radius * 0.25}
                    fill="#ffffff"
                    opacity="0.65"
                    transform={`rotate(-25 ${node.x - radius * 0.3} ${node.y - radius * 0.3})`}
                  />

                  {/* Atom Symbol Text */}
                  <text
                    x={node.x}
                    y={node.y + radius * 0.35}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={Math.max(7.5, radius * 0.95)}
                    fontWeight="900"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}
                  >
                    {node.symbol}
                  </text>
                </motion.g>
              );
            })}
          </g>
        </svg>
      ) : (
        /* Empty Lab Workbench Placeholder */
        <div className="flex flex-col items-center justify-center text-center text-slate-400 gap-2 select-none">
          <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-sky-400 animate-pulse shadow-md">
            <span className="text-xl font-bold">⚗️</span>
          </div>
          <div>
            <p className="text-xs sm:text-sm font-black text-slate-200">
              Laboratory Chamber Ready
            </p>
            <p className="text-xs text-slate-400 max-w-xs mt-0.5">
              Drag element cards into the slots below to assemble your chemical formula!
            </p>
          </div>
        </div>
      )}

      {/* Chamber Status Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-950/90 backdrop-blur px-3 py-1 rounded-full border border-slate-800 text-[10px] text-slate-300 font-bold shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono uppercase tracking-wider">2D Molecule Sim</span>
      </div>
    </div>
  );
};
