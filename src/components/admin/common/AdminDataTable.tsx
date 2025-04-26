
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { ReactNode } from "react";

export interface AdminDataTableColumn<T> {
  header: string;
  accessorKey: keyof T | ((item: T) => ReactNode);
  cell?: (item: T) => ReactNode;
}

interface AdminDataTableProps<T extends { id: string }> {
  data: T[];
  columns: AdminDataTableColumn<T>[];
  isLoading: boolean;
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  emptyMessage?: string;
}

export function AdminDataTable<T extends { id: string }>({
  data,
  columns,
  isLoading,
  onEdit,
  onDelete,
  emptyMessage = "No items found"
}: AdminDataTableProps<T>) {
  if (isLoading) {
    return <div>Loading items...</div>;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column, index) => (
              <TableHead key={index}>{column.header}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && data.length > 0 ? (
            data.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column, index) => (
                  <TableCell key={index}>
                    {column.cell
                      ? column.cell(item)
                      : typeof column.accessorKey === "function"
                        ? column.accessorKey(item)
                        : String(item[column.accessorKey] || "-")}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onDelete(item)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 1} className="text-center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
