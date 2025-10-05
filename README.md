# Password Manager MVP

A secure, full-stack password manager built with Next.js, MongoDB, and client-side encryption.

## Features

- **Secure Authentication**: Email/password signup and login with bcrypt hashing
- **Client-Side Encryption**: All vault data encrypted using Web Crypto API before sending to server
- **Password Generator**: Customizable password generation with various options
- **Vault Management**: Store, view, edit, and delete password entries
- **Search & Filter**: Quickly find vault items by title or username
- **Dark Theme**: Minimal, fast, and responsive dark UI
- **Auto-Clear Clipboard**: Copied passwords automatically clear after 15 seconds

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT with httpOnly cookies
- **Encryption**: Web Crypto API (AES-GCM with PBKDF2 key derivation)
- **Password Hashing**: bcrypt

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier works)

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env.local` file in the root directory:
   \`\`\`env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key_here
   \`\`\`

4. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

### MongoDB Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string and add it to `.env.local`
4. The app will automatically create the necessary collections

## Security Features

- **Client-Side Encryption**: Vault data is encrypted in the browser before transmission
- **Key Derivation**: Uses PBKDF2 with 100,000 iterations to derive encryption keys
- **Password Hashing**: bcrypt with 10 rounds for user passwords
- **JWT Authentication**: Secure httpOnly cookies prevent XSS attacks
- **No Plaintext Storage**: Server never sees unencrypted vault data

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing (use a long random string)

## Deployment

This app is ready to deploy to Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Project Structure

\`\`\`
├── app/
│   ├── api/          # API routes for auth and vault
│   ├── login/        # Login page
│   ├── signup/       # Signup page
│   ├── vault/        # Vault page (protected)
│   └── page.js       # Home page
├── components/       # React components
├── lib/             # Utilities (MongoDB, encryption, auth)
└── README.md
\`\`\`

## License

MIT
