import { Button } from "@/components/ui/button";
import {
  CloudCheck,
  MessageCircleWarningIcon,
  TriangleAlert,
  XIcon,
} from "lucide-react";
import { toast, type ToastIcon, type ToastOptions } from "react-toastify";

type ToastVariant = "success" | "warning" | "error";

interface NotifyToastProps {
  title: string;
  message: string;
  variant?: ToastVariant;
  closeToast?: () => void;
}

const VARIANT_CONFIGS: Record<
  ToastVariant,
  { bgColor: string; borderColor: string; icon: ToastIcon; color: string }
> = {
  success: {
    bgColor: "#f0fcf5",
    borderColor: "#188c43",
    icon: <CloudCheck />,
    color: "#188c43",
  },
  warning: {
    bgColor: "#fef9ef",
    borderColor: "#ae7008",
    icon: <MessageCircleWarningIcon className="text-warning-crm-700" />,
    color: "#ae7008",
  },
  error: {
    bgColor: "#fcf4f4",
    borderColor: "#aa3030",
    icon: <TriangleAlert className="text-destructive-crm-700" />,
    color: "#aa3030",
  },
} as const;

const NotifyToast = ({
  title,
  message,
  variant = "success",
  closeToast,
}: NotifyToastProps) => (
  <div className="flex items-start justify-between w-full">
    <div className={`flex flex-col w-full gap-1`}>
      <h4 className="para-16 font-semibold">{title}</h4>
      <p className="para-14 line-clamp-4">{message}</p>
    </div>
    <Button
      onClick={closeToast}
      className="h-fit p-1.5 active:!ring-0 rounded-sm bg-transparent hover:bg-neutral-crm-50 flex-shrink-0 shadow-none"
      aria-label="Close notification"
    >
      <XIcon style={{ color: VARIANT_CONFIGS[variant].color }} />
    </Button>
  </div>
);

interface NotifyOptions extends Omit<NotifyToastProps, "closeToast"> {
  variant?: ToastVariant;
}

export const notify = ({
  variant = "success",
  title,
  message,
}: NotifyOptions): void => {
  const config = VARIANT_CONFIGS[variant];

  const toastOptions: ToastOptions = {
    type: variant,
    icon: config.icon,
    closeButton: false,
    hideProgressBar: true,
    className: `border-l-8 !w-[400px] !max-w-[95%] items-top gap-1`,
    style: {
      backgroundColor: config.bgColor,
      borderColor: config.borderColor,
      color: config.color,
    },
  };

  toast(
    ({ closeToast }) => (
      <NotifyToast
        title={title}
        message={message}
        variant={variant}
        closeToast={closeToast}
      />
    ),
    toastOptions,
  );
};


//How to Use

// notify({
//       title: "Deleted",
//       message: `The ${deleteItemName} has been deleted successfully.`,
//       variant: "success",
// });