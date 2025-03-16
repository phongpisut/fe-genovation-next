'use client';

import { Button } from '@/components/ui/button';
import { ResponsiveModal } from '@/components/ui/responsiveModal';

import type { DoctorData } from '@/app/api/doctor/type';
import type { PatientData } from '@/app/api/patient/type';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useLoading } from '@/context/LoadingContext';
import { ProfileData, ProfileSchema } from '@/schema/addProfileSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { PersonStanding, StethoscopeIcon, Trash2Icon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useConfirm } from './alert/alert-dialog';

const longDaysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const veryShortDaysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function AddOrEditProfile({
  children,
  open,
  setOpen,
  data,
}: {
  children?: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  isEdit?: boolean;
  data?: DoctorData | PatientData;
}) {
  const [profileType, setProfileType] = useState('doctor');

  const { setIsLoading } = useLoading();
  const confirmDialog = useConfirm();
  const isEdit = data ? true : false;

  const formSchema = ProfileSchema.superRefine((data, ctx) => {
    if (
      (profileType === 'doctor' && !data.workDay) ||
      (data.workDay && data.workDay.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Day of work is required for doctors',
        path: ['workDay'],
      });
    }

    if (profileType === 'doctor' && !data.timeStart) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start time is required for doctors',
        path: ['timeStart'],
      });
    }

    if (profileType === 'doctor' && !data.timeEnd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End time is required for doctors',
        path: ['timeEnd'],
      });
    }

    if (data.timeStart && !data.timeEnd) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End time is required when start time is provided',
        path: ['timeEnd'],
      });
    }

    if (data.timeStart && data.timeEnd) {
      if (data.timeStart >= data.timeEnd) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End time cannot be less than start time',
          path: ['timeEnd'],
        });
      }
    }
  });

  const form = useForm<ProfileData>({
    resolver: zodResolver(formSchema),
  });

  const prepareData = useCallback(async () => {
    if (data) {
      if ((data as DoctorData)?.schedule) {
        const doctorData = data as DoctorData;
        const doctorWorkHours = doctorData.schedule?.work_hours?.split('-');
        setProfileType('doctor');
        form.reset({
          fullname: doctorData.fullname,
          workDay: doctorData.schedule?.work_day,
          specialty: doctorData.specialty || '',
          timeStart: (doctorWorkHours?.[0] as string) || '',
          timeEnd: (doctorWorkHours?.[1] as string) || '',
          notes: doctorData?.notes || '',
        });
      } else {
        setProfileType('patient');
        form.reset({
          fullname: data.fullname,
          tel: (data as PatientData).tel || '',
          notes: data.notes || '',
        });
      }
    }
  }, [data, form]);

  useEffect(() => {
    prepareData();
  }, [data]);

  const errors = form.formState.errors;

  const onSubmit = async (formData: ProfileData) => {
    const { fullname, workDay, timeStart, timeEnd, notes, tel, specialty } =
      formData;
    const payload = {
      ...(data?.id && { id: data?.id }),
      fullname,
      ...(profileType === 'doctor' && {
        ...(specialty && { specialty }),
        schedule: {
          work_day: workDay,
          work_hours: `${timeStart}-${timeEnd}`,
        },
      }),
      notes,
      ...(profileType === 'patient' && { tel }),
    };

    const fetcher = isEdit ? axios.put : axios.post;

    await confirmDialog({
      title: `${isEdit ? 'Update' : 'Create'} Profile`,
      body: `Are you sure you want to ${isEdit ? 'update' : 'create'} this profile?`,
      cancelButton: 'Cancel',
    }).then(async (confirmed) => {
      if (confirmed) {
        fetcher(`/api/${profileType}`, payload)
          .then(() => {
            toast(`${isEdit ? 'Update' : 'Create'} profile successfully`, {
              type: 'success',
            });
          })
          .catch(() => {
            toast(`${isEdit ? 'Update' : 'Create'} profile fail`, {
              type: 'error',
            });
          })
          .finally(async () => {
            setIsLoading(false);
            await setTimeout(() => {
              window.location.reload();
            }, 600);
          });
      }
    });
  };

  const onDelete = async () => {
    await confirmDialog({
      title: 'Delete profile',
      body: 'Are you sure you want to delete this profile?',
      cancelButton: 'Cancel',
    }).then(async (confirmed) => {
      if (confirmed) {
        setIsLoading(true);
        await axios
          .delete(`/api/${profileType}`, {
            params: { id: data?.id },
          })
          .then(async () => {
            toast('Delete profile successfully', { type: 'success' });
            await setTimeout(() => {
              window.location.reload();
            }, 500);
          })
          .catch(() => {
            toast('Delete profile fail', { type: 'error' });
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    });
  };

  return (
    <div>
      <ResponsiveModal
        title={isEdit ? 'Update Profile' : 'Create Profile'}
        description={`${isEdit ? 'Update' : 'Create'} doctor or patient profile.`}
        trigger={children || <div />}
        open={open}
        setOpen={setOpen}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid items-start gap-4">
            <div className="grid gap-2 mx-auto">
              <ToggleGroup
                variant="cyan"
                type="single"
                value={profileType}
                disabled={isEdit}
                onValueChange={(value) => setProfileType(value)}>
                <ToggleGroupItem value="doctor" aria-label="Doctor">
                  <StethoscopeIcon /> Doctor
                </ToggleGroupItem>
                <ToggleGroupItem value="patient" aria-label="Patient">
                  <PersonStanding /> Patient
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Full name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-slate-50"
                        type="text"
                        placeholder="Name Surname"
                        required
                        id="fullname"
                        {...field}
                        onFocus={() => form.clearErrors('fullname')}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {errors.fullname && (
              <p className="text-red-500 text-sm">{errors.fullname.message}</p>
            )}

            {profileType === 'doctor' && (
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Specialty</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-slate-50"
                          type="text"
                          id="specialty"
                          {...field}
                          onFocus={() => form.clearErrors('fullname')}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {profileType === 'patient' && (
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="tel"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Mobile No. </FormLabel>

                      <FormControl>
                        <Input
                          className="bg-slate-50"
                          type="tel"
                          id="tel"
                          format="###-###-####"
                          {...field}
                          onFocus={() => form.clearErrors('tel')}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {profileType === 'doctor' && (
              <div className="grid gap-2">
                <FormLabel>Day of Work</FormLabel>
                <FormField
                  control={form.control}
                  name="workDay"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormControl>
                        <ToggleGroup
                          variant="cyan"
                          type="multiple"
                          value={field.value}
                          onValueChange={field.onChange}>
                          {longDaysOfWeek.map((day, index) => (
                            <ToggleGroupItem
                              aria-label={day}
                              key={day}
                              value={day}>
                              {veryShortDaysOfWeek[index]}
                            </ToggleGroupItem>
                          ))}
                        </ToggleGroup>
                      </FormControl>
                    </FormItem>
                  )}
                />
                {errors.workDay && (
                  <p className="text-red-500 text-sm">
                    {errors.workDay.message}
                  </p>
                )}
              </div>
            )}

            {profileType === 'doctor' && (
              <div className="grid gap-2">
                <div className="flex gap-2">
                  <FormField
                    control={form.control}
                    name="timeStart"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Time Slot</FormLabel>
                        <FormControl>
                          <Input
                            className="bg-slate-50"
                            type="time"
                            required
                            id="timeStart"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="w-3 h-[0.15rem] bg-gray-400 mt-auto mb-4" />
                  <FormField
                    control={form.control}
                    name="timeEnd"
                    render={({ field }) => (
                      <FormItem className="flex flex-col mt-[0.9rem]">
                        <FormLabel />
                        <FormControl>
                          <Input
                            className="bg-slate-50"
                            type="time"
                            required
                            id="timeEnd"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                {(errors.timeStart || errors.timeEnd) && (
                  <p className="text-red-500 text-sm">
                    {errors.timeStart?.message || errors.timeEnd?.message}
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your notes" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="mb-0">
              {isEdit ? 'Save Changes' : 'Add Profile'}
            </Button>
            {data && (
              <Button
                className="relative bottom-2 text-red-600"
                type="button"
                variant="outline"
                onClick={onDelete}
                size="sm">
                <Trash2Icon width={20} height={20} /> Delete Profile
              </Button>
            )}
          </form>
        </Form>
      </ResponsiveModal>
    </div>
  );
}
