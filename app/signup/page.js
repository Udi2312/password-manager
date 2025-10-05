// Signup page - New user registration form
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Loader2, Check, X } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Password strength indicators
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }

  const passwordStrength = Object.values(passwordChecks).filter(Boolean).length

  // Handle signup form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    // Validate password strength
    if (!passwordChecks.length) {
      setError("Password must be at least 8 characters")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Signup failed")
        setLoading(false)
        return
      }

      // Store email in sessionStorage for encryption key derivation
      sessionStorage.setItem("userEmail", email)

      // Redirect to vault
      router.push("/vault")
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">SecureVault</h1>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
          <p className="text-muted-foreground">Start securing your passwords today</p>
        </div>

        {/* Signup Form */}
        <div className="border border-border rounded-lg p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Master Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="bg-background"
              />

              {/* Password strength indicator */}
              {password && (
                <div className="space-y-2 mt-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength
                            ? passwordStrength <= 2
                              ? "bg-destructive"
                              : passwordStrength <= 3
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="space-y-1 text-xs">
                    <PasswordCheck met={passwordChecks.length} text="At least 8 characters" />
                    <PasswordCheck met={passwordChecks.uppercase} text="One uppercase letter" />
                    <PasswordCheck met={passwordChecks.lowercase} text="One lowercase letter" />
                    <PasswordCheck met={passwordChecks.number} text="One number" />
                    <PasswordCheck met={passwordChecks.special} text="One special character" />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
                className="bg-background"
              />
            </div>

            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md p-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="border border-border rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-sm">Important Security Notice</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your master password is used to encrypt all your data. We cannot recover it if you forget it. Please store
            it safely.
          </p>
        </div>
      </div>
    </div>
  )
}

// Helper component for password strength checks
function PasswordCheck({ met, text }) {
  return (
    <div className="flex items-center gap-2">
      {met ? <Check className="h-3 w-3 text-green-500" /> : <X className="h-3 w-3 text-muted-foreground" />}
      <span className={met ? "text-green-500" : "text-muted-foreground"}>{text}</span>
    </div>
  )
}
