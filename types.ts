
export enum ConstitutionType {
  PEACEFUL = '平和质',
  QI_DEFICIENCY = '气虚质',
  YANG_DEFICIENCY = '阳虚质',
  YIN_DEFICIENCY = '阴虚质',
  PHLEGM_DAMPNESS = '痰湿质',
  DAMP_HEAT = '湿热质',
  BLOOD_STASIS = '血瘀质',
  QI_STAGNATION = '气郁质',
  SPECIAL = '特禀质'
}

export interface ConstitutionDetail {
  type: ConstitutionType;
  description: string;
  features: string[];
  exercise: string;
  diet: string;
  emotion: string;
}

export interface Question {
  id: number;
  text: string;
  category: ConstitutionType;
}

export interface ScoreMap {
  [key: string]: number;
}

export interface AIAnalysisResult {
  constitution: ConstitutionType;
  confidence: number;
  reasoning: string;
  keyFeatures: string[];
}
