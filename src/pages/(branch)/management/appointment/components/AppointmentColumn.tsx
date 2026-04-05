import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit } from "lucide-react";
import { Link } from "react-router";
import {
  DeleteOrganizationModal,
  type deleteModalText,
} from "@/components/globalModels/deleteModel";
import type { Appointment } from "@/types/(branch)/management/appointment";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { authInstance } from "@/config/axios-interceptor";
import { branchEndpoints } from "@/config/endpoints";
import { appointmentKeys } from "@/config/querykeys/(branchKeys)/managementKeys";


export const appointmentColumns: ColumnDef<Appointment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: any) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: any) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date_time",
    header: "DATE & TIME",
    cell: ({ row }) => {
      return (
          <span className="text-sm text-muted-foreground">
            {row?.original.date || "—"}
          </span>
      );
    },
  },
  {
    accessorKey: "customer_details",
    header: "CUSTOMER",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium">
            {appointment?.customer.full_name}
          </span>
          <span className="text-sm text-muted-foreground">
            {appointment?.customer.phone_number || "—"}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "service",
    header: "SERVICE",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
      {row?.original?.services_summary?.length > 0 ? (
        <>
        <TooltipProvider delayDuration={1000}>
        <Tooltip >
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 cursor-pointer">
              {row.original.services_summary.slice(0, 1).map((service) => (
                <Badge 
                  key={service.id} 
                  className="flex gap-3 px-4 py-4 text-sm font-medium text-green-700 bg-green-50 border-none rounded-full"
                >
                  <span className="capitalize">{service.name}</span>
                  <span className="text-green-600">NRs. {service.price}</span>
                </Badge>
              ))}

              {row.original.services_summary.length > 1 && (
                <div className="flex items-center justify-center w-8 h-8 text-sm font-medium text-green-700 bg-green-50 rounded-full">
                  +{row.original.services_summary.length - 1}
                </div>
              )}
            </div>
          </TooltipTrigger>
        
          <TooltipContent className="w-fit flex flex-col gap-2 p-2">
            {row.original.services_summary.map((service) => (
              <Badge 
                key={service.id} 
                className="flex gap-3 text-sm font-medium text-black bg-white border-none rounded-sm"
              >
                <span className="capitalize">{service.name}</span>
                <span className="text-black">NRs. {service.price}</span>
              </Badge>
            ))}
          </TooltipContent>
       
        </Tooltip>
        </TooltipProvider>           
        </>
        ) : (
          "—"
        )}
      </div>
      );
    },
  },
  {
    accessorKey: "staff",
    header: "STAFF",
    cell: ({ row }) => {
      // Replace with your actual mutation/callback to update status
      return (
        <span className="capitalize">{row?.original?.primary_staff?.full_name || "—"}</span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      // Replace with your actual mutation/callback to update status
      return (
        <Badge className={cn("capitalize", 
          row?.original?.status === "scheduled" && "bg-primary-50 text-primary-800",
          row?.original?.status === "completed" && "bg-gray-50 text-gray-800",
          row?.original?.status === "cancelled" && "bg-red-50 text-red-800"
        )}>
          {row?.original?.status || "—"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "ACTIONS",
    enableHiding: false,
    cell: ({ row }) => {
      const deleteDialogText: deleteModalText = {
        title: "Delete Appointment",
        description:
          "Are you sure you want to delete this appointment? This action cannot be undone.",
        btnName: "Delete Appointment",
      };
      return (
        <div className="flex items-center gap-3">
          <Link to={`/appointments/edit`} state={{ appointmentId: row.original.id }}>
            <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            <span className="sr-only">Edit Appointment</span>
          </Link>
          <DeleteOrganizationModal
            onConfirm={() => 
              authInstance.delete(`${branchEndpoints.APPOINTMENT}${row.original.id}/`)
            }
            dialogText={deleteDialogText}
            invalidateKey={[appointmentKeys.ALL_APPOINTMENTS]}
            customComponent={
              <div className="border rounded-md border-red-500 border-dotted p-4 bg-red-50">
                <p className="text-sm text-red-700">
                  Customer: <span className="font-medium">{row.original.customer.full_name}</span><br />
                  Date & Time: <span className="font-medium">{row.original.date}</span> at <span className="font-medium">{row.original.time}</span><br />
                  Service: <span className="font-medium">{row.original.services_summary[0]?.name || "—"}</span>
                </p>
              </div>
            }
          />
        </div>
      );
    },
  },
];
