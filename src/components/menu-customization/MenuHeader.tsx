
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MenuHeader = ({
  name,
  description,
  imageUrl,
  eventTypes,
  isVegan
}: {
  name: string;
  description?: string;
  imageUrl?: string;
  eventTypes: { id: string; name: string }[];
  isVegan?: boolean;
}) => {
  const navigate = useNavigate();
  
  return (
    <>
      <div>
        <Button 
          variant="ghost" 
          onClick={() => navigate("/order")}
          className="flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Menu Selection
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-64 overflow-hidden rounded-lg">
          <img 
            src={imageUrl || "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666"} 
            alt={name}
            className="w-full h-full object-cover" 
          />
        </div>
        
        <div>
          <h1 className="text-3xl font-bold mb-2">{name}</h1>
          <p className="text-gray-600 mb-4">{description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {eventTypes.map(eventType => (
              <span key={eventType.id} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full">
                {eventType.name}
              </span>
            ))}
            {isVegan && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                Vegan
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
