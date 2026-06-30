import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("kalimirch");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email address" },
        { status: 409 }
      );
    }

    // Default registration role is CUSTOMER.
    // If you need to make this user an ADMIN, update the role value to "ADMIN" directly inside MongoDB.
    const result = await usersCollection.insertOne({
      name,
      email,
      password,
      role: "CUSTOMER",
      loyaltyPoints: 50, // Register welcome points
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({
      id: result.insertedId.toString(),
      name,
      email,
      role: "CUSTOMER",
      loyaltyPoints: 50
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Registration failed" },
      { status: 500 }
    );
  }
}
