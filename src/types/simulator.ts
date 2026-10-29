import { PlacedDevice, PlacedConnection } from '../App';

export type AppScreen = 
  | 'home' 
  | 'workspace' 
  | 'devices' 
  | 'learn' 
  | 'quizzes' 
  | 'settings' 
  | 'device-detail';

export interface LessonItem {
  id: string;
  number: string;
  titleEn: string;
  titleAr: string;
  duration: string;
  levelEn: 'Beginner' | 'Intermediate' | 'Advanced';
  levelAr: 'مبتدئ' | 'متوسط' | 'متقدم';
  summaryEn: string;
  summaryAr: string;
  keyConceptsEn: string[];
  keyConceptsAr: string[];
  ciscoCommands: string[];
  sampleTopologyId?: string;
  contentEn: {
    overview: string;
    howItWorks: string;
    labExercise: string;
  };
  contentAr: {
    overview: string;
    howItWorks: string;
    labExercise: string;
  };
}

export interface QuizQuestion {
  id: string;
  questionEn: string;
  questionAr: string;
  optionsEn: string[];
  optionsAr: string[];
  correctIndex: number;
  explanationEn: string;
  explanationAr: string;
  ciscoTermTopic: string;
}

export interface SampleTopology {
  id: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  deviceCount: number;
  connectionCount: number;
  category: 'LAN' | 'VLAN' | 'WAN' | 'Server';
  buildDevices: () => { devices: PlacedDevice[]; connections: PlacedConnection[] };
}

export interface CiscoGlossaryEntry {
  term: string;
  pronunciationAr: string;
  layer: 'Layer 1' | 'Layer 2' | 'Layer 3' | 'Layer 4' | 'Layer 7' | 'Management';
  definitionEn: string;
  definitionAr: string;
  exampleCommand?: string;
}
