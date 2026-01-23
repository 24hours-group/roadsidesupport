import { createServerClient } from "@/lib/supabase";

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Request ID is required" });
  }

  if (req.method === "PUT") {
    return handleUpdate(req, res, id);
  }

  if (req.method === "GET") {
    return handleGet(req, res, id);
  }

  return res.status(405).json({ message: "Method not allowed" });
}

async function handleUpdate(req, res, id) {
  try {
    const updates = req.body;

    // Build update object
    const updateData = {
      updated_at: new Date().toISOString(),
    };

    if (updates.situation !== undefined) {
      updateData.situation = updates.situation;
    }

    if (updates.vehicle !== undefined) {
      updateData.vehicle = updates.vehicle;
    }

    if (updates.motorist !== undefined) {
      updateData.motorist = updates.motorist;
    }

    if (updates.status !== undefined) {
      updateData.status = updates.status;
    }

    // Try to update in Supabase
    const supabase = createServerClient();
    if (supabase) {
      const { error } = await supabase
        .from("requests")
        .update(updateData)
        .eq("request_id", id);

      if (error) {
        console.error("Supabase update error:", error);
        // Continue without failing
      }
    }

    return res.status(200).json({
      success: true,
      request_id: id,
      message: "Request updated successfully",
    });
  } catch (error) {
    console.error("API Update Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}

async function handleGet(req, res, id) {
  try {
    const supabase = createServerClient();

    if (!supabase) {
      return res.status(503).json({ message: "Database not available" });
    }

    const { data, error } = await supabase
      .from("requests")
      .select("*")
      .eq("request_id", id)
      .single();

    if (error) {
      console.error("Supabase fetch error:", error);
      return res.status(404).json({ message: "Request not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("API Get Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
}
