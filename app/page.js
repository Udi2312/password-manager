
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Key, Eye } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
    
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">SecureVault</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

    
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl font-bold tracking-tight text-balance">Your passwords, encrypted and secure</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Client-side encryption ensures your data stays private. Generate strong passwords, store them safely, and
              access them anywhere.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="text-base">
                Create Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="text-base bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>

         
          <div className="grid md:grid-cols-3 gap-6 mt-16 text-left">
            <div className="border border-border rounded-lg p-6 space-y-3">
              <Lock className="h-8 w-8 text-primary" />
              <h3 className="font-semibold text-lg">End-to-End Encryption</h3>
              <p className="text-sm text-muted-foreground">
                Your data is encrypted in your browser before it ever reaches our servers. We never see your passwords.
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 space-y-3">
              <Key className="h-8 w-8 text-primary" />
              <h3 className="font-semibold text-lg">Password Generator</h3>
              <p className="text-sm text-muted-foreground">
                Create strong, unique passwords with customizable options. Never reuse passwords again.
              </p>
            </div>

            <div className="border border-border rounded-lg p-6 space-y-3">
              <Eye className="h-8 w-8 text-primary" />
              <h3 className="font-semibold text-lg">Easy Access</h3>
              <p className="text-sm text-muted-foreground">
                Access your vault from anywhere. Search, filter, and manage your passwords with ease.
              </p>
            </div>
          </div>
        </div>
      </main>

    
      <footer className="border-t border-border py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built with Next.js, MongoDB, and Web Crypto API</p>
        </div>
      </footer>
    </div>
  )
}
