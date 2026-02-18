export interface TrainingRequirement {
  equipmentCategory: string;
  durationDays: string;
  components: string[];
  certifications: string[];
}

export interface EquipmentItem {
  id: string;
  name: string;
  description?: string;
  training?: TrainingRequirement;
  safety?: string[];
}

export interface EquipmentCategory {
  id: string;
  title: string;
  description?: string;
  equipment: EquipmentItem[];
}

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const BEUMER_EQUIPMENT_CATALOG: EquipmentCategory[] = [
  {
    id: 'baggage-handling-systems',
    title: 'Baggage Handling Systems',
    equipment: [
      'BEUMER autover® Independent Carrier System',
      'CrisBag® Independent Carrier System',
      'CrisBag® Self Bag Drop',
      'CrisBelt® Conveyor System',
      'CrisCheck® Check-In Conveyor',
      'CrisClaim® Baggage Carousels',
      'CrisStore® Dynamic Racking Solution',
      'Tilt-Tray Loop Sortation System',
      'Automated Container Unloader',
      'Baggage Loader',
      'Baggage Manipulator',
      'Baggage Unloader',
      'Airport Software Suite (control systems)',
    ].map((name) => ({
      id: slugify(name),
      name,
    })),
  },
  {
    id: 'logistics-systems',
    title: 'Logistics Systems',
    equipment: [
      'BG Sorter® CB Cross-Belt',
      'BG Sorter® ET Tilt-Tray',
      'BG Line Sorter',
      'BG Pouch System',
      'BG Parcel Belt Conveyor',
      'Automatic Parcel Singulator',
      'BEUMER Tipping Station',
      'Warehouse Control System (WCS)',
      'CEP Software Suite',
    ].map((name) => ({
      id: slugify(name),
      name,
    })),
  },
  {
    id: 'conveying-technology',
    title: 'Conveying Technology',
    equipment: [
      'Troughed Belt Conveyors',
      'Overland Belt Conveyors',
      'Pipe Conveyors',
      'Air-supported Belt Conveyors',
      'Mobile Conveyors',
      'U-Shape Conveyors',
      'Apron Conveyors',
      'Bucket Elevators',
      'Screw Conveyors',
      'Drive Stations',
      'Shifting Heads',
      'Tripper Cars',
      'Hopper Cars',
      'Feeding Hoppers',
      'Components (pulleys, belts, idlers)',
      'Conveyor Systems for Alternative Fuels (AFR)',
    ].map((name) => ({
      id: slugify(name),
      name,
    })),
  },
  {
    id: 'specialized-systems',
    title: 'Specialized Systems',
    equipment: [
      'Opencast Mining Systems',
      'Stockyard Systems',
      'Mineral Processing Equipment',
      'Port Technology Systems',
      'Loading & Unloading Systems',
    ].map((name) => ({
      id: slugify(name),
      name,
    })),
  },
  {
    id: 'end-of-line-packaging',
    title: 'End-of-Line Packaging Systems',
    equipment: [
      'Palletising Technology (BEUMER paletpac®)',
      'Packaging Technology',
      'Filling Technology (BEUMER fillpac®)',
      'BEUMER stretch hood® (pallet wrapping)',
    ].map((name) => ({
      id: slugify(name),
      name,
    })),
  },
];

