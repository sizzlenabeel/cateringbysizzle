
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { EventType } from "@/types/supabase";
import { PlusCircle, Edit, Trash } from "lucide-react";

const EventTypesManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEventType, setCurrentEventType] = useState<Partial<EventType> | null>(null);

  // Fetch all event types
  const { data: eventTypes, isLoading } = useQuery({
    queryKey: ['admin-event-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_types')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data;
    }
  });

  // Create or update event type mutation
  const mutation = useMutation({
    mutationFn: async (eventType: Partial<EventType>) => {
      if (eventType.id) {
        // Update existing event type
        const { data, error } = await supabase
          .from('event_types')
          .update({
            name: eventType.name,
            description: eventType.description,
            icon: eventType.icon
          })
          .eq('id', eventType.id)
          .select();
          
        if (error) throw error;
        return data;
      } else {
        // Create new event type
        const { data, error } = await supabase
          .from('event_types')
          .insert({
            name: eventType.name,
            description: eventType.description,
            icon: eventType.icon
          })
          .select();
          
        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-event-types'] });
      setIsOpen(false);
      setCurrentEventType(null);
      toast({
        title: "Success",
        description: "Event type saved successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save event type: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete event type mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('event_types')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-event-types'] });
      setIsDeleteDialogOpen(false);
      setCurrentEventType(null);
      toast({
        title: "Success",
        description: "Event type deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete event type: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentEventType && currentEventType.name) {
      mutation.mutate(currentEventType);
    } else {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
    }
  };

  const openNewEventTypeDialog = () => {
    setCurrentEventType({
      name: "",
      description: "",
      icon: ""
    });
    setIsOpen(true);
  };

  const openEditEventTypeDialog = (eventType: EventType) => {
    setCurrentEventType({ ...eventType });
    setIsOpen(true);
  };

  const openDeleteDialog = (eventType: EventType) => {
    setCurrentEventType(eventType);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (currentEventType?.id) {
      deleteMutation.mutate(currentEventType.id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Event Type Management</h2>
        <Button onClick={openNewEventTypeDialog}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Event Type
        </Button>
      </div>

      {isLoading ? (
        <div>Loading event types...</div>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventTypes && eventTypes.length > 0 ? (
                eventTypes.map((eventType) => (
                  <TableRow key={eventType.id}>
                    <TableCell>{eventType.name}</TableCell>
                    <TableCell>{eventType.description || '-'}</TableCell>
                    <TableCell>{eventType.icon || '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditEventTypeDialog(eventType)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openDeleteDialog(eventType)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No event types found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{currentEventType?.id ? 'Edit Event Type' : 'Add New Event Type'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={currentEventType?.name || ''}
                  onChange={(e) => setCurrentEventType({ ...currentEventType, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={currentEventType?.description || ''}
                  onChange={(e) => setCurrentEventType({ ...currentEventType, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="icon" className="text-right">Icon</Label>
                <Input
                  id="icon"
                  value={currentEventType?.icon || ''}
                  onChange={(e) => setCurrentEventType({ ...currentEventType, icon: e.target.value })}
                  className="col-span-3"
                  placeholder="Icon name or URL"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete <strong>{currentEventType?.name}</strong>?</p>
            <p className="text-sm text-muted-foreground mt-2">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventTypesManager;
