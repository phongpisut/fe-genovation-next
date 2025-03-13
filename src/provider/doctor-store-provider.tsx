'use client';

import { type ReactNode, createContext, useContext, useState } from 'react';
import { useStore } from 'zustand';

import { createDoctorStore, initDoctorStore } from '@/stores/doctor-store';

export const DoctorStoreContext = createContext<ReturnType<
  typeof createDoctorStore
> | null>(null);

export interface DoctorStoreContextProviderProps {
  children: ReactNode;
}

export const DoctorStoreProvider = ({
  children,
}: DoctorStoreContextProviderProps) => {
  const [doctorStore] = useState(() => createDoctorStore(initDoctorStore()));

  return (
    <DoctorStoreContext.Provider value={doctorStore}>
      {children}
    </DoctorStoreContext.Provider>
  );
};

export const useDoctorStore = <T,>(
  selector: (
    state: ReturnType<ReturnType<typeof createDoctorStore>['getState']>
  ) => T
) => {
  const doctorStoreContext = useContext(DoctorStoreContext);

  if (!doctorStoreContext) {
    throw new Error('useDoctorStore must be used within DoctorStoreProvider');
  }

  return useStore(doctorStoreContext, selector);
};
