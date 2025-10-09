import { NextResponse } from "next/server"
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
    const users = db.collection("users")

    
    const userData = await users.findOne({ email: user.email }, { projection: { verificationToken: 1 } })

    return NextResponse.json({ verificationToken: userData?.verificationToken || null }, { status: 200 })
  } catch (error) {
    console.error("Fetch verification token error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


export async function POST(request) {
  try {
    const user = await getUserFromRequest(request)

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { verificationToken } = await request.json()

    if (!verificationToken) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("passwordmanager")
    const users = db.collection("users")

    
    await users.updateOne({ email: user.email }, { $set: { verificationToken, updatedAt: new Date() } })

    return NextResponse.json({ message: "Verification token stored" }, { status: 200 })
  } catch (error) {
    console.error("Store verification token error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
