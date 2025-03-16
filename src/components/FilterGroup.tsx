import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { HourglassIcon, PersonStanding, StethoscopeIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useDebounceValue } from 'usehooks-ts';
import { DatePickerWithRange } from './ui/date-picker-range';

export default function FilterGroup({
  onChangeFilter,
  onDateRangeChange,
}: {
  onChangeFilter?: (filter: string) => void;
  onDateRangeChange?: (date: DateRange) => void;
}) {
  const [value, setValue] = useState<string[]>(['doc', 'pat', 'ap']);
  const [shake, setShake] = useState(false);
  const [debouncedFilter] = useDebounceValue(value, 500);
  const firstRender = useRef(true);

  useEffect(() => {
    if (!firstRender.current) {
      onChangeFilter?.(debouncedFilter.join('-'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedFilter]);
  const onValueChange = (value: string[]) => {
    firstRender.current = false;
    if (value.length < 1) {
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 400);
    } else {
      setValue(value);
    }
  };
  return (
    <div className="sm:flex grid gap-2">
      <ToggleGroup
        variant="outline"
        type="multiple"
        aria-label="filter"
        onValueChange={onValueChange}
        className={`transition-all ${shake ? 'translate-x-2' : 'translate-x-0'}`}
        value={value}>
        <ToggleGroupItem className="!rounded-l-sm" value="doc">
          <StethoscopeIcon className="text-slate-600" />
        </ToggleGroupItem>
        <ToggleGroupItem value="pat">
          <PersonStanding className="text-slate-600" />
        </ToggleGroupItem>
        <ToggleGroupItem className="!rounded-r-sm" value="ap">
          <HourglassIcon className="text-slate-600" />
        </ToggleGroupItem>
      </ToggleGroup>
      <DatePickerWithRange onSelectedDate={onDateRangeChange} />
    </div>
  );
}
