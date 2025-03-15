export interface Schedule {
	work_day: string[];
	work_hours: string;
}

export interface AppointmentData {
	id: number;
	doctor_id: number;
	patient_id: number;
	notes?: string;
	start_date: string;
	created_at: string;
	updated_at: string;
	deleted_at?: string;
	timeslot: string;
}

export interface DoctorData {
	id: number;
	created_at: string;
	fullname: string;
	notes?: string;
	specialty: string;
	schedule: Schedule;
	appointmentData: AppointmentData[];
}