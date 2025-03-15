'use client';

import { format, subDays } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, matchDayOfWeek } from '@/lib/utils';

export function CalendarForm({
  dayOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
}: {
  dayOfWeek?: string[];
}) {
  const { control } = useFormContext();
  return (
    <FormField
      control={control}
      name="appointment_date"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Appointment Date</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full pl-3 text-left font-normal',
                    !field.value && 'text-muted-foreground'
                  )}
                >
                  {field.value ? (
                    format(field.value, 'PPP')
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent
              disablePortal={true}
              className="w-auto p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date < subDays(new Date(), 1) ||
                  !matchDayOfWeek(date, dayOfWeek)
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormDescription></FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
