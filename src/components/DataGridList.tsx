import type { Data } from '@/app/api/data/type';
import { Badge } from '@/components/ui/badge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';
import { Phone } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Separator } from './ui/separator';

type DataGridListProps = {
  data: Data[];
  firstRender: React.RefObject<boolean>;
  handleContextSelect: (data: Data, context: string) => void;
  isMatching: boolean;
};

const DataGridList: React.FC<DataGridListProps> = ({
  data,
  firstRender,
  handleContextSelect,
  isMatching,
}) => {
  return (
    <motion.div
      className={cn(
        'flex justify-center gap-4 max-w-4xl w-[80vw] p-2 mt-5 justify-items-center ',
        {
          'grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))]':
            data.length > 3,
        }
      )}
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
      }}>
      <AnimatePresence mode="sync">
        {data.map((item, index) => (
          <motion.div
            key={`${item.source}-${item.id}`}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{
              duration: firstRender.current ? 0.4 : 0,
              delay: firstRender.current ? index * 0.1 : 0,
            }}
            layout
            exit={{
              opacity: 0,
              scale: 0,
              transition: { duration: 0.2 },
            }}>
            <div className=" w-48 min-h-60 p-2 cursor-pointer transition-all bg-slate-50 rounded-md shadow-md hover:scale-105 active:scale-110">
              <ContextMenu>
                <ContextMenuTrigger>
                  <div className="w-full min-h-60">
                    <Badge
                      variant="default"
                      className={cn('bg-slate-300 text-slate-800 self-start', {
                        'bg-cyan-600 text-slate-50': item?.source === 'doctor',
                        'bg-green-700 text-slate-50':
                          item?.source === 'appointment',
                      })}>
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
                        {item?.tel && (
                          <Link
                            href={`tel:${item?.tel?.replace(/[()-]/g, '')}`}
                            className="flex gap-1 text-xs text-center justify-center relative right-1">
                            <Phone
                              fill="black"
                              width={10}
                              height={10}
                              className="relative top-[2px]"
                            />{' '}
                            {item?.tel}
                          </Link>
                        )}

                        {item?.specialty && (
                          <div>
                            <Separator />
                            <p className="text-xs text-center text-gray-500">
                              Specialty
                            </p>
                            <p className="text-center text-sm bg-cyan-600 text-slate-50 rounded-md">
                              {item?.specialty}
                            </p>
                          </div>
                        )}
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
                  {item.source === 'patient' && isMatching && (
                    <ContextMenuItem
                      className="text-green-700"
                      onClick={() =>
                        handleContextSelect(item, 'create-appointment')
                      }>
                      Create Appointment
                    </ContextMenuItem>
                  )}
                  {item.source === 'doctor' && (
                    <ContextMenuItem
                      onClick={() =>
                        handleContextSelect(item, 'select-doctor')
                      }>
                      Select Doctor
                    </ContextMenuItem>
                  )}
                  {item.source !== 'appointment' && (
                    <ContextMenuItem
                      onClick={() => handleContextSelect(item, 'edit')}>
                      Edit
                    </ContextMenuItem>
                  )}

                  {item.source === 'appointment' && (
                    <ContextMenuItem
                      onClick={() =>
                        handleContextSelect(item, 'cancel-appointment')
                      }
                      className="text-red-600">
                      Cancel Appointment
                    </ContextMenuItem>
                  )}
                </ContextMenuContent>
              </ContextMenu>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default DataGridList;
