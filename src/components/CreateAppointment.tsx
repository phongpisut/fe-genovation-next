'use client';

import { cn, stringToTimeSlot } from '@/lib/utils';
import Image from 'next/image';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ResponsiveModal } from './ui/responsiveModal';

import type { DoctorData } from '@/app/api/doctor/appointments/type';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { format, isSameDay, isToday } from 'date-fns';
import { motion } from 'motion/react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { CalendarForm } from './forms/calendar-form';

export default function CreateAppointment({
  children,
  open,
  setOpen,
  data,
}: {
  children?: React.ReactNode;
  open?: boolean;
  data?: DoctorData & {
    patient_id: number;
    patient_name: string;
  };
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const FormSchema = z.object({
    appointment_date: z.date({
      required_error: 'Appointment date is required.',
    }),
    appointment_time: z.string().min(1, 'Appointment time is required.'),
    notes: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const errors = form.formState.errors;

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_id: data?.patient_id,
        doctor_id: data?.id,
        notes: formData.notes,
        timeslot: formData.appointment_time,
        start_date: format(formData.appointment_date, 'yyyy-MM-dd'),
      }),
    })
      .then(() =>
        toast('Appointment created successfully.', { type: 'success' })
      )
      .catch(() => toast('Appointment created failed.', { type: 'error' }))
      .finally(() => window.location.reload());
  };

  const appointment_date = form.watch('appointment_date');
  const selectedTime = form.watch('appointment_time');

  useEffect(() => {
    form.setValue('appointment_time', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointment_date]);

  const timeSlot = useMemo(() => {
    if (appointment_date && data?.schedule.work_hours) {
      return {
        time:
          stringToTimeSlot(
            data.schedule.work_hours,
            isToday(appointment_date) ? format(new Date(), 'HH:mm') : ''
          ) || [],
        filter:
          data?.appointmentData
            ?.filter((appointment) =>
              isSameDay(new Date(appointment.start_date), appointment_date)
            )
            ?.map((appointment) => appointment.timeslot) || [],
      };
    }
    return { time: [], filter: [] };
  }, [appointment_date, data]);

  const onSelectTimeSlot = (time: string) => {
    if (!timeSlot.filter.includes(time)) {
      form.setValue('appointment_time', time);
    }
    form.clearErrors('appointment_time');
  };

  return (
    <div>
      <ResponsiveModal
        title="Create Appointment"
        description="Update your profile information."
        trigger={children || <div />}
        open={open}
        setOpen={setOpen}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid items-start gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0, height: 0 }}
              animate={{ opacity: 1, scale: 1, height: 'auto' }}
              transition={{ delay: 0.5 }}
              className="grid gap-2 relative">
              <Image
                className="rounded-md shadow-sm mx-auto mt-4"
                src={`https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${
                  data?.fullname
                }?radius=30?size=80`}
                alt="pic"
                width={64}
                height={64}
                priority={true}
              />
              <Image
                className="rounded-md m-2 shadow-sm left-1/2 mt-4 top-8 absolute "
                src={`https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${data?.patient_name}?radius=30?size=80`}
                alt="pic"
                width={42}
                height={42}
              />
              <div className="text-center px-2 py-2 mt-3 bg-green-700 rounded-sm text-slate-50">
                {data?.fullname}
                <div className="w-full px-2 py-1 bg-slate-50 text-slate-800 rounded-sm">
                  case : {data?.patient_name}
                </div>
              </div>
            </motion.div>
            <div className="grid gap-2">
              <CalendarForm dayOfWeek={data?.schedule?.work_day} />
            </div>
            <div className="gap-2 gap-y-4 flex flex-wrap justify-center">
              {timeSlot?.time.map((time, index) => (
                <div
                  onClick={() => onSelectTimeSlot(time)}
                  key={index}
                  className={cn(
                    'p-1 text-sm rounded-md cursor-pointer bg-slate-50 shadow-sm hover:scale-105 active:scale-95 transition-all',
                    {
                      'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100':
                        timeSlot.filter.includes(time),
                      'bg-green-800 text-white': selectedTime === time,
                    }
                  )}>
                  {time}
                </div>
              ))}
              {errors.appointment_time && (
                <p className="text-red-500 text-sm">
                  {errors.appointment_time.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Notes</FormLabel>

                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">Create Appointment</Button>
          </form>
        </Form>
      </ResponsiveModal>
    </div>
  );
}
