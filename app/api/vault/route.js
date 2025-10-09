
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { getUserFromRequest } from "@/lib/auth"


export async function GET(request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("passwordmanager")
    const vaultItems = db.collection("vaultitems")

    
    const items = await vaultItems.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ items }, { status: 200 })
  } catch (error) {
    console.error("Fetch vault items error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


export async function POST(request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { encryptedData } = await request.json()

    if (!encryptedData) {
      return NextResponse.json({ error: "Encrypted data is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("passwordmanager")
    const vaultItems = db.collection("vaultitems")

    
    const result = await vaultItems.insertOne({
      userId: user.userId,
      encryptedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ message: "Item created", itemId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Create vault item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


export async function PUT(request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { itemId, encryptedData } = await request.json()

    if (!itemId || !encryptedData) {
      return NextResponse.json({ error: "Item ID and encrypted data are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("passwordmanager")
    const vaultItems = db.collection("vaultitems")

    
    const result = await vaultItems.updateOne(
      { _id: new ObjectId(itemId), userId: user.userId },
      { $set: { encryptedData, updatedAt: new Date() } },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Item updated" }, { status: 200 })
  } catch (error) {
    console.error("Update vault item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


export async function DELETE(request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const itemId = searchParams.get("itemId")

    if (!itemId) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("passwordmanager")
    const vaultItems = db.collection("vaultitems")

    
    const result = await vaultItems.deleteOne({ _id: new ObjectId(itemId), userId: user.userId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Item deleted" }, { status: 200 })
  } catch (error) {
    console.error("Delete vault item error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
