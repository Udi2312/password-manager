 # Password Manager MVP

A secure, privacy-first full-stack password manager built with Next.js, MongoDB, and client-side encryption, ensuring that only you can decrypt your data.

# Features

Secure Authentication – Email/password signup and login using bcrypt hashing

Client-Side Encryption – Vault data encrypted in the browser with the Web Crypto API before transmission

Password Generator – Generate strong passwords with customizable options

Vault Management – Add, view, edit, and delete password entries

Search & Filter – Quickly find credentials by title, username, or tags

Tags & Folders – Organize passwords using labels and nested folders (coming soon)

Dark Mode – Elegant, distraction-free UI with persistent theme preference

2FA (TOTP) – Optional Two-Factor Authentication for enhanced account security (planned feature)

Auto-Clear Clipboard – Passwords copied to clipboard automatically clear after 15 seconds

Export/Import (Encrypted) – Securely back up or restore vault data via encrypted local files (planned feature)

# Tech Stack
Layer	Technology
Frontend	Next.js 14 (App Router), React, Tailwind CSS
Backend	Next.js API Routes
Database	MongoDB (Atlas)
Authentication	JWT with httpOnly cookies
Encryption	Web Crypto API (AES-GCM + PBKDF2)
Password Hashing	bcrypt
⚙️ Getting Started
Prerequisites

Node.js v18+

A MongoDB Atlas account (Free Tier works perfectly)

Installation
# Clone the repository
git clone https://github.com/yourusername/password-manager.git
cd password-manager

# Install dependencies
npm install

Setup Environment Variables

Create a .env.local file in the root directory:

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key_here
NEXTAUTH_SECRET=your_next_auth_secret_here

Run Development Server
npm run dev


Visit → http://localhost:3000

# MongoDB Setup

Create a free cluster at MongoDB Atlas

Copy the connection string

Paste it into your .env.local file

The app auto-creates collections on first run

# Security Architecture
Layer	Security Measure
Client-Side Encryption	AES-GCM with PBKDF2 key derivation (100,000 iterations)
Password Hashing	bcrypt (10 rounds)
Authentication	JWT in httpOnly cookies
Clipboard Handling	Clears sensitive data automatically
Zero-Knowledge Design	Server never sees unencrypted vault data

# Environment Variables
Variable	Description
MONGODB_URI	MongoDB connection string
JWT_SECRET	Secret key for signing JWT tokens
NEXTAUTH_SECRET	Optional – used if integrating with NextAuth
ENCRYPTION_SALT	Optional – additional salt for key derivation

# Deployment (Vercel)

Push your repo to GitHub

Import it into Vercel

Add your .env variables in the Vercel dashboard

Click Deploy

# Project Structure
├── app/
│   ├── api/              # API routes (auth, vault, etc.)
│   ├── login/            # Login page
│   ├── signup/           # Signup page
│   ├── vault/            # Protected vault dashboard
│   └── page.js           # Home page
├── components/           # Reusable React components
├── lib/                  # Utilities (DB, crypto, JWT helpers)
└── README.md

# License

MIT License – Free to use and modify.
Built with ❤️ for privacy-focused developers.