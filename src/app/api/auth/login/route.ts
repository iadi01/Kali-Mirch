import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("kalimirch");
    const usersCollection = db.collection("users");

    // Automatically seed default admin if none exists
    const adminExists = await usersCollection.findOne({ role: "ADMIN" });
    if (!adminExists) {
      await usersCollection.insertOne({
        name: "Admin Kali Mirch",
        email: "admin@kalimirch.com",
        password: "wQ59nWAdrkB8dEzK",
        role: "ADMIN",
        loyaltyPoints: 1000,
        createdAt: new Date().toISOString()
      });
    }

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found. Please register first." },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || "CUSTOMER",
      loyaltyPoints: user.loyaltyPoints || 0
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Authentication failed" },
      { status: 500 }
    );
  }
}
