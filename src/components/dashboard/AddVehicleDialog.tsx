import { useState } from 'react';
import { Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface AddVehicleDialogProps {
  onAdd: (vehicle: {
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    color: string;
  }) => void;
  children: React.ReactNode;
}

export function AddVehicleDialog({ onAdd, children }: AddVehicleDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    color: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.make || !formData.model || !formData.licensePlate) {
      toast.error('Please fill in all required fields');
      return;
    }

    onAdd(formData);
    setFormData({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      color: '',
    });
    setOpen(false);
    toast.success('Vehicle added successfully!');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            Add New Vehicle
          </DialogTitle>
          <DialogDescription>
            Register a new vehicle to track its maintenance and washes.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  placeholder="Tesla"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  placeholder="Model 3"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  placeholder="Black"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate *</Label>
              <Input
                id="licensePlate"
                placeholder="ABC-1234"
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Vehicle</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
