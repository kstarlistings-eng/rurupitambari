import { cn } from "@/lib/utils";

export interface IconProps {
  props?: React.SVGProps<SVGSVGElement>;
  size?: number;
  className?: string;
  opacity?: number;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: string;
}

export const SearchIcon = ({ props, size = 20, className = "" }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox={"0 0 16 16"}
    fill="none"
    {...props}
    className={className}
  >
    <path
      d="M14 14L11.1 11.1M7.33333 4C9.17428 4 10.6667 5.49238 10.6667 7.33333M12.6667 7.33333C12.6667 10.2789 10.2789 12.6667 7.33333 12.6667C4.38781 12.6667 2 10.2789 2 7.33333C2 4.38781 4.38781 2 7.33333 2C10.2789 2 12.6667 4.38781 12.6667 7.33333Z"
      stroke="#919191"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ColumnFilterIcon = ({
  props,
  size = 20,
  className = "",
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    {...props}
    className={cn("text-[#374151]", `w-${size}px h-${size}px`, className)}
  >
    <path
      d="M7.5 2.5V17.5M12.5 2.5V17.5M6.5 2.5H13.5C14.9001 2.5 15.6002 2.5 16.135 2.77248C16.6054 3.01217 16.9878 3.39462 17.2275 3.86502C17.5 4.3998 17.5 5.09987 17.5 6.5V13.5C17.5 14.9001 17.5 15.6002 17.2275 16.135C16.9878 16.6054 16.6054 16.9878 16.135 17.2275C15.6002 17.5 14.9001 17.5 13.5 17.5H6.5C5.09987 17.5 4.3998 17.5 3.86502 17.2275C3.39462 16.9878 3.01217 16.6054 2.77248 16.135C2.5 15.6002 2.5 14.9001 2.5 13.5V6.5C2.5 5.09987 2.5 4.3998 2.77248 3.86502C3.01217 3.39462 3.39462 3.01217 3.86502 2.77248C4.3998 2.5 5.09987 2.5 6.5 2.5Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const HorizontalLinesIcon = ({
  props,
  size = 16,
  className = "",
}: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
    className={cn("text-[#808080]", className)}
  >
    <path
      d="M2.3999 5.59961H13.5999M2.3999 10.1814H13.5999"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
