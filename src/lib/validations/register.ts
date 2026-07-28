
import * as z from "zod";

export const registerFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  companyMode: z.enum(["join", "create"]).default("join"),
  companyId: z.string().optional(),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  organizationNumber: z.string().optional()
})
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
  })
  .refine(data => data.companyMode !== "join" || !!data.companyId, {
    message: "Please search for and select your company",
    path: ["companyId"]
  })
  .refine(data => data.companyMode !== "create" || (data.companyName?.trim().length ?? 0) >= 2, {
    message: "Company name must be at least 2 characters",
    path: ["companyName"]
  })
  .refine(data => data.companyMode !== "create" || (data.companyAddress?.trim().length ?? 0) >= 5, {
    message: "Address must be at least 5 characters",
    path: ["companyAddress"]
  })
  .refine(data => data.companyMode !== "create" || (data.organizationNumber?.trim().length ?? 0) >= 5, {
    message: "Organization number must be at least 5 characters",
    path: ["organizationNumber"]
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
