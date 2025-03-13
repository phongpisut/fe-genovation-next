'use client';

import type { Data } from '@/app/api/data/type';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import { useDebounceValue, useIntersectionObserver } from 'usehooks-ts';
import CreateAppointment from './CreateAppointment';
import DataGridList from './DataGridList';
import { Input } from './ui/input';

const DataGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounceValue(searchTerm, 500);
  const [data, setData] = useState<Data[]>([]);
  const [profileData, setProfileData] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const firstRender = useRef(true);

  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 0.2,
  });

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

  const onProfileSelected = (role: string, id: number) => {
    if (role === 'doctor') {
      fetch(`/api/doctor?id=${id}`)
        .then(async (response) => {
          const result = await response.json();
          const doctorData = {
            ...result.data?.[0],
            ...(result?.appointmentData?.length > 0 && {
              appointmentData: result?.appointmentData,
            }),
          };
          console.log(doctorData);
          setProfileData(doctorData);
          setOpenDialog(true);
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div>
      <CreateAppointment
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
            className="fixed top-0 left-0 w-full sm:hidden z-10 p-2 "
          >
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

      <DataGridList
        data={data}
        firstRender={firstRender}
        handleClick={onProfileSelected}
      />
    </div>
  );
};

export default DataGrid;
