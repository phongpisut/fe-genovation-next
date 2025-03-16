export interface Schedule {
  work_day: string[];
  work_hours: string;
}

export interface Data {
  source: 'appointment' | 'doctor' | 'patient';
  id: number;
  name: string;
  start_date?: string;
  specialty: string;
  notes?: string;
  timeslot?: string;
  schedule: Schedule;
  doctor_name?: string;
  patient_name?: string;
  tel?: string;
}