export const TRAINING_REQUIREMENTS: TrainingRequirement[] = [
  {
    equipmentCategory: 'Baggage Conveyor Systems',
    durationDays: '3-5 days',
    components: [
      'System overview and components',
      'Start-up and shutdown procedures',
      'Basic troubleshooting',
      'Emergency stop protocols',
      'Software interface training',
    ],
    certifications: ['Airport operations certification', 'Manufacturer certification'],
  },
  {
    equipmentCategory: 'Independent Carrier Systems',
    durationDays: '5-7 days',
    components: [
      'Control software operation',
      'Carrier routing and tracking',
      'Maintenance procedures',
      'Fault diagnosis',
      'System integration',
    ],
    certifications: ['Airport operations certification', 'Manufacturer certification'],
  },
  {
    equipmentCategory: 'Self Bag Drop/Check-In',
    durationDays: '2-3 days',
    components: [
      'User interface operation',
      'Passenger assistance procedures',
      'System monitoring',
      'Basic maintenance',
      'Security protocols',
    ],
    certifications: ['Airport operations certification'],
  },
  {
    equipmentCategory: 'Automated Loaders/Unloaders',
    durationDays: '4-6 days',
    components: [
      'Equipment operation',
      'Safety systems',
      'Container handling procedures',
      'Emergency procedures',
      'Preventive maintenance',
    ],
    certifications: ['Airport operations certification'],
  },
  {
    equipmentCategory: 'Cross-Belt/Tilt-Tray Sorters',
    durationDays: '5-10 days',
    components: [
      'System architecture',
      'Control system operation',
      'Induction procedures',
      'Sorting algorithms',
      'Performance optimization',
      'Advanced troubleshooting',
    ],
    certifications: ['Warehouse operations certification', 'WCS operator certification'],
  },
  {
    equipmentCategory: 'Parcel Conveyors',
    durationDays: '2-4 days',
    components: [
      'Conveyor operation',
      'Speed control',
      'Jam clearance procedures',
      'Basic maintenance',
      'Safety protocols',
    ],
    certifications: ['Warehouse operations certification'],
  },
  {
    equipmentCategory: 'Pouch Systems',
    durationDays: '3-5 days',
    components: [
      'Pouch handling',
      'Loading/unloading procedures',
      'System monitoring',
      'Maintenance routines',
    ],
    certifications: ['Warehouse operations certification'],
  },
  {
    equipmentCategory: 'Warehouse Control Systems',
    durationDays: '5-10 days',
    components: [
      'Software operation',
      'Order fulfillment processes',
      'Material flow control',
      'Business intelligence tools',
      'System integration',
    ],
    certifications: ['WCS operator certification'],
  },
  {
    equipmentCategory: 'Belt Conveyors (Overland/Troughed)',
    durationDays: '5-10 days',
    components: [
      'Belt tracking and tensioning',
      'Splicing techniques',
      'Drive system operation',
      'Safety systems',
      'Lubrication schedules',
      'Inspection procedures',
    ],
    certifications: [
      'Heavy equipment operator license',
      'Conveyor belt splicing certification',
      'Elevated work platform certification',
    ],
  },
  {
    equipmentCategory: 'Bucket Elevators',
    durationDays: '3-5 days',
    components: [
      'Operating procedures',
      'Bucket inspection',
      'Chain/belt maintenance',
      'Alignment procedures',
      'Emergency protocols',
    ],
    certifications: [
      'Heavy equipment operator license',
      'Conveyor belt splicing certification',
    ],
  },
  {
    equipmentCategory: 'Pipe Conveyors',
    durationDays: '5-7 days',
    components: [
      'Curved conveying principles',
      'Belt closure systems',
      'Specialized maintenance',
      'Troubleshooting',
    ],
    certifications: [
      'Heavy equipment operator license',
      'Conveyor belt splicing certification',
    ],
  },
  {
    equipmentCategory: 'Mobile Conveyors',
    durationDays: '2-4 days',
    components: [
      'Equipment mobilization',
      'Setup procedures',
      'Operating controls',
      'Transport safety',
    ],
    certifications: ['Heavy equipment operator license'],
  },
  {
    equipmentCategory: 'Tripper Cars/Shifting Heads',
    durationDays: '3-5 days',
    components: [
      'Positioning systems',
      'Remote operation',
      'Material distribution',
      'Track maintenance',
    ],
    certifications: ['Heavy equipment operator license'],
  },
  {
    equipmentCategory: 'Robotic Palletisers',
    durationDays: '5-7 days',
    components: [
      'Robot programming basics',
      'Pattern creation',
      'Safety zone configuration',
      'Tool changing',
      'Troubleshooting',
    ],
    certifications: ['Robot safety certification', 'Lock-out/Tag-out certification'],
  },
  {
    equipmentCategory: 'Layer Palletisers',
    durationDays: '3-5 days',
    components: [
      'Layer formation',
      'Pallet handling',
      'Product changeover',
      'Maintenance procedures',
    ],
    certifications: ['Lock-out/Tag-out certification'],
  },
  {
    equipmentCategory: 'Stretch Hood Systems',
    durationDays: '3-5 days',
    components: [
      'Film loading',
      'Hood application',
      'Film parameter adjustment',
      'Sealing systems',
      'Maintenance',
    ],
    certifications: ['Lock-out/Tag-out certification'],
  },
  {
    equipmentCategory: 'Filling Systems',
    durationDays: '4-6 days',
    components: [
      'Product handling',
      'Weighing systems',
      'Bag/container filling',
      'Dust control',
      'Calibration procedures',
    ],
    certifications: ['Lock-out/Tag-out certification', 'Product handling certification'],
  },
];
