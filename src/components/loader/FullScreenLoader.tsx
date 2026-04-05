import { CircleDot } from "lucide-react";
import { Loader2 } from "lucide-react";

type FullScreenLoaderProps = {
  type?: "loader1" | "loader2" | "loader3";
  text?: string;
};

export default function FullScreenLoader({
  type = "loader1",
  text = "Loading...",
}: FullScreenLoaderProps) {
  switch (type) {
    case "loader1":
      return <FullScreenLoader1 text={text} />;
    case "loader2":
      return <FullScreenLoader2 text={text} />;
    case "loader3":
      return <FullScreenLoader3 text={text} />;
    default:
      return <FullScreenLoader1 text={text} />;
  }
}

type LoaderProps = {
  text: string;
};

export function FullScreenLoader1({ text }: LoaderProps) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <CircleDot className="w-16 h-16 text-primary-500 animate-pulse" />
          <CircleDot className="w-16 h-16 text-primary-500 absolute inset-0 animate-spin opacity-30" />
        </div>
        <p className="text-gray-700 font-medium">{text}</p>
      </div>
    </div>
  );
}

export function FullScreenLoader2({ text }: LoaderProps) {
  return (
    <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
        <p className="text-white font-semibold">{text}</p>
      </div>
    </div>
  );
}

export function FullScreenLoader3({ text }: LoaderProps) {
  return (
    <div className="fixed inset-0  flex items-center justify-center z-50">
      <div className="rounded-lg p-8">
        <div className="flex gap-2 justify-center">
          <div
            className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.1s" }}
          />
          <div
            className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          />
        </div>
        <p className="text-center text-gray-600 text-sm mt-4">{text}</p>
      </div>
    </div>
  );
}
