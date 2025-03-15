'use client';

import type { Data } from '@/app/api/data/type';
import { DoctorData } from '@/app/api/doctor/appointments/type';
import { useConfirm } from '@/components/alert/alert-dialog';
import { Input } from '@/components/ui/input';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { useDebounceValue, useIntersectionObserver } from 'usehooks-ts';
import CreateAppointment from './CreateAppointment';
import DataGridList from './DataGridList';
import DoctorPopup from './DoctorPopup';

type profileData = DoctorData & {
  patient_id: number;
  patient_name: string;
  key: string;
};

const DataGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounceValue(searchTerm, 500);
  const [data, setData] = useState<Data[]>([]);
  const [profileData, setProfileData] = useState<profileData>();
  const [openDialog, setOpenDialog] = useState(false);
  const firstRender = useRef(true);

  const [matchingDoctor, setMatchingDoctor] = useState<Data>();

  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.2,
  });

  const confirmDialog = useConfirm();

  useEffect(() => {
    fetchData(debouncedSearch);
  }, [debouncedSearch]);

  const fetchData = async (query = '') => {
    fetch(`/api/data?search=${query}`)
      .then(async (response) => {
        const result = await response.json();
        setData(result);
      })
      .catch((error) => console.error(error));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    firstRender.current = false;
    const query = event.target.value;
    setSearchTerm(query);
  };

  const onProfileSelected = (data: Data) => {
    document.body.style.cursor = 'wait';
    fetch(`/api/doctor/appointments?id=${matchingDoctor?.id}`)
      .then(async (response) => {
        const result = await response.json();
        const dialogData = {
          ...result.data?.[0],
          ...(result?.appointmentData?.length > 0 && {
            appointmentData: result?.appointmentData,
          }),
          patient_id: data.id,
          patient_name: data.name,
          key: Date.now().toString(),
        };
        setProfileData(dialogData);
        setOpenDialog(true);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => (document.body.style.cursor = 'default'));
  };

  const handleContextSelect = async (data: Data, context: string) => {
    switch (context) {
      case 'select-doctor':
        setMatchingDoctor(data);
        console.log(data);
        break;
      case 'create-appointment':
        onProfileSelected(data);
        break;
      case 'cancel-appointment':
        await confirmDialog({
          title: 'Cancel Appointment',
          body: 'Are you sure you want to cancel this appointment?',
          cancelButton: 'Cancel',
        }).then((confirmed) => {
          if (confirmed) {
            fetch(`/api/appointments?id=${data.id}`, {
              method: 'DELETE',
            })
              .then(() => {
                setData((prev) => prev.filter((item) => item.id !== data.id));
              })
              .catch((error) => console.error(error));
          }
        });

        break;
      case 'edit':
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <CreateAppointment
        key={profileData?.key || 'create-appointment'}
        open={openDialog}
        setOpen={setOpenDialog}
        data={profileData}
      />
      <Input
        id="search"
        ref={ref}
        className="mx-auto max-w-lg md:min-w-lg "
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
      />
      <AnimatePresence>
        {!isIntersecting && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 mx-auto right-0 w-full max-w-lg z-10 p-2 ">
            <Input
              id="mobile-search"
              className="mx-auto w-full bg-slate-50"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search..."
            />
          </motion.div>
        )}
      </AnimatePresence>

      <DoctorPopup
        data={matchingDoctor}
        onClose={() => setMatchingDoctor(undefined)}
        isDialogOpen={openDialog}
      />

      <DataGridList
        data={data}
        firstRender={firstRender}
        handleContextSelect={handleContextSelect}
        isMatching={matchingDoctor?.id ? true : false}
      />
    </div>
  );
};

export default DataGrid;
