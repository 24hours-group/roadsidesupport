import { Resend } from "resend";
import { createServerClient } from "@/lib/supabase";
import { SERVICE_TYPES } from "@/lib/schemas";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Request ID is required" });
  }

  try {
    const requestData = req.body;

    // Validate required fields
    if (!requestData.motorist?.phone || !requestData.motorist?.email) {
      return res
        .status(400)
        .json({ message: "Contact information is required" });
    }

    if (!requestData.service_type || !requestData.pickup_location) {
      return res
        .status(400)
        .json({ message: "Service and location are required" });
    }

    // Insert complete request to database (upsert in case of retry)
    const supabase = createServerClient();
    if (supabase) {
      const { error } = await supabase.from("requests").upsert(
        {
          request_id: id,
          service_type: requestData.service_type,
          pickup_location: requestData.pickup_location,
          situation: requestData.situation,
          vehicle: requestData.vehicle,
          motorist: requestData.motorist,
          status: "submitted",
          created_at: requestData.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "request_id",
        },
      );

      if (error) {
        console.error("Supabase upsert error:", error);
      }
    }

    // Send email to call center
    const emailResult = await sendCallCenterEmail(id, requestData);

    if (!emailResult.success) {
      console.error("Email send failed:", emailResult.error);
      // Return success anyway - we have the data, call center can be notified manually
    }

    return res.status(200).json({
      success: true,
      request_id: id,
      message: "Request submitted successfully",
      email_sent: emailResult.success,
    });
  } catch (error) {
    console.error("API Submit Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function sendCallCenterEmail(requestId, data) {
  const callCenterEmail =
    process.env.CALL_CENTER_EMAIL || "victorokechukwu012@gmail.com";
  const serviceName =
    SERVICE_TYPES[data.service_type]?.label || data.service_type;
  const timestamp = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "full",
    timeStyle: "short",
  });

  // Build situation details string
  const situationDetails = data.situation
    ? Object.entries(data.situation)
        .map(([key, value]) => `• ${formatKey(key)}: ${formatValue(value)}`)
        .join("\n")
    : "Not provided";

  // Build vehicle details string
  const vehicleInfo = data.vehicle
    ? `${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model} (${data.vehicle.color})${data.vehicle.is_awd ? " - AWD" : ""}`
    : "Not provided";

  const emailBody = `
🚗 NEW ROADSIDE ASSISTANCE REQUEST

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REQUEST DETAILS
• Request ID: ${requestId.substring(0, 8).toUpperCase()}
• Submitted: ${timestamp}
• Service: ${serviceName}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📞 MOTORIST CONTACT
• Name: ${data.motorist.first_name} ${data.motorist.last_name}
• Phone: ${data.motorist.phone}
• Email: ${data.motorist.email}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 PICKUP LOCATION
• Address: ${data.pickup_location.address}
• Coordinates: ${data.pickup_location.lat}, ${data.pickup_location.lng}
• Location Source: ${data.pickup_location.source === "gps" ? "GPS" : "Manual Entry"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 SITUATION DETAILS
${situationDetails}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚙 VEHICLE INFORMATION
${vehicleInfo}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ ACTION REQUIRED
Call customer immediately to quote and dispatch.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Roadside Support
  `.trim();

  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.log("Resend API key not configured. Email content:");
      console.log(emailBody);
      return { success: false, error: "Email service not configured" };
    }

    const { data: emailData, error } = await resend.emails.send({
      from: "Roadside Support <onboarding@resend.dev>",
      to: [callCenterEmail],
      subject: `[Roadside Request] ${serviceName} — ${data.pickup_location.address.split(",")[0]} — ${requestId.substring(0, 8).toUpperCase()}`,
      text: emailBody,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    console.log("Email sent successfully:", emailData);
    return { success: true, data: emailData };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
}

function formatKey(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(value) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (value === "true") return "Yes";
  if (value === "false") return "No";
  return value;
}
