import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const client = await clientPromise;
    const db = client.db("kalimirch");
    const reservationsCollection = db.collection("reservations");

    let query = {};
    if (email) {
      query = { guestEmail: email };
    }

    const list = await reservationsCollection.find(query).sort({ date: 1, timeSlot: 1 }).toArray();
    
    const reservations = list.map(item => ({
      id: item._id.toString(),
      guestName: item.guestName,
      guestEmail: item.guestEmail,
      guestPhone: item.guestPhone,
      guestCount: item.guestCount,
      date: item.date,
      timeSlot: item.timeSlot,
      tableNumber: item.tableNumber,
      status: item.status,
      specialNotes: item.specialNotes,
      createdAt: item.createdAt
    }));

    return NextResponse.json(reservations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const client = await clientPromise;
    const db = client.db("kalimirch");
    const reservationsCollection = db.collection("reservations");

    const newRes = {
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      guestCount: Number(data.guestCount),
      date: data.date,
      timeSlot: data.timeSlot,
      tableNumber: data.tableNumber,
      status: "PENDING",
      specialNotes: data.specialNotes || "",
      createdAt: new Date().toISOString()
    };

    const result = await reservationsCollection.insertOne(newRes);

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...newRes
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
