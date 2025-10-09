// Signup API route - Creates new user with hashed password
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"
import { createToken } from "@/lib/auth"

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }

    
    const client = await clientPromise
    const db = client.db("passwordmanager")
    const users = db.collection("users")

    
    const existingUser = await users.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    
    const hashedPassword = await bcrypt.hash(password, 10)

    
    const result = await users.insertOne({
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    
    const token = await createToken({
      userId: result.insertedId.toString(),
      email,
    })

    
    const response = NextResponse.json(
      { message: "User created successfully", userId: result.insertedId },
      { status: 201 },
    )

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, 
    })

    return response
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
