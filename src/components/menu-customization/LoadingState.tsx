
import { Loader2 } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="container mx-auto py-8 px-4 flex justify-center items-center min-h-[60vh]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-catering-secondary mx-auto mb-4" />
        <p className="text-xl text-gray-600">Loading menu details...</p>
      </div>
    </div>
  );
};
