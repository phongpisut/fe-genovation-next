
import { createStore } from "zustand/vanilla";

export type DoctorState = {
  doctor_id?: number;
  doctor_fullname?: string;
  doctor_specialty?: string;
};

export type DoctorActions = {
  setDoctor: (doctor : DoctorState) => void;
  removeDoctor: () => void;
};

export type DoctorStore = DoctorState & DoctorActions;

export const initDoctorStore = (): DoctorState => {
  return { };
};

export const defaultInitState: DoctorState = {};

export const createDoctorStore = (
  initState: DoctorState = defaultInitState
) => {
  return createStore<DoctorStore>()((set) => ({
    ...initState,
    setDoctor: (doctor) => set(() => ({ ...doctor })),
    removeDoctor: () => set(() => ({ })),
  }));
};
