const BASE = process.env.NEXT_PUBLIC_G2_BASE_URL ?? 'http://localhost:8000';

export type ApiRoute = {
  id: number;
  name: string;
  route_number: string | null;
  color: string | null;
  destination: string | null;
};

export type ApiLiveBus = {
  id: string;
  fleet_code: string;
  plate_number: string;
  status: string;
  route_id: string | null;
  latitude: number | null;
  longitude: number | null;
};

export type ApiRouteStop = {
  id: number;
  name: string;
  stop_order: number;
};

export type ApiRouteStops = {
  route_id: number;
  route_name: string;
  stops: ApiRouteStop[];
};

export type ApiTransitRoute = {
  id: string;
  number: string;
  name: string;
  color: string;
  path: [number, number][];
  stops: { name: string; coordinates: [number, number] }[];
};

export type ApiPlannedTrip = {
  id: string;
  schedule_id: number;
  bus_id: number | null;
  driver_id: number | null;
  date: string;
  status: string;
  actual_start_time: string | null;
  actual_end_time: string | null;
  delay_minutes: number;
  last_incident_type: string | null;
};

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Public read endpoints ──────────────────────────────────────────────────────

export const fetchAllRoutes = () =>
  apiFetch<ApiRoute[]>('/api/v1/routes');

export const fetchLiveBuses = () =>
  apiFetch<ApiLiveBus[]>('/api/v1/buses/live');

export const fetchBus = (id: string) =>
  apiFetch<ApiLiveBus>(`/api/v1/buses/${id}`);

export const fetchRouteStops = (routeId: string | number) =>
  apiFetch<ApiRouteStops>(`/api/v1/routes/${routeId}/stops`);

export const fetchRouteTransitData = (routeId: string | number) =>
  apiFetch<ApiTransitRoute>(`/api/v1/routes/${routeId}/transit-data`);

export const fetchAllTransitData = () =>
  apiFetch<Record<string, ApiTransitRoute>>('/api/v1/routes/all-transit-data');

// ── Driver trip lifecycle ──────────────────────────────────────────────────────

export type ApiDriverInfo = { id: number; name: string; license_number: string };

export const driverLogin = (licenseNumber: string) =>
  apiFetch<ApiDriverInfo>(`/api/v1/driver/login?license_number=${encodeURIComponent(licenseNumber)}`, { method: 'POST' });

export const fetchDriverTripsToday = (driverId?: number) =>
  apiFetch<ApiPlannedTrip[]>(`/api/v1/driver/trips/today${driverId ? `?driver_id=${driverId}` : ''}`);

export const startTrip = (tripId: string) =>
  apiFetch<ApiPlannedTrip>(`/api/v1/driver/trips/${tripId}/start`, { method: 'POST' });

export const endTrip = (tripId: string) =>
  apiFetch<ApiPlannedTrip>(`/api/v1/driver/trips/${tripId}/end`, { method: 'POST' });

export const reportTripDelay = (tripId: string, delayMinutes: number) =>
  apiFetch<ApiPlannedTrip>(`/api/v1/driver/trips/${tripId}/report-delay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ delay_minutes: delayMinutes }),
  });

export const reportTripIncident = (tripId: string, incidentType: string, message?: string) =>
  apiFetch<ApiPlannedTrip>(`/api/v1/driver/trips/${tripId}/report-incident`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ incident_type: incidentType, message }),
  });
