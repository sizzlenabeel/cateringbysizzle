
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface UpdateOrderStatusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  onUpdateStatus: (status: string) => void;
  isUpdating: boolean;
}

export const UpdateOrderStatusDialog = ({
  isOpen,
  onClose,
  currentStatus,
  onUpdateStatus,
  isUpdating
}: UpdateOrderStatusDialogProps) => {
  const [selectedStatus, setSelectedStatus] = React.useState<string>(currentStatus);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedStatus(currentStatus);
    }
  }, [isOpen, currentStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStatus(selectedStatus);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Order Status</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <RadioGroup value={selectedStatus} onValueChange={setSelectedStatus}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending">Pending</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="processing" id="processing" />
                <Label htmlFor="processing">Processing</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="delivered" id="delivered" />
                <Label htmlFor="delivered">Delivered</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cancelled" id="cancelled" />
                <Label htmlFor="cancelled">Cancelled</Label>
              </div>
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating || selectedStatus === currentStatus}>
              {isUpdating ? "Updating..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
