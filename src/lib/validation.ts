import { z } from "zod";

export const PUBLIC_REGISTRATION_ROLES = [
  "FARMER",
  "LANDOWNER",
  "INVESTOR",
  "WORKER",
  "BUYER",
  "MACHINERY_OWNER",
  "SUPPLIER",
  "TRANSPORTER",
] as const;

export type PublicRole = (typeof PUBLIC_REGISTRATION_ROLES)[number];

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().optional(),
  district: z.string().min(2, "District is required"),
  state: z.string().default("Tamil Nadu"),
  roles: z
    .array(z.string())
    .min(1, "At least one role must be selected")
    .refine(
      (roles) => !roles.includes("ADMIN") && !roles.includes("SUPER_ADMIN"),
      "Administrator privileges cannot be assigned through public registration"
    )
    .refine(
      (roles) =>
        roles.every((r) =>
          (PUBLIC_REGISTRATION_ROLES as readonly string[]).includes(r)
        ),
      "One or more selected roles are invalid"
    ),
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const VerifyEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
  code: z.string().min(4, "Verification code must be at least 4 digits").max(10),
});

export const ResendVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(10, "Invalid reset token"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export const FarmProjectSchema = z.object({
  title: z.string().min(3, "Project title must be at least 3 characters"),
  description: z.string().optional(),
  cropName: z.string().min(2, "Crop name is required"),
  variety: z.string().optional(),
  season: z.string().min(2, "Season is required"),
  acresAllotted: z.number().positive("Acres must be a positive number"),
  expectedSowingDate: z.string().or(z.date()),
  expectedHarvestDate: z.string().or(z.date()),
  targetYieldKg: z.number().positive().optional(),
  projectedRevenue: z.number().positive().optional(),
  estimatedBudget: z.number().positive().optional(),
  farmId: z.string().optional(),
});

export const ResourceGapSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  category: z.enum(["FUNDING", "LABOUR", "MACHINERY", "INPUTS", "BUYER", "TRANSPORT", "EXPERTISE"]),
  title: z.string().min(3, "Title is required"),
  quantityNeeded: z.number().positive().optional(),
  unit: z.string().optional(),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  deadline: z.string().or(z.date()).optional(),
  notes: z.string().optional(),
});

export const LabourJobSchema = z.object({
  title: z.string().min(3, "Job title is required"),
  workType: z.string().min(2, "Work type is required"),
  location: z.string().min(2, "Location is required"),
  district: z.string().min(2, "District is required"),
  workersNeeded: z.number().int().positive("Must request at least 1 worker"),
  wagePerDay: z.number().positive("Wage per day must be positive"),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  workingHours: z.string().default("8 hours / day (7 AM - 3 PM)"),
  providesFood: z.boolean().default(false),
  providesTransport: z.boolean().default(false),
  projectId: z.string().optional(),
});

export const MachineryListingSchema = z.object({
  name: z.string().min(3, "Machinery name is required"),
  category: z.string().min(2, "Category is required"),
  modelYear: z.number().int().optional(),
  specs: z.string().optional(),
  rateType: z.enum(["HOURLY", "DAILY", "PER_ACRE"]).default("HOURLY"),
  rentalRate: z.number().positive("Rental rate must be positive"),
  district: z.string().min(2, "District is required"),
  serviceRadiusKm: z.number().positive().default(25),
  providesOperator: z.boolean().default(true),
  fuelIncluded: z.boolean().default(false),
});

export const MachineryBookingSchema = z.object({
  machineryId: z.string().min(1, "Machinery ID is required"),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()),
  totalUnitsBooked: z.number().positive("Units must be positive"),
  pickupAddress: z.string().optional(),
  projectId: z.string().optional(),
});

export const ProduceListingSchema = z.object({
  cropName: z.string().min(2, "Crop name is required"),
  variety: z.string().optional(),
  grade: z.string().default("GRADE_A"),
  quantityKg: z.number().positive("Quantity must be positive"),
  minimumOrderKg: z.number().positive().default(100),
  expectedHarvestDate: z.string().or(z.date()),
  isPreHarvestListing: z.boolean().default(false),
  askingPricePerKg: z.number().positive("Price must be positive"),
  packagingType: z.string().default("Jute Bags"),
  locationDistrict: z.string().min(2, "District is required"),
  projectId: z.string().optional(),
});

export const BuyerOfferSchema = z.object({
  listingId: z.string().min(1, "Listing ID is required"),
  offeredPricePerKg: z.number().positive("Price must be positive"),
  quantityRequestedKg: z.number().positive("Quantity must be positive"),
  paymentTerms: z.string().default("50_ADVANCE_50_ON_DELIVERY"),
  notes: z.string().optional(),
});

export const InputProductSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  category: z.string().min(2, "Category is required"),
  brand: z.string().optional(),
  packageSize: z.string().min(1, "Package size is required"),
  unitPrice: z.number().positive("Price must be positive"),
  stockQuantity: z.number().int().nonnegative("Stock cannot be negative"),
  isOrganic: z.boolean().default(false),
  description: z.string().optional(),
});

export const TransportListingSchema = z.object({
  vehicleNumber: z.string().min(5, "Vehicle number is required"),
  vehicleType: z.string().min(2, "Vehicle type is required"),
  capacityTons: z.number().positive("Capacity must be positive"),
  isRefrigerated: z.boolean().default(false),
  baseDistrict: z.string().min(2, "Base district is required"),
  ratePerKm: z.number().positive("Rate per km must be positive"),
});

export const InvestmentProposalSchema = z.object({
  projectId: z.string().min(1, "Project ID is required"),
  title: z.string().min(5, "Proposal title is required"),
  summary: z.string().min(10, "Summary is required"),
  targetFunding: z.number().positive("Target funding must be positive"),
  minInvestment: z.number().positive().default(5000),
  partnershipType: z.string().default("PROFIT_SHARE"),
  profitSharePercent: z.number().positive().optional(),
  fixedReturnPercent: z.number().positive().optional(),
  cultivationMonths: z.number().int().positive().default(4),
  riskMitigation: z.string().optional(),
});
