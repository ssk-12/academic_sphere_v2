// app/api/check-access/route.ts (or any endpoint you prefer)

import { NextResponse } from 'next/server';
import { getClassWithAccessCheck, getEventWithAccessCheck } from '../../../actions/class';

export async function POST(request: Request) {
  const { classId, eventId, userId } = await request.json();

  try {
    // First, check access to class
    await getClassWithAccessCheck(classId, userId);

    // If eventId is provided, check access to the event
    if (eventId) {
      await getEventWithAccessCheck(classId, eventId, userId);
    }

    // If both checks pass, return success
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}
