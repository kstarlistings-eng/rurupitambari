import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type React from "react";
import { Link } from "react-router";

export interface Item {
  label?: string;
  link?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  ItemClassName?: string;
  onClick?: () => void;
}

interface DropdownMenuProps {
  dropDownList: Item[];
  trigger?: React.ReactNode;
  isOpen?: boolean;
  ContainerClassName?: string;
  align?: "start" | "end" | "center";
  onOpenChange?: (open: boolean) => void;
  renderType?: "render" | "custom";
  render?: (item: Item, index: number) => React.ReactNode;
}

export default function CustomDropDown({
  trigger,
  isOpen,
  onOpenChange,
  dropDownList,
  align = "end",
  ContainerClassName,
  renderType = "custom",
  render,
}: DropdownMenuProps) {
  if (dropDownList.length === 0) {
    return null;
  }
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className={cn(
          "w-auto p-[10px] font-manrope para-14 font-[500]",
          ContainerClassName
        )}
      >
        {renderType === "custom" ? (
          <>
            {dropDownList.map((item: Item, index: number) => {
              if (item?.link) {
                return (
                  <Link to={item.link} key={index}>
                    <DropdownMenuItem
                      disabled={item?.disabled}
                      className={cn(
                        "flex gap-3 items-center p-2  cursor-pointer",
                        item?.ItemClassName
                      )}
                      key={index}
                    >
                      {item?.icon && (
                        <div className="w-4 h-4 flex items-center justify-center">
                          {item?.icon}
                        </div>
                      )}
                      <span className=" para-14 text-black-crm-400">
                        {item.label}
                      </span>
                    </DropdownMenuItem>
                  </Link>
                );
              }
              return (
                <DropdownMenuItem
                  disabled={item?.disabled}
                  onClick={item?.onClick}
                  className={cn(
                    "flex gap-3 items-center p-2 font-satoshi-medium-500 cursor-pointer",
                    item?.ItemClassName
                  )}
                  key={index}
                >
                  {item?.icon && (
                    <div className="w-5 h-5 flex items-center justify-center">
                      {item?.icon}
                    </div>
                  )}
                  <span className=" para-14 text-black-crm-400">
                    {item.label}
                  </span>
                </DropdownMenuItem>
              );
            })}
          </>
        ) : (
          <>{render && dropDownList.map(render)}</>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


//How to use it is shown below

/* 
<CustomDropDown
    trigger={
    <Button variant={"default"} className={cn(`px-2 shadow-none`)}>
        <Ellipsis />
    </Button>
    }
    dropDownList={[
    {
        label: "Edit",
        icon: <EditIcon />,
        link: `/admin/roles-access/create-edit?id=ll`,
    },
    {
        label: "Delete",
        icon: <DeleteIcon />,
        onClick: () => console.log("this is the delete btn"),
    },
    ]}
/> 
*/