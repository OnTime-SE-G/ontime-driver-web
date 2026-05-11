const BASE = process.env.NEXT_PUBLIC_API_URL!;

export type Trip = {
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

export type Driver = {
  id: number;
  name: string;
  license_number: string;
  phone: string | null;
  auth_user_id: string | null;
  username: string | null;
  is_active: boolean;
};

export type Schedule = {
  id: number;
  route_id: number;
  scheduled_time: string;
  day_of_week: number;
};

export type Route = {
  id: number;
  name: string;
  route_number: string | null;
};

export async function fetchMe(token: string): Promise<Driver> {
  const res = await fetch(`${BASE}/api/v1/driver/me`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch driver profile: ${res.status}`);
  return res.json();
}

export async function fetchTodayTrips(token: string, driverId: number): Promise<Trip[]> {
  const res = await fetch(`${BASE}/api/v1/driver/trips/today?driver_id=${driverId}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchDrivers(): Promise<Driver[]> {
  const res = await fetch(`${BASE}/api/v1/admin/fleet/drivers`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchSchedules(): Promise<Schedule[]> {
  const res = await fetch(`${BASE}/api/v1/admin/fleet/schedules`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchRoutes(): Promise<Route[]> {
  const res = await fetch(`${BASE}/api/v1/routes`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export async function startTrip(tripId: string, token: string): Promise<Trip> {
  const res = await fetch(`${BASE}/api/v1/driver/trips/${tripId}/start`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function endTrip(tripId: string, token: string): Promise<Trip> {
  const res = await fetch(`${BASE}/api/v1/driver/trips/${tripId}/end`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function reportDelay(tripId: string, delayMinutes: number, token: string): Promise<Trip> {
  const res = await fetch(`${BASE}/api/v1/driver/trips/${tripId}/report-delay`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ delay_minutes: delayMinutes }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function reportIncident(
  tripId: string,
  incidentType: string,
  token: string,
  message?: string,
): Promise<Trip> {
  const res = await fetch(`${BASE}/api/v1/driver/trips/${tripId}/report-incident`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ incident_type: incidentType, message }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
