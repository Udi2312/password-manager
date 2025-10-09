
"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield } from "lucide-react"
import PasswordGenerator from "@/components/password-generator"

export default function GeneratorPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold">Password Generator</h1>
            </div>
          </div>
        </div>
      </header>

     
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Generate Strong Passwords</h2>
            <p className="text-muted-foreground">
              Create secure, random passwords with customizable options. Copied passwords automatically clear from your
              clipboard after 15 seconds.
            </p>
          </div>

          <div className="border border-border rounded-lg p-6">
            <PasswordGenerator />
          </div>

        
          <div className="border border-border rounded-lg p-6 space-y-4">
            <h3 className="font-semibold">Password Security Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Use at least 12 characters for better security</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Include a mix of uppercase, lowercase, numbers, and symbols</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Never reuse passwords across different accounts</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Change passwords regularly, especially for sensitive accounts</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Avoid using personal information in passwords</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}
