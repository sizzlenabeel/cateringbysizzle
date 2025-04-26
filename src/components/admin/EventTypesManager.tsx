
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { EventType } from "@/types/supabase";
import { PlusCircle } from "lucide-react";
import { useCrudMutation } from "@/hooks/admin/useCrudMutation";
import { AdminDataTable, AdminDataTableColumn } from "@/components/admin/common/AdminDataTable";
import { ConfirmDeleteDialog } from "@/components/admin/common/ConfirmDeleteDialog";
import { AdminFormDialog } from "@/components/admin/common/AdminFormDialog";
import { EventTypeForm } from "@/components/admin/event-types/EventTypeForm";

const EventTypesManager = () => {
  // Fetch all event types
  const { data: eventTypes, isLoading } = useQuery({
    queryKey: ['admin-event-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('event_types')
        .select('*')
        .order('name');
        
      if (error) throw error;
      return data as EventType[];
    }
  });

  const {
    isOpen,
    isDeleteDialogOpen,
    currentItem,
    setCurrentItem,
    mutation,
    deleteMutation,
    openNewItemDialog,
    openEditItemDialog,
    openDeleteDialog,
    handleDeleteConfirm,
  } = useCrudMutation<EventType>({
    tableName: 'event_types',
    queryKey: ['admin-event-types'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentItem && currentItem.name) {
      mutation.mutate(currentItem);
    }
  };

  const columns: AdminDataTableColumn<EventType>[] = [
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (eventType) => eventType.description || '-'
    },
    {
      header: "Icon",
      accessorKey: "icon",
      cell: (eventType) => eventType.icon || '-'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Event Type Management</h2>
        <Button onClick={() => openNewItemDialog({
          name: "",
          description: "",
          icon: ""
        })}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Event Type
        </Button>
      </div>

      <AdminDataTable
        data={eventTypes || []}
        columns={columns}
        isLoading={isLoading}
        onEdit={openEditItemDialog}
        onDelete={openDeleteDialog}
        emptyMessage="No event types found"
      />

      {/* Create/Edit Dialog */}
      <AdminFormDialog
        isOpen={isOpen}
        onClose={() => setCurrentItem(null)}
        onSubmit={handleSubmit}
        title={currentItem?.id ? 'Edit Event Type' : 'Add New Event Type'}
        isSubmitting={mutation.isPending}
      >
        <EventTypeForm
          eventType={currentItem || {}}
          onChange={setCurrentItem}
        />
      </AdminFormDialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setCurrentItem(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        itemName={currentItem?.name || ''}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default EventTypesManager;
