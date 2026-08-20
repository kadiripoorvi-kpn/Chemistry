import { DiscoveredCompound } from '../types';

export interface Molecule2DNode {
  id: string;
  symbol: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number;
}

export interface Molecule2DBond {
  from: string;
  to: string;
  type: 'single' | 'double' | 'triple' | 'ionic';
}

export interface MoleculeLayout {
  nodes: Molecule2DNode[];
  bonds: Molecule2DBond[];
}

export const COMPOUNDS_DATABASE: Record<string, DiscoveredCompound & { layout?: MoleculeLayout }> = {
  H: {
    formula: 'H',
    name: 'Hydrogen Atom',
    commonName: 'Atomic Hydrogen',
    category: 'Pure Element',
    atomsSummary: '1 Hydrogen atom',
    description: 'A single hydrogen atom with 1 proton and 1 electron.',
    layout: {
      nodes: [{ id: 'h1', symbol: 'H', x: 50, y: 50, size: 28 }],
      bonds: [],
    },
  },
  O: {
    formula: 'O',
    name: 'Oxygen Atom',
    commonName: 'Atomic Oxygen',
    category: 'Pure Element',
    atomsSummary: '1 Oxygen atom',
    description: 'A highly reactive single oxygen atom looking to form chemical bonds.',
    layout: {
      nodes: [{ id: 'o1', symbol: 'O', x: 50, y: 50, size: 30 }],
      bonds: [],
    },
  },
  C: {
    formula: 'C',
    name: 'Carbon Atom',
    commonName: 'Atomic Carbon',
    category: 'Pure Element',
    atomsSummary: '1 Carbon atom',
    description: 'A versatile atom capable of forming 4 covalent bonds with other elements.',
    layout: {
      nodes: [{ id: 'c1', symbol: 'C', x: 50, y: 50, size: 30 }],
      bonds: [],
    },
  },
  Na: {
    formula: 'Na',
    name: 'Sodium Atom',
    commonName: 'Atomic Sodium',
    category: 'Pure Element',
    atomsSummary: '1 Sodium atom',
    description: 'An alkali metal atom that readily gives up 1 electron to become stable.',
    layout: {
      nodes: [{ id: 'na1', symbol: 'Na', x: 50, y: 50, size: 32 }],
      bonds: [],
    },
  },
  Cl: {
    formula: 'Cl',
    name: 'Chlorine Atom',
    commonName: 'Atomic Chlorine',
    category: 'Pure Element',
    atomsSummary: '1 Chlorine atom',
    description: 'A halogen atom eager to gain 1 electron to complete its outer electron shell.',
    layout: {
      nodes: [{ id: 'cl1', symbol: 'Cl', x: 50, y: 50, size: 30 }],
      bonds: [],
    },
  },
  H2O: {
    formula: 'H2O',
    name: 'Water',
    commonName: 'Water',
    category: 'Vital Liquid',
    atomsSummary: '2 Hydrogen atoms + 1 Oxygen atom',
    description: 'Water covers over 70% of Earth’s surface and makes up about 60% of the human body!',
    layout: {
      nodes: [
        { id: 'o1', symbol: 'O', x: 50, y: 40, size: 34 },
        { id: 'h1', symbol: 'H', x: 30, y: 68, size: 24 },
        { id: 'h2', symbol: 'H', x: 70, y: 68, size: 24 },
      ],
      bonds: [
        { from: 'o1', to: 'h1', type: 'single' },
        { from: 'o1', to: 'h2', type: 'single' },
      ],
    },
  },
  CO2: {
    formula: 'CO2',
    name: 'Carbon Dioxide',
    commonName: 'Carbon Dioxide Gas',
    category: 'Atmospheric Gas',
    atomsSummary: '1 Carbon atom + 2 Oxygen atoms',
    description: 'Humans exhale carbon dioxide, and green plants absorb it during photosynthesis to create oxygen and glucose!',
    layout: {
      nodes: [
        { id: 'o1', symbol: 'O', x: 22, y: 50, size: 30 },
        { id: 'c1', symbol: 'C', x: 50, y: 50, size: 34 },
        { id: 'o2', symbol: 'O', x: 78, y: 50, size: 30 },
      ],
      bonds: [
        { from: 'o1', to: 'c1', type: 'double' },
        { from: 'c1', to: 'o2', type: 'double' },
      ],
    },
  },
  NaCl: {
    formula: 'NaCl',
    name: 'Sodium Chloride',
    commonName: 'Table Salt',
    category: 'Ionic Mineral',
    atomsSummary: '1 Sodium atom + 1 Chlorine atom',
    description: 'Common table salt! Sodium gives an electron to chlorine, forming strong ionic bonds that make square crystal grains.',
    layout: {
      nodes: [
        { id: 'na1', symbol: 'Na', x: 35, y: 50, size: 34 },
        { id: 'cl1', symbol: 'Cl', x: 65, y: 50, size: 34 },
      ],
      bonds: [{ from: 'na1', to: 'cl1', type: 'ionic' }],
    },
  },
  NH3: {
    formula: 'NH3',
    name: 'Ammonia',
    commonName: 'Ammonia Gas',
    category: 'Hydride',
    atomsSummary: '1 Nitrogen atom + 3 Hydrogen atoms',
    description: 'A pungent compound used in agricultural fertilizers and glass cleaning solutions.',
    layout: {
      nodes: [
        { id: 'n1', symbol: 'N', x: 50, y: 38, size: 34 },
        { id: 'h1', symbol: 'H', x: 28, y: 68, size: 22 },
        { id: 'h2', symbol: 'H', x: 50, y: 75, size: 22 },
        { id: 'h3', symbol: 'H', x: 72, y: 68, size: 22 },
      ],
      bonds: [
        { from: 'n1', to: 'h1', type: 'single' },
        { from: 'n1', to: 'h2', type: 'single' },
        { from: 'n1', to: 'h3', type: 'single' },
      ],
    },
  },
  CH4: {
    formula: 'CH4',
    name: 'Methane',
    commonName: 'Natural Gas',
    category: 'Hydrocarbon',
    atomsSummary: '1 Carbon atom + 4 Hydrogen atoms',
    description: 'The primary component of clean-burning natural gas, with a 3D tetrahedral pyramid structure.',
    layout: {
      nodes: [
        { id: 'c1', symbol: 'C', x: 50, y: 50, size: 34 },
        { id: 'h1', symbol: 'H', x: 50, y: 20, size: 22 },
        { id: 'h2', symbol: 'H', x: 22, y: 65, size: 22 },
        { id: 'h3', symbol: 'H', x: 78, y: 65, size: 22 },
        { id: 'h4', symbol: 'H', x: 50, y: 80, size: 22 },
      ],
      bonds: [
        { from: 'c1', to: 'h1', type: 'single' },
        { from: 'c1', to: 'h2', type: 'single' },
        { from: 'c1', to: 'h3', type: 'single' },
        { from: 'c1', to: 'h4', type: 'single' },
      ],
    },
  },
  H2S: {
    formula: 'H2S',
    name: 'Hydrogen Sulfide',
    commonName: 'Sewer / Volcanic Gas',
    category: 'Hydride',
    atomsSummary: '2 Hydrogen atoms + 1 Sulfur atom',
    description: 'A gas famous for smelling like rotten eggs, often found near active geothermal springs and hot vents.',
    layout: {
      nodes: [
        { id: 's1', symbol: 'S', x: 50, y: 40, size: 36 },
        { id: 'h1', symbol: 'H', x: 30, y: 68, size: 24 },
        { id: 'h2', symbol: 'H', x: 70, y: 68, size: 24 },
      ],
      bonds: [
        { from: 's1', to: 'h1', type: 'single' },
        { from: 's1', to: 'h2', type: 'single' },
      ],
    },
  },
  MgO: {
    formula: 'MgO',
    name: 'Magnesium Oxide',
    commonName: 'Magnesia',
    category: 'Metal Oxide',
    atomsSummary: '1 Magnesium atom + 1 Oxygen atom',
    description: 'A white mineral powder used by gymnasts and rock climbers to absorb sweat and improve grip!',
    layout: {
      nodes: [
        { id: 'mg1', symbol: 'Mg', x: 36, y: 50, size: 34 },
        { id: 'o1', symbol: 'O', x: 64, y: 50, size: 32 },
      ],
      bonds: [{ from: 'mg1', to: 'o1', type: 'ionic' }],
    },
  },
  CaO: {
    formula: 'CaO',
    name: 'Calcium Oxide',
    commonName: 'Quicklime',
    category: 'Metal Oxide',
    atomsSummary: '1 Calcium atom + 1 Oxygen atom',
    description: 'An ancient building material compound used to produce mortar, plaster, and glass since Roman times.',
    layout: {
      nodes: [
        { id: 'ca1', symbol: 'Ca', x: 36, y: 50, size: 34 },
        { id: 'o1', symbol: 'O', x: 64, y: 50, size: 32 },
      ],
      bonds: [{ from: 'ca1', to: 'o1', type: 'ionic' }],
    },
  },
  H2SO4: {
    formula: 'H2SO4',
    name: 'Sulfuric Acid',
    commonName: 'Battery Acid',
    category: 'Mineral Acid',
    atomsSummary: '2 Hydrogen + 1 Sulfur + 4 Oxygen atoms',
    description: 'One of the most important industrial chemicals in the world! Used in car batteries and fertilizer production.',
    layout: {
      nodes: [
        { id: 's1', symbol: 'S', x: 50, y: 50, size: 36 },
        { id: 'o1', symbol: 'O', x: 50, y: 22, size: 28 },
        { id: 'o2', symbol: 'O', x: 50, y: 78, size: 28 },
        { id: 'o3', symbol: 'O', x: 26, y: 50, size: 28 },
        { id: 'o4', symbol: 'O', x: 74, y: 50, size: 28 },
        { id: 'h1', symbol: 'H', x: 12, y: 50, size: 20 },
        { id: 'h2', symbol: 'H', x: 88, y: 50, size: 20 },
      ],
      bonds: [
        { from: 's1', to: 'o1', type: 'double' },
        { from: 's1', to: 'o2', type: 'double' },
        { from: 's1', to: 'o3', type: 'single' },
        { from: 's1', to: 'o4', type: 'single' },
        { from: 'o3', to: 'h1', type: 'single' },
        { from: 'o4', to: 'h2', type: 'single' },
      ],
    },
  },
  HNO3: {
    formula: 'HNO3',
    name: 'Nitric Acid',
    commonName: 'Aqua Fortis',
    category: 'Mineral Acid',
    atomsSummary: '1 Hydrogen + 1 Nitrogen + 3 Oxygen atoms',
    description: 'A powerful oxidizing acid used in jewelry testing to verify real gold.',
    layout: {
      nodes: [
        { id: 'n1', symbol: 'N', x: 48, y: 48, size: 34 },
        { id: 'o1', symbol: 'O', x: 48, y: 20, size: 28 },
        { id: 'o2', symbol: 'O', x: 74, y: 62, size: 28 },
        { id: 'o3', symbol: 'O', x: 24, y: 62, size: 28 },
        { id: 'h1', symbol: 'H', x: 12, y: 80, size: 20 },
      ],
      bonds: [
        { from: 'n1', to: 'o1', type: 'double' },
        { from: 'n1', to: 'o2', type: 'single' },
        { from: 'n1', to: 'o3', type: 'single' },
        { from: 'o3', to: 'h1', type: 'single' },
      ],
    },
  },
  CaCO3: {
    formula: 'CaCO3',
    name: 'Calcium Carbonate',
    commonName: 'Chalk / Limestone',
    category: 'Inorganic Carbonate',
    atomsSummary: '1 Calcium + 1 Carbon + 3 Oxygen atoms',
    description: 'The main component of eggshells, sea shells, chalk, coral reefs, and marble monuments!',
    layout: {
      nodes: [
        { id: 'ca1', symbol: 'Ca', x: 25, y: 35, size: 32 },
        { id: 'c1', symbol: 'C', x: 60, y: 50, size: 32 },
        { id: 'o1', symbol: 'O', x: 60, y: 22, size: 26 },
        { id: 'o2', symbol: 'O', x: 40, y: 72, size: 26 },
        { id: 'o3', symbol: 'O', x: 80, y: 72, size: 26 },
      ],
      bonds: [
        { from: 'c1', to: 'o1', type: 'double' },
        { from: 'c1', to: 'o2', type: 'single' },
        { from: 'c1', to: 'o3', type: 'single' },
        { from: 'ca1', to: 'c1', type: 'ionic' },
      ],
    },
  },
  C6H12O6: {
    formula: 'C6H12O6',
    name: 'Glucose',
    commonName: 'Blood Sugar / Plant Sugar',
    category: 'Carbohydrate',
    atomsSummary: '6 Carbon + 12 Hydrogen + 6 Oxygen atoms',
    description: 'The primary energy fuel for your brain and muscles! Created by plants using sunlight during photosynthesis.',
    layout: {
      nodes: [
        { id: 'c1', symbol: 'C', x: 35, y: 35, size: 26 },
        { id: 'c2', symbol: 'C', x: 55, y: 28, size: 26 },
        { id: 'c3', symbol: 'C', x: 70, y: 45, size: 26 },
        { id: 'c4', symbol: 'C', x: 65, y: 68, size: 26 },
        { id: 'c5', symbol: 'C', x: 45, y: 75, size: 26 },
        { id: 'o_ring', symbol: 'O', x: 30, y: 55, size: 26 },
        { id: 'o1', symbol: 'O', x: 20, y: 25, size: 22 },
        { id: 'o2', symbol: 'O', x: 85, y: 38, size: 22 },
        { id: 'o3', symbol: 'O', x: 80, y: 82, size: 22 },
        { id: 'o4', symbol: 'O', x: 40, y: 92, size: 22 },
        { id: 'c6', symbol: 'C', x: 60, y: 12, size: 22 },
        { id: 'o6', symbol: 'O', x: 75, y: 12, size: 20 },
      ],
      bonds: [
        { from: 'c1', to: 'c2', type: 'single' },
        { from: 'c2', to: 'c3', type: 'single' },
        { from: 'c3', to: 'c4', type: 'single' },
        { from: 'c4', to: 'c5', type: 'single' },
        { from: 'c5', to: 'o_ring', type: 'single' },
        { from: 'o_ring', to: 'c1', type: 'single' },
        { from: 'c1', to: 'o1', type: 'single' },
        { from: 'c3', to: 'o2', type: 'single' },
        { from: 'c4', to: 'o3', type: 'single' },
        { from: 'c5', to: 'o4', type: 'single' },
        { from: 'c2', to: 'c6', type: 'single' },
        { from: 'c6', to: 'o6', type: 'single' },
      ],
    },
  },
  NaHCO3: {
    formula: 'NaHCO3',
    name: 'Sodium Bicarbonate',
    commonName: 'Baking Soda',
    category: 'Salt Compound',
    atomsSummary: '1 Sodium + 1 Hydrogen + 1 Carbon + 3 Oxygen atoms',
    description: 'Baking soda! Reacts with vinegar or lemon juice to create bubbly carbon dioxide gas that makes cakes rise.',
    layout: {
      nodes: [
        { id: 'na1', symbol: 'Na', x: 20, y: 40, size: 30 },
        { id: 'c1', symbol: 'C', x: 50, y: 50, size: 32 },
        { id: 'o1', symbol: 'O', x: 50, y: 22, size: 26 },
        { id: 'o2', symbol: 'O', x: 75, y: 45, size: 26 },
        { id: 'o3', symbol: 'O', x: 42, y: 78, size: 26 },
        { id: 'h1', symbol: 'H', x: 88, y: 60, size: 20 },
      ],
      bonds: [
        { from: 'c1', to: 'o1', type: 'double' },
        { from: 'c1', to: 'o2', type: 'single' },
        { from: 'c1', to: 'o3', type: 'single' },
        { from: 'o2', to: 'h1', type: 'single' },
        { from: 'na1', to: 'c1', type: 'ionic' },
      ],
    },
  },
  HCl: {
    formula: 'HCl',
    name: 'Hydrochloric Acid',
    commonName: 'Stomach Acid',
    category: 'Mineral Acid',
    atomsSummary: '1 Hydrogen atom + 1 Chlorine atom',
    description: 'Found naturally in your stomach to help break down food and kill harmful bacteria!',
    layout: {
      nodes: [
        { id: 'h1', symbol: 'H', x: 35, y: 50, size: 26 },
        { id: 'cl1', symbol: 'Cl', x: 65, y: 50, size: 34 },
      ],
      bonds: [{ from: 'h1', to: 'cl1', type: 'single' }],
    },
  },
  O2: {
    formula: 'O2',
    name: 'Diatomic Oxygen',
    commonName: 'Oxygen Gas',
    category: 'Atmospheric Gas',
    atomsSummary: '2 Oxygen atoms',
    description: 'The molecular form of oxygen that we breathe every second of every day.',
    layout: {
      nodes: [
        { id: 'o1', symbol: 'O', x: 38, y: 50, size: 32 },
        { id: 'o2', symbol: 'O', x: 62, y: 50, size: 32 },
      ],
      bonds: [{ from: 'o1', to: 'o2', type: 'double' }],
    },
  },
  N2: {
    formula: 'N2',
    name: 'Diatomic Nitrogen',
    commonName: 'Nitrogen Gas',
    category: 'Atmospheric Gas',
    atomsSummary: '2 Nitrogen atoms',
    description: 'Held together by a super-strong triple bond, making it very stable and non-reactive.',
    layout: {
      nodes: [
        { id: 'n1', symbol: 'N', x: 38, y: 50, size: 32 },
        { id: 'n2', symbol: 'N', x: 62, y: 50, size: 32 },
      ],
      bonds: [{ from: 'n1', to: 'n2', type: 'triple' }],
    },
  },
  H2O2: {
    formula: 'H2O2',
    name: 'Hydrogen Peroxide',
    commonName: 'Antiseptic Solution',
    category: 'Peroxide',
    atomsSummary: '2 Hydrogen atoms + 2 Oxygen atoms',
    description: 'An unstable compound that breaks down into water and oxygen bubbles, used to clean small cuts.',
    layout: {
      nodes: [
        { id: 'h1', symbol: 'H', x: 20, y: 40, size: 22 },
        { id: 'o1', symbol: 'O', x: 40, y: 55, size: 30 },
        { id: 'o2', symbol: 'O', x: 60, y: 45, size: 30 },
        { id: 'h2', symbol: 'H', x: 80, y: 60, size: 22 },
      ],
      bonds: [
        { from: 'h1', to: 'o1', type: 'single' },
        { from: 'o1', to: 'o2', type: 'single' },
        { from: 'o2', to: 'h2', type: 'single' },
      ],
    },
  },
};
