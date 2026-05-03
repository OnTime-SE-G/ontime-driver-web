import { NextRequest, NextResponse } from 'next/server';

interface DriverSession {
  driverId: string;
  routeId: number;
  busId: string;
  startedAt: string;
}

// Module-level store — persists for the lifetime of the Next.js server process.
let activeSession: DriverSession | null = null;

export async function GET() {
  return NextResponse.json(activeSession);
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Partial<DriverSession>;
  if (!body.driverId || !body.routeId || !body.busId) {
    return NextResponse.json({ error: 'driverId, routeId and busId are required' }, { status: 400 });
  }
  activeSession = {
    driverId: body.driverId,
    routeId: body.routeId,
    busId: body.busId,
    startedAt: new Date().toISOString(),
  };
  return NextResponse.json(activeSession, { status: 201 });
}

export async function DELETE() {
  activeSession = null;
  return NextResponse.json({ message: 'Session cleared' });
}
