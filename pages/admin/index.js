import { useState, useEffect } from "react";
import Head from "next/head";
import { Layout } from "@/components/layout";
import { Card, Button, Alert, Spinner } from "@/components/ui";
import { useRealtimeRequests } from "@/lib/useRealtime";
import { SERVICE_TYPES } from "@/lib/schemas";

export default function AdminDashboard() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const { requests, isConnected, error, refetch } = useRealtimeRequests({
    onInsert: (newRequest) => {
      // Play notification sound or show toast
      console.log("New request received:", newRequest.request_id);
    },
    onUpdate: (updated) => {
      console.log("Request updated:", updated.request_id);
    },
  });

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  const statusCounts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    submitted: requests.filter((r) => r.status === "submitted").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard - Roadside Support</title>
        <meta name="robots" content="noindex" />
      </Head>

      <Layout showFooter={false}>
        <div className="min-h-screen bg-background py-8">
          <div className="container-app">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-secondary-900">
                  Request Dashboard
                </h1>
                <p className="text-secondary-600 mt-1">
                  Monitor incoming roadside assistance requests in real-time
                </p>
              </div>

              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
                />
                <span className="text-sm text-secondary-600">
                  {isConnected ? "Live" : "Disconnected"}
                </span>
                <Button variant="ghost" size="sm" onClick={refetch}>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="error" className="mb-6">
                {error}
              </Alert>
            )}

            {/* Status Filters */}
            <div className="flex gap-2 mb-6">
              {["all", "pending", "submitted", "completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    statusFilter === status
                      ? "bg-primary text-white"
                      : "bg-white text-secondary-600 hover:bg-secondary-100"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                    {statusCounts[status]}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Request List */}
              <div className="lg:col-span-2 space-y-4">
                {filteredRequests.length === 0 ? (
                  <Card padding="lg" className="text-center">
                    <svg
                      className="w-12 h-12 mx-auto mb-4 text-secondary-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <p className="text-secondary-500">No requests found</p>
                    <p className="text-sm text-secondary-400 mt-1">
                      New requests will appear here in real-time
                    </p>
                  </Card>
                ) : (
                  filteredRequests.map((request) => (
                    <RequestCard
                      key={request.request_id}
                      request={request}
                      isSelected={
                        selectedRequest?.request_id === request.request_id
                      }
                      onClick={() => setSelectedRequest(request)}
                    />
                  ))
                )}
              </div>

              {/* Request Details */}
              <div className="lg:col-span-1">
                {selectedRequest ? (
                  <RequestDetails request={selectedRequest} />
                ) : (
                  <Card padding="lg" className="text-center sticky top-24">
                    <svg
                      className="w-12 h-12 mx-auto mb-4 text-secondary-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    <p className="text-secondary-500">
                      Select a request to view details
                    </p>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

function RequestCard({ request, isSelected, onClick }) {
  const service = SERVICE_TYPES[request.service_type];
  const createdAt = new Date(request.created_at).toLocaleString();

  const statusColors = {
    pending: "bg-amber-100 text-amber-800",
    submitted: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <Card
      padding="md"
      className={`cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono text-sm text-primary font-semibold">
              #{request.request_id.substring(0, 8).toUpperCase()}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[request.status] || "bg-gray-100"}`}
            >
              {request.status}
            </span>
          </div>

          <h3 className="font-semibold text-secondary-900 mb-1">
            {service?.label || request.service_type}
          </h3>

          {request.motorist && (
            <p className="text-sm text-secondary-600">
              {request.motorist.first_name} {request.motorist.last_name} •{" "}
              {request.motorist.phone}
            </p>
          )}

          <p className="text-sm text-secondary-500 mt-2 truncate">
            📍 {request.pickup_location?.address?.split(",")[0]}
          </p>
        </div>

        <div className="text-right text-sm text-secondary-400">{createdAt}</div>
      </div>
    </Card>
  );
}

function RequestDetails({ request }) {
  const service = SERVICE_TYPES[request.service_type];

  return (
    <Card padding="lg" className="sticky top-24">
      <div className="space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-secondary-200">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-sm text-primary font-semibold">
              #{request.request_id.substring(0, 8).toUpperCase()}
            </span>
            <StatusBadge status={request.status} />
          </div>
          <h2 className="text-xl font-bold text-secondary-900">
            {service?.label || request.service_type}
          </h2>
        </div>

        {/* Motorist */}
        {request.motorist && (
          <div>
            <h4 className="text-sm font-medium text-secondary-500 mb-2">
              Contact
            </h4>
            <p className="font-semibold text-secondary-900">
              {request.motorist.first_name} {request.motorist.last_name}
            </p>
            <a
              href={`tel:${request.motorist.phone}`}
              className="text-primary hover:underline"
            >
              {request.motorist.phone}
            </a>
            <p className="text-sm text-secondary-600">
              {request.motorist.email}
            </p>
          </div>
        )}

        {/* Location */}
        <div>
          <h4 className="text-sm font-medium text-secondary-500 mb-2">
            Location
          </h4>
          <p className="text-secondary-900">
            {request.pickup_location?.address}
          </p>
          <p className="text-xs text-secondary-400 mt-1">
            {request.pickup_location?.lat}, {request.pickup_location?.lng}
          </p>
        </div>

        {/* Vehicle */}
        {request.vehicle && (
          <div>
            <h4 className="text-sm font-medium text-secondary-500 mb-2">
              Vehicle
            </h4>
            <p className="text-secondary-900">
              {request.vehicle.year} {request.vehicle.make}{" "}
              {request.vehicle.model}
            </p>
            <p className="text-sm text-secondary-600">
              Color: {request.vehicle.color}
              {request.vehicle.is_awd && " • AWD"}
            </p>
          </div>
        )}

        {/* Situation */}
        {request.situation && (
          <div>
            <h4 className="text-sm font-medium text-secondary-500 mb-2">
              Situation Details
            </h4>
            <div className="space-y-1 text-sm">
              {Object.entries(request.situation).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-secondary-600">{formatKey(key)}</span>
                  <span className="text-secondary-900 font-medium">
                    {formatValue(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-4 border-t border-secondary-200 space-y-2">
          {request.motorist?.phone && (
            <a href={`tel:${request.motorist.phone}`} className="block">
              <Button variant="primary" className="w-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                Call Customer
              </Button>
            </a>
          )}
          <a
            href={`https://www.google.com/maps?q=${request.pickup_location?.lat},${request.pickup_location?.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="secondary" className="w-full">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
              Open in Maps
            </Button>
          </a>
        </div>
      </div>
    </Card>
  );
}

function StatusBadge({ status }) {
  const colors = {
    pending: "bg-amber-100 text-amber-800",
    submitted: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${colors[status] || "bg-gray-100"}`}
    >
      {status}
    </span>
  );
}

function formatKey(key) {
  return key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatValue(value) {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value === "true") return "Yes";
  if (value === "false") return "No";
  return value;
}
