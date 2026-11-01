export type Severity = 'RED' | 'AMBER' | 'GREEN';

export interface Vitals {
  bp: string;
  pulse: string;
  spo2: string;
  temp?: string;
}

export interface CareBundle {
  consultation: string;
  diagnosticSlots: string[];
  transitToken: string;
}

export interface Facility {
  id: string;
  name: string;
  tier: string;
  distanceKm: number;
  driveTimeMin: number;
  icuBedsTotal: number;
  icuBedsOccupied: number;
  doctorOnDuty: boolean;
  specialists: string[];
  diagnostics: {
    ecg: { status: string; uptime: number };
    xray: { status: string; uptime: number };
    ctScan: { status: string; uptime: number };
    bloodBank: { status: string; oNegativeUnits: number };
  };
  readinessScore: number;
  status: string;
}

export interface ReferralTimeline {
  stage: string;
  time: string;
  note: string;
}

export interface CounterReferral {
  assignedAsha: string;
  dischargeDate: string;
  followUpDate: string;
  prescribedCare: string;
  incentiveStatus: string;
}

export interface Referral {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  village: string;
  ashaWorker: string;
  presentingSymptoms: string;
  vernacularText?: string;
  vitals: Vitals;
  cdssSeverity: Severity;
  suspectedCondition: string;
  requiredSpecialty: string;
  careBundle: CareBundle;
  destinationFacilityId: string;
  status: 'ACCEPTED' | 'EN_ROUTE' | 'ARRIVED' | 'TREATED' | 'DISCHARGED';
  timeline: ReferralTimeline[];
  qrToken: string;
  isRerouted?: boolean;
  counterReferral?: CounterReferral;
}
