import type { Data } from '@/app/api/data/type';
import { AnimatePresence, motion, useMotionValue } from 'motion/react';
import Image from 'next/image';
import React, { useEffect } from 'react';

type DoctorPopupProps = {
  data?: Data;
  onClose: () => void;
  isDialogOpen: boolean;
};

const DoctorPopup: React.FC<DoctorPopupProps> = ({
  data,
  onClose,
  isDialogOpen,
}) => {
  const x = useMotionValue(0);

  const handleDragEnd = () => {
    if (x.getVelocity() > 30) {
      onClose();
    }
  };

  const handleAnimationComplete = () => {
    if (x.get() > 0 && x.get() > 95) {
      onClose();
    }
  };

  useEffect(() => {
    if (data?.id) {
      x.set(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <AnimatePresence>
      {data?.id && !isDialogOpen && (
        <motion.div
          className="flex max-w-[16rem] h-fit p-2 bg-linear-to-r text-slate-50 bg-sky-500 rounded-tl-sm rounded-bl-sm fixed z-[9] right-0 sm:bottom-[50px] bottom-[20px] cursor-grab translate-x-[16px]"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { width: 0 },
            visible: {
              opacity: 1,
              width: '100%',
              transition: {
                duration: 0.8,
                bounce: 0.2,
              },
            },
          }}
          exit={{
            width: 0,
            transition: {
              duration: 0.5,
            },
          }}
          drag
          dragConstraints={{ top: 0, bottom: 0, left: 0 }}
          dragElastic={{ left: 0.01, right: 0 }}
          onDragEnd={handleDragEnd}
          onAnimationComplete={handleAnimationComplete}
          style={{ x }}
        >
          <p className="absolute -top-6 text-slate-800 left-0 text-sm bg-slate-50 rounded-sm shadow-md px-1">
            Selected Doctor
          </p>
          <div className="w-1 bg-gray-200 rounded-md" />
          <Image
            draggable={false}
            className="rounded-md m-2 shadow-sm"
            src={`https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${data?.name}?radius=30?size=80`}
            alt="pic"
            width={42}
            height={42}
          />
          <p className="text-xl content-center ml-3 mx-auto">{data?.name}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DoctorPopup;
