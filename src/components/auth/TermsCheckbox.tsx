
import { Link } from "react-router-dom";

export function TermsCheckbox() {
  return (
    <div className="flex items-center">
      <input
        id="terms"
        name="terms"
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-catering-secondary focus:ring-catering-secondary"
        required
      />
      <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
        I agree to the{" "}
        <Link to="/terms" className="text-catering-secondary hover:text-purple-700">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="text-catering-secondary hover:text-purple-700">
          Privacy Policy
        </Link>
      </label>
    </div>
  );
}
