import { z } from "zod";

// Service Types
export const SERVICE_TYPES = {
  jump_start: {
    id: "jump_start",
    label: "Jump Start",
    description: "Battery boost to get you going",
    icon: "battery",
  },
  tire_service: {
    id: "tire_service",
    label: "Tire Service",
    description: "Tire change or repair assistance",
    icon: "tire",
  },
  lockout: {
    id: "lockout",
    label: "Lockout",
    description: "Locked out of your vehicle",
    icon: "key",
  },
  gas_delivery: {
    id: "gas_delivery",
    label: "Gas Delivery",
    description: "Emergency fuel delivery",
    icon: "fuel",
  },
  mobile_mechanic: {
    id: "mobile_mechanic",
    label: "Mobile Mechanic",
    description: "On-site vehicle repair",
    icon: "mechanic",
  },
  other: {
    id: "other",
    label: "Other / Not Sure",
    description: "Describe what you need",
    icon: "other",
  },
};

export const serviceTypeEnum = z.enum([
  "jump_start",
  "tire_service",
  "lockout",
  "gas_delivery",
  "mobile_mechanic",
  "other",
]);

// Location Schema
export const locationSchema = z.object({
  address: z.string().min(5, "Please enter a valid address"),
  lat: z.number(),
  lng: z.number(),
  source: z.enum(["gps", "manual"]),
});

// Base Request Schema
export const baseRequestSchema = z.object({
  service_type: serviceTypeEnum,
  pickup_location: locationSchema,
});

// Custom boolean schema that FORCEFULLY customizes the error message
// We use z.any() and refine() to catch undefined/null/other types and return our specific message
const requiredBoolean = z.any().refine((val) => typeof val === "boolean", {
  message: "Please select Yes or No",
});

// Situation Schemas per Service Type
export const flatTireSituationSchema = z.object({
  tire_service_type: z.enum(["tire_change", "tire_replacement"], {
    errorMap: () => ({ message: "Please select the type of tire service" }),
  }),
  tire_count: z
    .number({ required_error: "Please select the number of flat tires" })
    .min(1)
    .max(4),
  has_spare: requiredBoolean,
  safe_location: requiredBoolean,
});

export const jumpStartSituationSchema = z.object({
  battery_count: z
    .number({ required_error: "Please select the number of batteries" })
    .min(1)
    .max(4),
  battery_accessible: requiredBoolean,
  safe_location: requiredBoolean,
});

export const lockoutSituationSchema = z.object({
  keys_inside: requiredBoolean,
  key_fob_inside: requiredBoolean,
  safe_location: requiredBoolean,
});

export const fuelDeliverySituationSchema = z.object({
  fuel_type: z.enum(["regular", "midgrade", "premium", "diesel"], {
    errorMap: () => ({ message: "Please select fuel type" }),
  }),
  distance_to_station: z.string().optional(),
  safe_location: requiredBoolean,
});


export const mobileMechanicSituationSchema = z.object({
  issue_type: z.enum(
    [
      "wont_start",
      "overheating",
      "strange_noises",
      "check_engine",
      "brake_issues",
      "electrical",
      "fluid_leak",
      "other",
    ],
    {
      errorMap: () => ({ message: "Please select the issue type" }),
    },
  ),
  description: z.string().min(1, "Please describe the problem"),
  is_drivable: requiredBoolean,
  safe_location: requiredBoolean,
});

// Vehicle Schema
export const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z
    .number()
    .min(1980, "Year must be 1980 or later")
    .max(new Date().getFullYear() + 1, "Invalid year"),
  color: z.string().min(1, "Color is required"),
  is_awd: z.boolean().optional().default(false),
});

// Motorist Schema
export const motoristSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[\d\s\-\(\)\+]+$/, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
});

// Complete Request Schema
export const completeRequestSchema = z.object({
  request_id: z.string().uuid(),
  service_type: serviceTypeEnum,
  pickup_location: locationSchema,
  situation: z.record(z.any()),
  vehicle: vehicleSchema,
  motorist: motoristSchema,
  status: z
    .enum(["pending", "submitted", "completed", "cancelled"])
    .default("pending"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

// Get situation schema based on service type
export const getSituationSchema = (serviceType) => {
  switch (serviceType) {
    case "tire_service":
      return flatTireSituationSchema;
    case "jump_start":
      return jumpStartSituationSchema;
    case "lockout":
      return lockoutSituationSchema;
    case "gas_delivery":
      return fuelDeliverySituationSchema;
    case "mobile_mechanic":
      return mobileMechanicSituationSchema;
    case "other":
      return z.object({
        description: z.string().min(1, "Please describe what you need"),
        safe_location: requiredBoolean,
      });
    default:
      return z.object({});
  }
};
