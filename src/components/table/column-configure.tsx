import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { ColumnFilterIcon, HorizontalLinesIcon } from "@/icons copy/otherIcons";

export default function ColumnConfigure({
  table,
  exclude = ["select", "actions"],
}: {
  table: any;
  exclude?: string[];
}) {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  useEffect(() => {
    const container = document.getElementById("portalFilterColumns");
    setPortalContainer(container);
  }, []);

  useEffect(() => {
    const cols = table.getAllLeafColumns().map((col: any) => col.id);
    setColumnOrder(cols);
  }, [table]);

  const handleDragEnd = (event: any) => {
    if (event.canceled) return;

    const { source } = event.operation;

    if (isSortable(source)) {
      const { initialIndex, index } = source as any;

      if (initialIndex !== index) {
        setColumnOrder((prev) => {
          const newOrder = [...prev];
          const [removed] = newOrder.splice(initialIndex, 1);
          newOrder.splice(index, 0, removed);

          table.setColumnOrder(newOrder);

          return newOrder;
        });
      }
    }
  };

  if (!portalContainer) {
    return null;
  }

  const allColumns = table.getAllLeafColumns();

  if (allColumns.length === 0) {
    return null;
  }
  const orderedColumns = columnOrder
    .map((id: string) => allColumns.find((col: any) => col.id === id))
    .filter(Boolean);

  return createPortal(
    <DropdownMenu>
      <TooltipProvider delayDuration={500}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <ColumnFilterIcon className="!w-[20px] !h-[20px]" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent className="text-white border-main rounded-main ">
            <p className="text-sm font-medium">Filter Columns</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent
        className="p-2 w-fit min-w-[250px] flex flex-col gap-[2px] max-w-[500px] shadow-sm"
        align="end"
        sideOffset={10}
      >
        <DragDropProvider onDragEnd={handleDragEnd}>
          {orderedColumns.map((column: any, index: number) => {
            const isStringHeader =
              typeof column.columnDef.header === "string" ||
              typeof column.columnDef.header === "number";
            return (
              <SortableItem
                key={column.id}
                column={column}
                index={index}
                isVisible={column.getIsVisible()}
                isDisabled={false}
                isStringHeader={isStringHeader}
                isExcluded={exclude.includes(column.id)}
              />
            );
          })}
        </DragDropProvider>
      </DropdownMenuContent>
    </DropdownMenu>,
    portalContainer,
  );
}

function SortableItem({
  column,
  index,
  isVisible,
  isDisabled,
  isStringHeader,
  isExcluded,
}: {
  column: any;
  index: number;
  isVisible: boolean;
  isDisabled: boolean;
  isStringHeader: boolean;
  isExcluded: boolean;
}) {
  const { ref, handleRef, isDragSource } = useSortable({
    id: column.id,
    index,
  });

  return (
    <div ref={ref}>
      <div
        className={cn(
          "flex items-center justify-between p-2 gap-2 rounded-md bg-white",
          {
            "opacity-50 cursor-not-allowed": isDisabled,
            "shadow-sm border-main": isDragSource,
            hidden: isExcluded,
          },
        )}
      >
        <div className="flex items-center gap-2">
          <Checkbox
            className="w-4 h-4 data-checked:bg-primary data-checked:border-primary"
            id={column.id}
            disabled={!column.getCanHide() || isDisabled}
            checked={isVisible}
            onCheckedChange={(value) => column.toggleVisibility(!!value)}
          />
          <label
            className={cn(
              `text-neutral-600 cursor-pointer capitalize font-medium text-sm whitespace-nowrap`,
              { "text-primary": isVisible },
            )}
            htmlFor={column.id}
          >
            {isStringHeader ? column.columnDef.header : column.id}
          </label>
        </div>

        <div ref={handleRef}>
          <HorizontalLinesIcon
            className={cn("w-4 h-4 text-neutral-600 flex-shrink-0 cursor-grab")}
          />
        </div>
      </div>
    </div>
  );
}
