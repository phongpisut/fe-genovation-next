export interface Schedule {
  work_day: string[];
  work_hours: string;
}

export interface DoctorData {
  id: number;
  created_at: string;
  fullname: string;
  notes?: string;
  specialty: string;
  schedule: Schedule;
}
