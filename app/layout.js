import "./globals.css"

export const metadata = {
  title: "SecureVault - Password Manager",
  description: "Secure password manager with client-side encryption",
    generator: 'Udit Bansal'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">{children}</body>
    </html>
  )
}
