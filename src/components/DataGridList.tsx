import type { Data } from '@/app/api/data/type';
import { Badge } from '@/components/ui/badge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import { Separator } from './ui/separator';

type DataGridListProps = {
  data: Data[];
  firstRender: React.RefObject<boolean>;
  handleClick: (role: string, id: number) => void;
};

const DataGridList: React.FC<DataGridListProps> = ({
  data,
  firstRender,
  handleClick,
}) => {
  return (
    <motion.div
      className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:gap-6 md:flex p-2 mt-5 justify-items-center"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: firstRender.current ? 0.2 : 0,
            duration: firstRender.current ? 0.4 : 0,
          },
        },
      }}
    >
      {data.map((item, index) => (
        <motion.div
          key={`profile-${index}`}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{
            duration: firstRender.current ? 0.4 : 0,
            delay: firstRender.current ? index * 0.1 : 0,
          }}
          onClick={() => handleClick(item?.source, item?.id)}
        >
          <div className="w-48 min-h-60 p-2 cursor-pointer transition-all bg-slate-50 rounded-md shadow-md hover:scale-105 active:scale-110">
            <ContextMenu>
              <ContextMenuTrigger>
                <div className="w-full min-h-60">
                  <Badge
                    variant="default"
                    className={cn('bg-slate-300 text-slate-800 self-start', {
                      'bg-cyan-600 text-white': item?.source === 'doctor',
                      'bg-green-700 text-white': item?.source === 'appointment',
                    })}
                  >
                    {item?.source}
                  </Badge>

                  <div className="flex relative">
                    <Image
                      className="rounded-md m-2 shadow-sm mx-auto mt-4"
                      src={`https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${
                        item?.source === 'appointment'
                          ? item?.doctor_name
                          : item?.name
                      }?radius=30?size=80`}
                      alt="pic"
                      width={item?.source === 'appointment' ? 64 : 80}
                      height={item?.source === 'appointment' ? 64 : 80}
                      priority={true}
                    />
                    {item?.source === 'appointment' && (
                      <Image
                        className="rounded-md m-2 shadow-sm mx-auto mt-4 absolute right-10 -bottom-2"
                        src={`https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${item?.patient_name}?radius=30?size=80`}
                        alt="pic"
                        width={42}
                        height={42}
                      />
                    )}
                  </div>

                  {item?.source !== 'appointment' ? (
                    <div>
                      <p className="text-center">{item?.name}</p>
                      {item?.notes && (
                        <div className="bg-slate-200 rounded-sm mt-2 p-2 items-center text-center text-sm max-h-20 overflow-y-auto">
                          {item?.notes}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-green-700 rounded-sm mt-2 p-2 items-center text-center">
                      <p className="text-white">{item?.doctor_name}</p>
                      <p className="text-sm bg-slate-50 rounded-sm p-1">
                        case : {item?.patient_name}
                      </p>
                      <div className="text-sm bg-slate-50 rounded-sm p-1 mt-1">
                        {item?.start_date}
                        <Separator />
                        <span className="text-xs">{item?.timeslot}</span>
                      </div>
                    </div>
                  )}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem className="text-green-700">
                  Create Appointment
                </ContextMenuItem>
                <ContextMenuItem>Select Doctor</ContextMenuItem>
                <ContextMenuItem>Edit</ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DataGridList;
