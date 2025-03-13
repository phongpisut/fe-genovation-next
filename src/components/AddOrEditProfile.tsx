'use client';

import { cn } from '@/lib/utils';
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

export default function AddUser() {
  return (
    <div>
      <ResponsiveModal
        title="Edit Profile"
        description="Update your profile information."
        trigger={<Button variant="outline">Edit Profile</Button>}
      >
        <form className={cn('grid items-start gap-4')}>
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
            <Label htmlFor="specialty">Specialty</Label>
            <Input type="text" id="specialty" />
          </div>
          <Button type="submit">Save changes</Button>
        </form>
      </ResponsiveModal>
    </div>
  );
}
