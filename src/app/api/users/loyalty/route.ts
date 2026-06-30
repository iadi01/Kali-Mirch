import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("kalimirch");
    const usersCollection = db.collection("users");

    let user = await usersCollection.findOne({ phone });
    if (!user) {
      // Create a guest profile for tracking loyalty points
      const newUser = {
        phone,
        name: "Guest Diner",
        role: "CUSTOMER",
        loyaltyPoints: 0,
        createdAt: new Date().toISOString()
      };
      const result = await usersCollection.insertOne(newUser);
      user = { _id: result.insertedId, ...newUser };
    }

    return NextResponse.json({
      phone: user.phone,
      name: user.name,
      loyaltyPoints: user.loyaltyPoints || 0
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
