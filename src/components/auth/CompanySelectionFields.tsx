
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CompanySearch, CompanySearchResult } from "@/components/CompanySearch";
import { RegisterFormValues } from "@/lib/validations/register";
import { Check } from "lucide-react";
import { useState } from "react";

interface CompanySelectionFieldsProps {
  form: UseFormReturn<RegisterFormValues>;
}

export const CompanySelectionFields = ({ form }: CompanySelectionFieldsProps) => {
  const mode = form.watch("companyMode");
  const [selected, setSelected] = useState<CompanySearchResult | null>(null);

  const handleSelect = (companyId: string, company?: CompanySearchResult) => {
    form.setValue("companyId", companyId, { shouldValidate: true });
    setSelected(company ?? null);
  };

  const switchMode = (next: "join" | "create") => {
    form.setValue("companyMode", next, { shouldValidate: false });
    form.clearErrors(["companyId", "companyName", "companyAddress", "organizationNumber"]);
    if (next === "create") {
      form.setValue("companyId", undefined);
      setSelected(null);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Your company</h3>
        <p className="text-sm text-gray-500">
          We invoice per company, so link your account to one now.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          variant={mode === "join" ? "default" : "outline"}
          className={mode === "join" ? "bg-orange-600 hover:bg-orange-500" : ""}
          onClick={() => switchMode("join")}
        >
          Join existing company
        </Button>
        <Button
          type="button"
          variant={mode === "create" ? "default" : "outline"}
          className={mode === "create" ? "bg-orange-600 hover:bg-orange-500" : ""}
          onClick={() => switchMode("create")}
        >
          Register a new company
        </Button>
      </div>

      {mode === "join" ? (
        <FormField
          control={form.control}
          name="companyId"
          render={() => (
            <FormItem>
              <FormControl>
                <div>
                  {selected ? (
                    <div className="flex items-start justify-between gap-4 p-3 border border-orange-500 bg-orange-50 rounded-lg">
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          <Check className="h-4 w-4 text-orange-600" />
                          {selected.name}
                        </p>
                        <p className="text-sm text-gray-500">{selected.address}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelected(null);
                          form.setValue("companyId", undefined);
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <CompanySearch onCompanySelect={handleSelect} />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organizationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Number</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyAddress"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Company Address</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
};
