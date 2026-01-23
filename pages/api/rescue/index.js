import { v4 as uuidv4 } from "uuid";
import { createServerClient } from "@/lib/supabase";
import { baseRequestSchema } from "@/lib/schemas";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const data = req.body;

    // Validate base request data
    const validationResult = baseRequestSchema.safeParse({
      service_type: data.service_type,
      pickup_location: data.pickup_location,
    });

    if (!validationResult.success) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationResult.error.flatten(),
      });
    }

    // Generate or use provided request ID
    const requestId = data.request_id || uuidv4();

    const requestData = {
      request_id: requestId,
      service_type: data.service_type,
      pickup_location: data.pickup_location,
      situation: null,
      vehicle: null,
      motorist: null,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Try to save to Supabase
    const supabase = createServerClient();
    if (supabase) {
      const { error } = await supabase.from("requests").insert([requestData]);

      if (error) {
        console.error("Supabase insert error:", error);
        // Continue without failing - data is also saved in localStorage on client
      }
    }

    return res.status(200).json({
      success: true,
      request_id: requestId,
      message: "Request created successfully",
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
