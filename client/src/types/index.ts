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

export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  frequency: string; // e.g. "1-0-1 (सुबह - रात)"
  duration: string; // e.g. "15 Days"
  instructions?: string;
}

export interface PrescriptionSlip {
  id: string;
  date: string;
  doctorName: string;
  facilityName: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  investigations: string[];
  imageUrl?: string;
  notes?: string;
}

export interface LabParameter {
  parameter: string;
  value: string;
  normalRange: string;
  isAbnormal?: boolean;
  unit?: string;
}

export interface LabReport {
  id: string;
  date: string;
  testName: string;
  category: 'BLOOD' | 'IMAGING' | 'CARDIAC' | 'URINE' | 'OTHER';
  facilityName: string;
  summaryStatus: 'NORMAL' | 'ATTENTION' | 'CRITICAL';
  keyValues: LabParameter[];
  imageUrl?: string;
  doctorRemarks?: string;
}

export interface CheckupSchedule {
  id: string;
  date: string;
  title: string;
  facilityOrAsha: string;
  status: 'UPCOMING' | 'COMPLETED' | 'OVERDUE';
  notes: string;
  type: 'ASHA_HOME_VISIT' | 'PHC_VISIT' | 'SPECIALIST_CLINIC';
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: 'Self' | 'Mother' | 'Father' | 'Spouse' | 'Child' | 'Other';
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  abhaId: string;
  village: string;
  chronicConditions: string[];
  prescriptions: PrescriptionSlip[];
  labReports: LabReport[];
  checkups: CheckupSchedule[];
}
