import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader } from "lucide-react";
import { cn } from "@/lib/utils";


const statusStyles: Record<string, string> = {
  active:
    "bg-success-50 text-success-500 hover:bg-success-100 hover:text-success-600",
  inactive:
    "bg-neutral-50 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-800",
};

function StatusDropdown({
  status,
  onStatusChange,
  isUpdating,
}: {
  status: string;
  onStatusChange?: (val: string) => void;
  isUpdating?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "capitalize gap-1 px-3 py-1 h-8 text-sm font-medium rounded-main shadow-none border-none",
            statusStyles[status],
          )}
          disabled={isUpdating}
        >
          {status}
          {isUpdating ? (
            <Loader className="animate-spin h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {["active", "inactive"].map((opt) => (
            <DropdownMenuItem
              key={opt}
              onSelect={() => onStatusChange?.(opt)}
              className="capitalize"
            >
              {opt}
              {opt === status && (
                <span className="ms-auto text-green-500">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default StatusDropdown;