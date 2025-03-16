'use client';
import { motion, useMotionValue, useSpring } from 'motion/react';
import React, { createContext, useContext, useEffect, useState } from 'react';

type LoadingContextType = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setIsLoading: () => {},
});

export const LoadingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 300 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    if (isLoading) {
      document.body.classList.add('loading');
      window.addEventListener('mousemove', updateMousePosition);
    } else {
      document.body.classList.remove('loading');
      window.removeEventListener('mousemove', updateMousePosition);
    }

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.body.classList.remove('loading');
    };
  }, [isLoading, cursorX, cursorY]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}

      {isLoading && (
        <>
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-50"
            style={{
              x: springX,
              y: springY,
              translateX: '-50%',
              translateY: '-50%',
            }}>
            <motion.div
              className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}>
              <motion.div
                className="w-6 h-6 rounded-full border-slate-50 border-2 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);
