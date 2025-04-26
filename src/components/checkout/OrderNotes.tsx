
import { Textarea } from "@/components/ui/textarea";

interface OrderNotesProps {
  allergyNotes: string;
  deliveryNotes: string;
  onAllergyNotesChange: (value: string) => void;
  onDeliveryNotesChange: (value: string) => void;
}

export const OrderNotes = ({
  allergyNotes,
  deliveryNotes,
  onAllergyNotesChange,
  onDeliveryNotesChange
}: OrderNotesProps) => {
  return (
    <>
      <div className="pt-4">
        <label htmlFor="allergyNotes" className="block text-sm font-medium text-gray-700 mb-2">
          Allergy Information
        </label>
        <Textarea
          id="allergyNotes"
          placeholder="Please list any allergies or dietary restrictions..."
          value={allergyNotes}
          onChange={(e) => onAllergyNotesChange(e.target.value)}
          className="mb-4"
        />
      </div>

      <div className="pt-4">
        <label htmlFor="deliveryNotes" className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Notes
        </label>
        <Textarea
          id="deliveryNotes"
          placeholder="Please add any delivery notes..."
          value={deliveryNotes}
          onChange={(e) => onDeliveryNotesChange(e.target.value)}
          className="mb-4"
        />
      </div>
    </>
  );
};
