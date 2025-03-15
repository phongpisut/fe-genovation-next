import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useMediaQuery } from 'usehooks-ts';

export function ResponsiveModal({
  title,
  description,
  trigger,
  children,
  open,
  setOpen,
}: {
  title: string;
  description: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [selfOpen, setSelfOpen] = React.useState(false);

  if (isDesktop) {
    return (
      <Dialog
        open={setOpen ? open : selfOpen}
        onOpenChange={setOpen ? setOpen : setSelfOpen}
      >
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-0">
          <DialogHeader className="p-3">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto p-2">{children}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={setOpen ? open : selfOpen}
      onOpenChange={setOpen ? setOpen : setSelfOpen}
    >
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="w-full h-full p-4 overflow-auto"> {children}</div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
