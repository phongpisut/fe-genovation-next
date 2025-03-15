'use client';

import type { Data } from '@/app/api/data/type';
import { DoctorData } from '@/app/api/doctor/appointments/type';
import { useConfirm } from '@/components/alert/alert-dialog';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { useDebounceValue, useIntersectionObserver } from 'usehooks-ts';
import CreateAppointment from './CreateAppointment';
import DataGridList from './DataGridList';
import DoctorPopup from './DoctorPopup';
import FilterGroup from './FilterGroup';
import { useLoading } from '@/context/LoadingContext';

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
  const filter = useRef('doc-pat-ap');

  const [matchingDoctor, setMatchingDoctor] = useState<Data>();

  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.2,
  });

  const confirmDialog = useConfirm();

  const { setIsLoading } = useLoading();

  useEffect(() => {
    fetchData(debouncedSearch,filter.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const fetchData = async (
    query = '',
    newFilter = 'doc-pat-ap',
    dateRange = ''
  ) => {
    setIsLoading(true);
    axios
      .post(
        '/api/data',
        {
          ...(dateRange && { dateRange: dateRange.split('-') }),
        },
        { params: { search: query, filter: newFilter } }
      )
      .then(async (response) => {
        setData(response.data);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChangeFilter = (newFilter: string) => {
    fetchData(debouncedSearch, newFilter);
    filter.current = newFilter;
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    firstRender.current = false;
    const query = event.target.value;
    setSearchTerm(query);
  };

  const onProfileSelected = (data: Data) => {
    setIsLoading(true);
    axios
      .get('/api/doctor/appointments', {
        params: {
          id: matchingDoctor?.id,
        },
      })
      .then(async (response) => {
        const result = response.data;
        const dialogData = {
          ...result?.doctorData?.[0],
          ...(result?.appointmentData?.length > 0 && {
            appointmentData: result?.appointmentData,
          }),
          patient_id: data.id,
          patient_name: data.name,
          key: Date.now().toString(),
        };
        console.log(dialogData);
        setProfileData(dialogData);
        setOpenDialog(true);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
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
            axios
              .delete('/api/appointments', {
                params: {
                  id: data.id,
                },
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
        key={profileData?.key ||'create-appointment'}
        open={openDialog}
        setOpen={setOpenDialog}
        data={profileData}
      />

      <div className="mx-auto max-w-lg md:min-w-lg">
        <div className="flex mb-2 text-center items-center">
          <FilterGroup onChangeFilter={handleChangeFilter} />
        </div>
        <Input
          id="search"
          ref={ref}
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search..."
          className="bg-slate-50"
        />
      </div>
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
