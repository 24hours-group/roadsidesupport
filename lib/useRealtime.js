import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

/**
 * Hook to subscribe to real-time updates on the requests table
 * @param {Object} options - Configuration options
 * @param {string} options.requestId - Optional: Subscribe to a specific request
 * @param {string} options.status - Optional: Filter by status
 * @param {function} options.onInsert - Callback when new request is inserted
 * @param {function} options.onUpdate - Callback when request is updated
 * @param {function} options.onDelete - Callback when request is deleted
 */
export function useRealtimeRequests({
  requestId = null,
  status = null,
  onInsert = null,
  onUpdate = null,
  onDelete = null,
} = {}) {
  const [requests, setRequests] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial data
  const fetchRequests = useCallback(async () => {
    if (!supabase) {
      setError("Supabase not configured");
      return;
    }

    try {
      let query = supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (requestId) {
        query = query.eq("request_id", requestId);
      }

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setRequests(data || []);
    } catch (err) {
      setError(err.message);
    }
  }, [requestId, status]);

  useEffect(() => {
    if (!supabase) {
      setError("Supabase not configured");
      return;
    }

    // Fetch initial data
    fetchRequests();

    // Set up real-time subscription
    const channelName = requestId ? `request-${requestId}` : "all-requests";

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "requests",
          ...(requestId && { filter: `request_id=eq.${requestId}` }),
        },
        (payload) => {
          console.log("Realtime update:", payload);

          switch (payload.eventType) {
            case "INSERT":
              setRequests((prev) => [payload.new, ...prev]);
              onInsert?.(payload.new);
              break;

            case "UPDATE":
              setRequests((prev) =>
                prev.map((r) =>
                  r.request_id === payload.new.request_id ? payload.new : r,
                ),
              );
              onUpdate?.(payload.new, payload.old);
              break;

            case "DELETE":
              setRequests((prev) =>
                prev.filter((r) => r.request_id !== payload.old.request_id),
              );
              onDelete?.(payload.old);
              break;
          }
        },
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
        setIsConnected(status === "SUBSCRIBED");
      });

    // Cleanup subscription on unmount
    return () => {
      console.log("Unsubscribing from realtime channel");
      supabase.removeChannel(channel);
    };
  }, [requestId, fetchRequests, onInsert, onUpdate, onDelete]);

  return {
    requests,
    isConnected,
    error,
    refetch: fetchRequests,
  };
}

/**
 * Hook to subscribe to a single request's status changes
 * Useful for the user-facing confirmation/tracking page
 */
export function useRequestStatus(requestId) {
  const [request, setRequest] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!requestId || !supabase) {
      return;
    }

    // Fetch initial status
    const fetchRequest = async () => {
      const { data, error: fetchError } = await supabase
        .from("requests")
        .select("*")
        .eq("request_id", requestId)
        .single();

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setRequest(data);
    };

    fetchRequest();

    // Subscribe to updates on this specific request
    const channel = supabase
      .channel(`request-status-${requestId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "requests",
          filter: `request_id=eq.${requestId}`,
        },
        (payload) => {
          console.log("Request status updated:", payload.new);
          setRequest(payload.new);
        },
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestId]);

  return {
    request,
    isConnected,
    error,
  };
}

export default useRealtimeRequests;
