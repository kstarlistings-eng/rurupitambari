import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { XIcon as CloseIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

export type SheetWrapperT = {
  children: React.ReactNode;
  title: string;
  caption: string;
  footerContent?: React.ReactNode;
  triggerBtn?: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  contentClassName?: string;
  titleClassName?: string;
  captionClassName?: string;
  variant?: "default" | "filter";
};

function SheetWrapper({
  children,
  title,
  caption,
  footerContent,
  triggerBtn,
  isOpen,
  onOpenChange,
  titleClassName,
  captionClassName,
  contentClassName,
  variant = "default",
}: SheetWrapperT) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{triggerBtn && triggerBtn}</SheetTrigger>
      <SheetContent
        className={cn(
          "sm:max-w-[550px] !right-4 !top-4 !h-[calc(100dvh-32px)] rounded-[12px] [&>button]:hidden gap-0",
          contentClassName,
        )}
      >
        <div className="flex justify-between items-start border-b border-[#E5E7EB] gap-0 p-8 pb-4">
          <SheetHeader className={cn("p-0 flex flex-col gap-0")}>
            <SheetTitle
              className={cn(
                "text-black para-18 font-semibold font-manrope",
                titleClassName,
              )}
            >
              {title}
            </SheetTitle>
            <SheetDescription
              className={cn(
                "text-[#919191] para-14 font-normal",
                captionClassName,
              )}
            >
              {caption}
            </SheetDescription>
          </SheetHeader>
          <SheetClose asChild>
            <Button className="h-fit p-[6px] active:!ring-0 rounded-sm bg-transparent hover:bg-neutral-50 shadow-none">
              <CloseIcon className="text-neutral-700" />
            </Button>
          </SheetClose>
        </div>
        <div
          className={
            variant === "default"
              ? "px-8 py-[18px] overflow-y-auto"
              : "overflow-y-auto"
          }
        >
          {children}
        </div>
        {footerContent ? (
          <SheetFooter className="flex-row justify-center gap-4 items-center pb-8 pt-4">
            {footerContent}
          </SheetFooter>
        ) : (
          <SheetFooter className="flex-row justify-center gap-4 items-center pb-8 pt-4 hidden"></SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default SheetWrapper;
