'use client';

import { cn, stringToTimeSlot } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ResponsiveModal } from './ui/responsiveModal';

import type { DoctorData } from '@/app/api/doctor/type';
import { Form } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { format, isSameDay, isToday } from 'date-fns';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CalendarForm } from './forms/CalendarForm';

export default function CreateAppointment({
  children,
  open,
  setOpen,
  data,
}: {
  children?: React.ReactNode;
  open?: boolean;
  data?: DoctorData;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const FormSchema = z.object({
    appointment_date: z.date({
      required_error: 'Appointment date is required.',
    }),
    appointment_time: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit = (formData: z.infer<typeof FormSchema>) => {
    console.log(data);
    console.log(formData);
  };

  const appointment_date = form.watch('appointment_date');
  const selectedTime = form.watch('appointment_time');

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

  return (
    <div>
      <ResponsiveModal
        title="Create Appointment"
        description="Update your profile information."
        trigger={children || <div />}
        open={open}
        setOpen={setOpen}
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn('grid items-start gap-4')}
          >
            <div className="grid gap-2">
              <CalendarForm dayOfWeek={data?.schedule?.work_day} />
            </div>
            <div className="gap-2 flex flex-wrap">
              {timeSlot?.time.map((time, index) => (
                <div
                  onClick={() =>
                    !timeSlot.filter.includes(time) &&
                    form.setValue('appointment_time', time)
                  }
                  key={index}
                  className={cn(
                    'p-1 text-sm rounded-md cursor-pointer bg-slate-50 shadow-sm hover:scale-105 active:scale-95 transition-all',
                    {
                      'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100':
                        timeSlot.filter.includes(time),
                      'bg-green-800 text-white': selectedTime === time,
                    }
                  )}
                >
                  {time}
                </div>
              ))}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input type="text" id="specialty" />
            </div>
            <Button type="submit">Create Appointment</Button>
          </form>
        </Form>
      </ResponsiveModal>
    </div>
  );
}
