
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { EventType } from "@/types/supabase";
import { useToast } from "@/hooks/use-toast";
import { AdminDataTable } from "./shared/AdminDataTable";
import { ConfirmDeleteDialog } from "./shared/ConfirmDeleteDialog";
import { AdminFormDialog } from "./shared/AdminFormDialog";
import { EventTypeForm } from "./event-types/EventTypeForm";
import { useCrudMutation } from "@/hooks/admin/useCrudMutation";

const EventTypesManager = () => {
  const { toast } = useToast();
  
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

  const {
    currentItem: currentEventType,
    setCurrentItem: setCurrentEventType,
    isFormOpen,
    setIsFormOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    openNewItemForm,
    openEditItemForm,
    openDeleteDialog,
    handleDeleteConfirm,
    createOrUpdateMutation,
    deleteMutation
  } = useCrudMutation<EventType>({
    tableName: 'event_types',
    queryKey: ['admin-event-types'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentEventType && currentEventType.name) {
      createOrUpdateMutation.mutate(currentEventType);
    } else {
      toast({
        title: "Validation Error",
        description: "Name is required",
        variant: "destructive",
      });
    }
  };

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Description", accessorKey: "description", cell: (eventType: EventType) => eventType.description || '-' },
    { header: "Icon", accessorKey: "icon", cell: (eventType: EventType) => eventType.icon || '-' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Event Type Management</h2>
        <Button onClick={() => openNewItemForm({ name: "", description: "", icon: "" })}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Event Type
        </Button>
      </div>

      <AdminDataTable
        data={eventTypes || []}
        columns={columns}
        isLoading={isLoading}
        onEdit={openEditItemForm}
        onDelete={openDeleteDialog}
      />

      <AdminFormDialog
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        title={currentEventType?.id ? 'Edit Event Type' : 'Add New Event Type'}
        isSubmitting={createOrUpdateMutation.isPending}
      >
        <EventTypeForm
          eventType={currentEventType || {}}
          onChange={setCurrentEventType}
        />
      </AdminFormDialog>

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        itemName={currentEventType?.name || ""}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default EventTypesManager;
