
import { Button } from "@/components/ui/button";
import { FileQuestion, Home, MoveLeft } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <>
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      {/* Icon and Error Code */}
      <div className="relative mb-4">
        <FileQuestion className="w-24 h-24 text-muted-foreground/20 animate-pulse" />
        <span className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
          404
        </span>
      </div>

      {/* Text Content */}
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
        Page not found
      </h1>
      
      <p className="mt-4 text-base text-muted-foreground max-w-[450px]">
        Sorry, we couldn’t find the page you’re looking for. It might have been 
        moved, deleted, or perhaps it never existed.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Button 
          variant="outline" 
          onClick={() => window.history.back()}
          className="gap-2"
        >
          <MoveLeft className="w-4 h-4" />
          Go Back
        </Button>
        
        <Button asChild className="gap-2">
          <Link to="/">
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
    </>
  );
}