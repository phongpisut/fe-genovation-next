'use client';

import type { Data } from '@/app/api/data/type';

import type { CreateAppointmentData } from '@/app/api/doctor/appointments/type';
import type { DoctorData } from '@/app/api/doctor/type';
import type { PatientData } from '@/app/api/patient/type';
import { useConfirm } from '@/components/alert/alert-dialog';
import { Input } from '@/components/ui/input';
import { useLoading } from '@/context/LoadingContext';
import axios from 'axios';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useDebounceValue, useIntersectionObserver } from 'usehooks-ts';
import AddOrEditProfile from './AddOrEditProfile';
import CreateAppointment from './CreateAppointment';
import DataGridList from './DataGridList';
import DoctorPopup from './DoctorPopup';
import FilterGroup from './FilterGroup';

type ProfileData = DoctorData | PatientData;

const Main = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounceValue(searchTerm, 500);

  const [data, setData] = useState<Data[]>([]);
  const [appointmentData, setAppointmentData] =
    useState<CreateAppointmentData>();
  const [profileData, setProfileData] = useState<ProfileData>();

  const [openDialog, setOpenDialog] = useState(false);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [matchingDoctor, setMatchingDoctor] = useState<Data>();

  const firstRender = useRef(true);
  const filter = useRef('doc-pat-ap');
  const dateRange = useRef<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.2,
  });

  const confirmDialog = useConfirm();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    fetchData(debouncedSearch, filter.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const fetchData = async (
    query?: string,
    newFilter?: string,
    newDateRange?: DateRange
  ) => {
    setIsLoading(true);
    axios
      .post(
        '/api/data',
        {
          dateRange: newDateRange || dateRange.current,
        },
        {
          params: {
            search: query || debouncedSearch,
            filter: newFilter || filter.current,
          },
        }
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
    filter.current = newFilter;
    fetchData(undefined, newFilter);
  };

  const handleDateRangeChange = (date?: DateRange) => {
    dateRange.current = date;
    fetchData(undefined, undefined, date);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    firstRender.current = false;
    const query = event.target.value;
    setSearchTerm(query);
  };

  const onCreateAppointment = (data: Data) => {
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
        setAppointmentData(dialogData);
        setOpenDialog(true);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  const onEditProfile = async (data: Data) => {
    setIsLoading(true);
    axios
      .get(`/api/${data.source}`, {
        params: {
          id: data.id,
        },
      })
      .then(async (response) => {
        const result = response.data[0];
        setProfileData(result);
        setOpenProfileDialog(true);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  const handleContextSelect = async (data: Data | '', context: string) => {
    if (data) {
      switch (context) {
        case 'select-doctor':
          setMatchingDoctor(data);
          console.log(data);
          break;
        case 'create-appointment':
          onCreateAppointment(data);
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
                  setData((prev) =>
                    prev.filter(
                      (item) =>
                        item.id !== data.id && data.source == 'appointment'
                    )
                  );
                })
                .catch((error) => console.error(error));
            }
          });

          break;
        case 'edit':
          onEditProfile(data);
          break;
        default:
          break;
      }
    } else {
      if (context === 'create-profile') {
        setOpenProfileDialog(true);
      }
    }
  };

  return (
    <div>
      <CreateAppointment
        key={appointmentData?.key || 'create-appointment'}
        open={openDialog}
        setOpen={setOpenDialog}
        data={appointmentData}
      />
      <AddOrEditProfile
        open={openProfileDialog}
        setOpen={() => {
          setOpenProfileDialog(false);
          setProfileData(undefined);
        }}
        data={profileData}
        key={new Date().toString()}
      />

      <div className="grid md:min-w-lg gap-y-2 max-w-lg mx-auto ">
        <FilterGroup
          onChangeFilter={handleChangeFilter}
          onDateRangeChange={handleDateRangeChange}
        />
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

export default Main;
