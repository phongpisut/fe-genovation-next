import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { addMinutes, parse, format , subMinutes } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function stringToTimeSlot(time: string, filterTime = '') {

const splitTimeRange = time.split('-');

if(splitTimeRange.length < 2) {
  return;
}

const startTime = splitTimeRange[0].trim();
const endTime = splitTimeRange[1].trim();

const startDateTime = parse(startTime, 'HH:mm', new Date());
const endDateTime =  subMinutes(parse(endTime, 'HH:mm', new Date()), 30);


const timeRange = [];
let currentDateTime = startDateTime;

while (currentDateTime <= endDateTime) {
  const nextDateTime = addMinutes(currentDateTime, 30);
  if( filterTime && (parse(filterTime, 'HH:mm', new Date()) >= currentDateTime)) {
    currentDateTime = nextDateTime;
    continue;
  }
  timeRange.push(`${format(currentDateTime,'HH:mm')}-${format(nextDateTime,'HH:mm')}`);
  currentDateTime = nextDateTime;
  
}

return timeRange;

}

export function matchDayOfWeek(date: Date, dayOfWeek: string[]) {
  const currentDayOfWeek = format(date, 'EEEE');
  if(dayOfWeek.includes(currentDayOfWeek)) {
    return true;
  }
  return false;
}