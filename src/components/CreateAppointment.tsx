'use client';

import { cn, stringToTimeSlot } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ResponsiveModal } from './ui/responsiveModal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

import type { DoctorData } from '@/app/api/doctor/type';
import { Form } from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { format, isToday } from 'date-fns';
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

  const timeSlot = useMemo(() => {
    if (appointment_date) {
      if (isToday(appointment_date) && data?.schedule.work_hours) {
        console.log(
          stringToTimeSlot(
            data.schedule.work_hours,
            format(new Date(), 'HH:mm')
          )
        );
      }
      console.log(format(appointment_date, 'yyyy-MM-dd'));
      console.log(appointment_date == new Date());
      console.log(
        format(appointment_date, 'yyyy-MM-dd') ===
          data?.appointmentData[0]?.start_date
      );
    }
  }, [appointment_date, data]);

  return (
    <div>
      <ResponsiveModal
        title="Edit Profile"
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
              <Label htmlFor="firstname">Full Name</Label>
              <Input type="text" id="firstname" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastname">Role</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <CalendarForm dayOfWeek={data?.schedule?.work_day} />
            </div>
            <div className="grid gap-2"></div>
            <div className="grid gap-2">
              <Label htmlFor="specialty">Specialty</Label>
              <Input type="text" id="specialty" />
            </div>
            <Button type="submit">Save changes</Button>
          </form>
        </Form>
      </ResponsiveModal>
    </div>
  );
}
