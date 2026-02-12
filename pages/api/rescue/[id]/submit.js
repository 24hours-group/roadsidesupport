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
    }

    // Send confirmation email to user
    const userEmailResult = await sendUserConfirmationEmail(id, requestData);

    if (!userEmailResult.success) {
      console.error("User confirmation email failed:", userEmailResult.error);
    }

    return res.status(200).json({
      success: true,
      request_id: id,
      message: "Request submitted successfully",
      email_sent: emailResult.success,
      confirmation_sent: userEmailResult.success,
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
  const callCenterEmail = process.env.CALL_CENTER_EMAIL;
  const serviceName =
    SERVICE_TYPES[data.service_type]?.label || data.service_type;
  // Use the user's timezone for the timestamp (falls back to UTC)
  const userTimezone = data.timezone || "UTC";
  const timestamp =
    new Date().toLocaleString("en-US", {
      timeZone: userTimezone,
      dateStyle: "full",
      timeStyle: "short",
    }) + ` (${userTimezone.replace(/_/g, " ")})`;

  // Build situation details HTML
  const situationDetailsHtml = data.situation
    ? Object.entries(data.situation)
        .map(
          ([key, value]) =>
            `<tr><td style="padding: 8px 16px; color: #64748b; font-size: 14px;">${formatKey(key)}</td><td style="padding: 8px 16px; color: #1e293b; font-size: 14px; font-weight: 500;">${formatValue(value)}</td></tr>`,
        )
        .join("")
    : '<tr><td style="padding: 8px 16px; color: #64748b;">Not provided</td></tr>';

  // Build vehicle details string
  const vehicleInfo = data.vehicle
    ? `${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model} (${data.vehicle.color})${data.vehicle.is_awd ? " — AWD" : ""}`
    : "Not provided";

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 15px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #010513 0%, #0f172a 100%); padding: 32px 20px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">New Roadside Assistance Request</h1>
              <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px;">Immediate attention required</p>
            </td>
          </tr>

          <!-- Request Summary -->
          <tr>
            <td style="padding: 32px 20px; border-bottom: 1px solid #e2e8f0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="50%" style="padding-right: 16px;">
                    <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Request ID</p>
                    <p style="margin: 0; color: #1e293b; font-size: 18px; font-weight: 600; font-family: 'Courier New', monospace;">${requestId.substring(0, 8).toUpperCase()}</p>
                  </td>
                  <td width="50%" style="padding-left: 16px;">
                    <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Service Type</p>
                    <p style="margin: 0; color: #1e293b; font-size: 18px; font-weight: 600;">${serviceName}</p>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top: 16px;">
                    <p style="margin: 0 0 4px 0; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Submitted</p>
                    <p style="margin: 0; color: #1e293b; font-size: 14px;">${timestamp}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Motorist Contact -->
          <tr>
            <td style="padding: 24px 20px; border-bottom: 1px solid #e2e8f0;">
              <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Motorist Contact</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0;">
                    <p style="margin: 0; color: #64748b; font-size: 12px;">Name</p>
                    <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${data.motorist.first_name} ${data.motorist.last_name}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <p style="margin: 0; color: #64748b; font-size: 12px;">Phone</p>
                    <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">
                      <a href="tel:${data.motorist.phone}" style="color: #2563eb; text-decoration: none;">${data.motorist.phone}</a>
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <p style="margin: 0; color: #64748b; font-size: 12px;">Email</p>
                    <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">
                      <a href="mailto:${data.motorist.email}" style="color: #2563eb; text-decoration: none;">${data.motorist.email}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Pickup Location -->
          <tr>
            <td style="padding: 24px 20px; border-bottom: 1px solid #e2e8f0;">
              <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Pickup Location</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0;">
                    <p style="margin: 0; color: #64748b; font-size: 12px;">Address</p>
                    <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 500;">${data.pickup_location.address}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <p style="margin: 0; color: #64748b; font-size: 12px;">Coordinates</p>
                    <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 14px; font-family: 'Courier New', monospace;">${data.pickup_location.lat}, ${data.pickup_location.lng}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">
                    <p style="margin: 0; color: #64748b; font-size: 12px;">Location Source</p>
                    <p style="margin: 4px 0 0 0; color: #1e293b; font-size: 14px;">${data.pickup_location.source === "gps" ? "GPS (Automatic)" : "Manual Entry"}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0 0;">
                    <a href="https://www.google.com/maps?q=${data.pickup_location.lat},${data.pickup_location.lng}" style="display: inline-block; padding: 10px 20px; background-color: #f1f5f9; color: #1e293b; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500;">View on Google Maps</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Situation Details -->
          <tr>
            <td style="padding: 24px 20px; border-bottom: 1px solid #e2e8f0;">
              <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Situation Details</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px;">
                ${situationDetailsHtml}
              </table>
            </td>
          </tr>

          <!-- Vehicle Information -->
          <tr>
            <td style="padding: 24px 20px; border-bottom: 1px solid #e2e8f0;">
              <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Vehicle Information</h2>
              <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">${vehicleInfo}</p>
            </td>
          </tr>

          <!-- Action Required -->
          <tr>
            <td style="padding: 32px 20px; background-color: #fef3c7;">
              <h2 style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Action Required</h2>
              <p style="margin: 0; color: #78350f; font-size: 16px; font-weight: 500;">Call the customer immediately to provide a quote and dispatch assistance.</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 20px; background-color: #f8fafc; text-align: center;">
              <p style="margin: 0; color: #64748b; font-size: 12px;">Roadside Support</p>
              <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 11px;">This is an automated notification. Please do not reply to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain text fallback
  const emailText = `
NEW ROADSIDE ASSISTANCE REQUEST
================================

REQUEST DETAILS
---------------
Request ID: ${requestId.substring(0, 8).toUpperCase()}
Submitted: ${timestamp}
Service: ${serviceName}

MOTORIST CONTACT
----------------
Name: ${data.motorist.first_name} ${data.motorist.last_name}
Phone: ${data.motorist.phone}
Email: ${data.motorist.email}

PICKUP LOCATION
---------------
Address: ${data.pickup_location.address}
Coordinates: ${data.pickup_location.lat}, ${data.pickup_location.lng}
Location Source: ${data.pickup_location.source === "gps" ? "GPS" : "Manual Entry"}
Google Maps: https://www.google.com/maps?q=${data.pickup_location.lat},${data.pickup_location.lng}

SITUATION DETAILS
-----------------
${
  data.situation
    ? Object.entries(data.situation)
        .map(([key, value]) => `${formatKey(key)}: ${formatValue(value)}`)
        .join("\n")
    : "Not provided"
}

VEHICLE INFORMATION
-------------------
${vehicleInfo}

ACTION REQUIRED
---------------
Call the customer immediately to provide a quote and dispatch assistance.

---
Roadside Support
This is an automated notification.
  `.trim();

  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.log("Resend API key not configured. Email content:");
      console.log(emailText);
      return { success: false, error: "Email service not configured" };
    }

    const { data: emailData, error } = await resend.emails.send({
      from: "Roadside Support <noreply@roadside-support.com>",
      to: [callCenterEmail],
      subject: `[Roadside Request] ${serviceName} — ${data.pickup_location.address.split(",")[0]} — ${requestId.substring(0, 8).toUpperCase()}`,
      html: emailHtml,
      text: emailText,
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

async function sendUserConfirmationEmail(requestId, data) {
  const serviceName =
    SERVICE_TYPES[data.service_type]?.label || data.service_type;
  const supportPhone = process.env.SUPPORT_PHONE || "(888) 681-1841";
  const refId = requestId.substring(0, 8).toUpperCase();

  const vehicleInfo = data.vehicle
    ? `${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model} (${data.vehicle.color})`
    : null;

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 15px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A8A 0%, #2563eb 100%); padding: 32px 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600;">We've Received Your Request</h1>
              <p style="margin: 10px 0 0 0; color: #bfdbfe; font-size: 14px;">Help is on the way, ${data.motorist.first_name}!</p>
            </td>
          </tr>

          <!-- Reassurance -->
          <tr>
            <td style="padding: 28px 24px 0 24px;">
              <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.6;">Thank you for reaching out to Roadside Support. A specialist will be calling you within approximately <strong>5 minutes</strong> to confirm the details and dispatch assistance to your location.</p>
            </td>
          </tr>

          <!-- Request Summary Card -->
          <tr>
            <td style="padding: 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
                <tr>
                  <td style="padding: 20px 24px 8px 24px;">
                    <p style="margin: 0 0 2px 0; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Reference Number</p>
                    <p style="margin: 0; color: #1e293b; font-size: 20px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 1px;">${refId}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 24px;">
                    <p style="margin: 0 0 2px 0; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Service Requested</p>
                    <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${serviceName}</p>
                  </td>
                </tr>
                ${
                  vehicleInfo
                    ? `<tr>
                  <td style="padding: 12px 24px;">
                    <p style="margin: 0 0 2px 0; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Vehicle</p>
                    <p style="margin: 0; color: #1e293b; font-size: 14px; font-weight: 500;">${vehicleInfo}</p>
                  </td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding: 12px 24px 20px 24px;">
                    <p style="margin: 0 0 2px 0; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">Pickup Location</p>
                    <p style="margin: 0; color: #1e293b; font-size: 14px; font-weight: 500;">${data.pickup_location.address}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What Happens Next -->
          <tr>
            <td style="padding: 0 24px 24px 24px;">
              <h2 style="margin: 0 0 16px 0; color: #1e293b; font-size: 15px; font-weight: 600;">What Happens Next?</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 28px; vertical-align: top;">
                          <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #1E3A8A; color: #ffffff; font-size: 12px; font-weight: 600; text-align: center; line-height: 22px;">1</div>
                        </td>
                        <td style="padding-left: 10px; color: #334155; font-size: 14px; line-height: 1.5;">A specialist will call you to confirm details and provide a quote</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 28px; vertical-align: top;">
                          <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #1E3A8A; color: #ffffff; font-size: 12px; font-weight: 600; text-align: center; line-height: 22px;">2</div>
                        </td>
                        <td style="padding-left: 10px; color: #334155; font-size: 14px; line-height: 1.5;">Once confirmed, we'll dispatch a technician to your location</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; vertical-align: top;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 28px; vertical-align: top;">
                          <div style="width: 22px; height: 22px; border-radius: 50%; background-color: #1E3A8A; color: #ffffff; font-size: 12px; font-weight: 600; text-align: center; line-height: 22px;">3</div>
                        </td>
                        <td style="padding-left: 10px; color: #334155; font-size: 14px; line-height: 1.5;">Help arrives — stay safe until then!</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Call CTA -->
          <tr>
            <td style="padding: 0 24px 28px 24px; text-align: center;">
              <p style="margin: 0 0 12px 0; color: #64748b; font-size: 13px;">Need immediate help? Call us directly:</p>
              <a href="tel:+18886811841" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #1E3A8A 0%, #2563eb 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 18px; font-weight: 600; letter-spacing: 0.5px;">${supportPhone}</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 24px; background-color: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 500;">Roadside Support</p>
              <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 11px;">This is an automated confirmation. Please do not reply to this email.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const emailText = `
Hi ${data.motorist.first_name},

Thank you for reaching out to Roadside Support! We've received your request and a specialist will be calling you within approximately 5 minutes.

YOUR REQUEST SUMMARY
--------------------
Reference: ${refId}
Service: ${serviceName}
${vehicleInfo ? `Vehicle: ${vehicleInfo}\n` : ""}Location: ${data.pickup_location.address}

WHAT HAPPENS NEXT
-----------------
1. A specialist will call you to confirm details and provide a quote
2. Once confirmed, we'll dispatch a technician to your location
3. Help arrives — stay safe until then!

Need immediate help? Call us: ${supportPhone}

---
Roadside Support
This is an automated confirmation.
  `.trim();

  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("Resend API key not configured. User email content:");
      console.log(emailText);
      return { success: false, error: "Email service not configured" };
    }

    const { data: emailData, error } = await resend.emails.send({
      from: "Roadside Support <noreply@roadside-support.com>",
      to: [data.motorist.email],
      subject: `We're on it! Your roadside request ${refId}`,
      html: emailHtml,
      text: emailText,
    });

    if (error) {
      console.error("User confirmation email error:", error);
      return { success: false, error };
    }

    console.log("User confirmation email sent:", emailData);
    return { success: true, data: emailData };
  } catch (error) {
    console.error("User confirmation email error:", error);
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
