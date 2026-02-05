export interface DiseaseAnalysis {
  diseaseName: string;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  treatment: string[];
}

export interface ChatMessage {
  id: string | number;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}