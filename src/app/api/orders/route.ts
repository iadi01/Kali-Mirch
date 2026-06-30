import { NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    const email = searchParams.get("email");

    const client = await clientPromise;
    const db = client.db("kalimirch");
    const ordersCollection = db.collection("orders");

    let query = {};
    if (phone) {
      query = { phone: phone };
    } else if (email) {
      // Find orders matching guest email or matching user phone (we can also store user email directly)
      query = { customerEmail: email };
    }

    const list = await ordersCollection.find(query).sort({ createdAt: -1 }).toArray();
    
    const orders = list.map(item => ({
      id: item._id.toString(),
      customerName: item.customerName,
      phone: item.phone,
      address: item.address,
      tableNumber: item.tableNumber || null,
      type: item.type,
      status: item.status,
      totalAmount: item.totalAmount,
      items: item.items,
      couponCode: item.couponCode,
      createdAt: item.createdAt
    }));

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const client = await clientPromise;
    const db = client.db("kalimirch");
    const ordersCollection = db.collection("orders");
    const usersCollection = db.collection("users");

    // Calculate loyalty points earned (1 point on every ₹10 spent)
    const pointsEarned = Math.floor(Number(data.totalAmount) / 10);

    const newOrder = {
      customerName: data.customerName,
      customerEmail: data.customerEmail || null,
      phone: data.phone,
      address: data.address || null,
      tableNumber: data.tableNumber || null,
      type: data.type,
      status: "PLACED",
      totalAmount: Number(data.totalAmount),
      items: data.items,
      couponCode: data.couponCode || null,
      redeemedPoints: Number(data.redeemedPoints) || 0,
      pointsEarned: pointsEarned,
      createdAt: new Date().toISOString()
    };

    const result = await ordersCollection.insertOne(newOrder);

    // Update loyalty points in user collection
    const redeemed = Number(data.redeemedPoints) || 0;
    const netPointsChange = pointsEarned - redeemed;

    const query = data.customerEmail ? { email: data.customerEmail } : { phone: data.phone };
    await usersCollection.updateOne(
      query,
      { $inc: { loyaltyPoints: netPointsChange } },
      { upsert: true }
    );

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...newOrder
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
