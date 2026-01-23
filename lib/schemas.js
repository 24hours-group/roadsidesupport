import { z } from "zod";

// Service Types
export const SERVICE_TYPES = {
  flat_tire: {
    id: "flat_tire",
    label: "Flat Tire",
    description: "Tire change or repair assistance",
    icon: "tire",
  },
  jump_start: {
    id: "jump_start",
    label: "Jump Start",
    description: "Battery boost to get you going",
    icon: "battery",
  },
  lockout: {
    id: "lockout",
    label: "Lockout",
    description: "Locked out of your vehicle",
    icon: "key",
  },
  fuel_delivery: {
    id: "fuel_delivery",
    label: "Fuel Delivery",
    description: "Emergency fuel delivery",
    icon: "fuel",
  },
  basic_tow: {
    id: "basic_tow",
    label: "Basic Tow",
    description: "Tow to your preferred location",
    icon: "tow",
  },
  winch_out: {
    id: "winch_out",
    label: "Winch Out",
    description: "Vehicle recovery from stuck position",
    icon: "winch",
  },
};

export const serviceTypeEnum = z.enum([
  "flat_tire",
  "jump_start",
  "lockout",
  "fuel_delivery",
  "basic_tow",
  "winch_out",
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
  tire_count: z
    .number({ required_error: "Please select the number of flat tires" })
    .min(1)
    .max(4),
  has_spare: requiredBoolean,
  safe_location: requiredBoolean,
});

export const jumpStartSituationSchema = z.object({
  battery_accessible: requiredBoolean,
  safe_location: requiredBoolean,
});

export const lockoutSituationSchema = z.object({
  keys_inside: requiredBoolean,
  key_fob_inside: requiredBoolean,
  safe_location: requiredBoolean,
});

export const fuelDeliverySituationSchema = z.object({
  fuel_type: z.enum(["gasoline", "diesel"], {
    errorMap: () => ({ message: "Please select fuel type" }),
  }),
  gallons_needed: z
    .number({ required_error: "Please select gallons needed" })
    .min(1)
    .max(5),
  safe_location: requiredBoolean,
});

export const basicTowSituationSchema = z.object({
  tow_destination: z
    .string({ required_error: "Please enter a destination" })
    .min(5, "Please enter a valid destination address"),
  keys_with_you: requiredBoolean,
  can_shift_neutral: requiredBoolean,
  needs_ride: requiredBoolean,
  passenger_count: z.number().min(1).max(5).optional(),
});

export const winchOutSituationSchema = z.object({
  stuck_in: z.enum(["mud", "snow", "sand", "ditch", "other"], {
    errorMap: () => ({
      message: "Please select what your vehicle is stuck in",
    }),
  }),
  drivable_after: z.enum(["yes", "no", "unknown"], {
    errorMap: () => ({ message: "Please select if vehicle will be drivable" }),
  }),
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
    case "flat_tire":
      return flatTireSituationSchema;
    case "jump_start":
      return jumpStartSituationSchema;
    case "lockout":
      return lockoutSituationSchema;
    case "fuel_delivery":
      return fuelDeliverySituationSchema;
    case "basic_tow":
      return basicTowSituationSchema;
    case "winch_out":
      return winchOutSituationSchema;
    default:
      return z.object({});
  }
};
