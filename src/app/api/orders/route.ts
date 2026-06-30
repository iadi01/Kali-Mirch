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
      createdAt: new Date().toISOString()
    };

    const result = await ordersCollection.insertOne(newOrder);

    // Calculate loyalty points (10% of subtotal)
    const pointsEarned = Math.floor(newOrder.totalAmount * 0.1);
    
    if (data.customerEmail) {
      await usersCollection.updateOne(
        { email: data.customerEmail },
        { $inc: { loyaltyPoints: pointsEarned } }
      );
    } else {
      await usersCollection.updateOne(
        { phone: data.phone },
        { $inc: { loyaltyPoints: pointsEarned } }
      );
    }

    return NextResponse.json({
      id: result.insertedId.toString(),
      ...newOrder
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
