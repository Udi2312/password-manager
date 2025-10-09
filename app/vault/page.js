
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Shield, Plus, Loader2, LogOut, Key, Search, X } from "lucide-react"
import VaultItemCard from "@/components/vault-item-card"
import VaultItemForm from "@/components/vault-item-form"
import { deriveKey, encryptData, decryptData, createVerificationToken, verifyMasterPassword } from "@/lib/encryption"

export default function VaultPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [encryptionKey, setEncryptionKey] = useState(null)
  const [masterPassword, setMasterPassword] = useState("")
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(true)
  const [passwordError, setPasswordError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [unlocking, setUnlocking] = useState(false)

  useEffect(() => {
    setMounted(true)

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          router.push("/login")
          return
        }

        if (typeof window !== "undefined") {
          const storedKey = sessionStorage.getItem("encryptionKey")
          if (storedKey) {
            const keyData = JSON.parse(storedKey)
            const cryptoKey = await crypto.subtle.importKey("raw", new Uint8Array(keyData), { name: "AES-GCM" }, true, [
              "encrypt",
              "decrypt",
            ])
            setEncryptionKey(cryptoKey)
            setShowPasswordPrompt(false)
            await fetchVaultItems(cryptoKey)
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleUnlock = async (e) => {
    e.preventDefault()
    setPasswordError("")
    setUnlocking(true)

    try {
      if (typeof window === "undefined") return

      const userEmail = sessionStorage.getItem("userEmail")
      if (!userEmail) {
        router.push("/login")
        return
      }

      const key = await deriveKey(masterPassword, userEmail)

      const verificationResponse = await fetch("/api/vault/verification")

      if (verificationResponse.status === 401) {
        router.push("/login")
        return
      }

      if (!verificationResponse.ok) {
        throw new Error(`Verification API returned ${verificationResponse.status}`)
      }

      const { verificationToken } = await verificationResponse.json()

      if (!verificationToken) {
        const newToken = await createVerificationToken(key)
        const storeResponse = await fetch("/api/vault/verification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ verificationToken: newToken }),
        })

        if (!storeResponse.ok) {
          throw new Error(`Failed to store verification token: ${storeResponse.status}`)
        }

        const exportedKey = await crypto.subtle.exportKey("raw", key)
        sessionStorage.setItem("encryptionKey", JSON.stringify(Array.from(new Uint8Array(exportedKey))))

        setEncryptionKey(key)
        setShowPasswordPrompt(false)
        await fetchVaultItems(key)
      } else {
        const isValid = await verifyMasterPassword(verificationToken, key)

        if (!isValid) {
          setPasswordError("Incorrect master password. Please try again.")
          setUnlocking(false)
          return
        }

        const exportedKey = await crypto.subtle.exportKey("raw", key)
        sessionStorage.setItem("encryptionKey", JSON.stringify(Array.from(new Uint8Array(exportedKey))))

        setEncryptionKey(key)
        setShowPasswordPrompt(false)
        await fetchVaultItems(key)
      }
    } catch (error) {
      console.error("Unlock error:", error)
      setPasswordError("Failed to unlock vault. Please try again.")
    } finally {
      setUnlocking(false)
    }
  }

  const fetchVaultItems = async (key) => {
    try {
      const response = await fetch("/api/vault")

      if (response.status === 401) {
        router.push("/login")
        return
      }

      if (!response.ok) {
        throw new Error(`Vault API returned ${response.status}`)
      }

      const data = await response.json()

      const decryptedItems = await Promise.all(
        data.items.map(async (item) => {
          try {
            const decryptedData = await decryptData(item.encryptedData, key)
            return {
              _id: item._id,
              ...JSON.parse(decryptedData),
            }
          } catch (error) {
            console.error("Decryption error for item:", item._id, error)
            return null
          }
        }),
      )

      const validItems = decryptedItems.filter((item) => item !== null)
      setItems(validItems)
      setLoading(false)
    } catch (error) {
      console.error("Fetch vault items error:", error)
      setLoading(false)
    }
  }

  const handleSaveItem = async (vaultData) => {
    try {
      const dataString = JSON.stringify(vaultData)
      const encryptedData = await encryptData(dataString, encryptionKey)

      if (editingItem) {
        const response = await fetch("/api/vault", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemId: editingItem._id,
            encryptedData,
          }),
        })

        if (response.ok) {
          setItems(items.map((item) => (item._id === editingItem._id ? { _id: editingItem._id, ...vaultData } : item)))
          setShowForm(false)
          setEditingItem(null)
        }
      } else {
        const response = await fetch("/api/vault", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ encryptedData }),
        })

        if (response.ok) {
          const data = await response.json()
          setItems([{ _id: data.itemId, ...vaultData }, ...items])
          setShowForm(false)
        }
      }
    } catch (error) {
      console.error("Save error:", error)
    }
  }

  const handleDeleteItem = async (item) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/vault?itemId=${item._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setItems(items.filter((i) => i._id !== item._id))
      }
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("userEmail")
      sessionStorage.removeItem("encryptionKey")
    }
    router.push("/login")
  }

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true

    const query = searchQuery.toLowerCase()
    return (
      item.title?.toLowerCase().includes(query) ||
      item.username?.toLowerCase().includes(query) ||
      item.url?.toLowerCase().includes(query)
    )
  })

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (showPasswordPrompt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">SecureVault</h1>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Unlock Your Vault</h2>
            <p className="text-muted-foreground">Enter your master password to decrypt your vault</p>
          </div>

          <div className="border border-border rounded-lg p-8">
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="space-y-2">
                <input
                  type="password"
                  placeholder="Master password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  required
                  autoFocus
                  disabled={unlocking}
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {passwordError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md p-3">
                  {passwordError}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={unlocking}>
                {unlocking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Unlock Vault
                  </>
                )}
              </Button>
            </form>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={handleLogout} className="text-sm">
              Sign out
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold">My Vault</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowForm(true)} disabled={showForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            <Button variant="outline" onClick={handleLogout} className="bg-transparent">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {showForm && (
          <div className="mb-8 border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">{editingItem ? "Edit Item" : "Add New Item"}</h2>
            <VaultItemForm
              item={editingItem}
              onSave={handleSaveItem}
              onCancel={() => {
                setShowForm(false)
                setEditingItem(null)
              }}
              encryptionKey={encryptionKey}
            />
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by title, username, or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 bg-background"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Shield className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Your vault is empty</h3>
              <p className="text-muted-foreground">Add your first password to get started</p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Item
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {searchQuery ? (
                  <>
                    {filteredItems.length} {filteredItems.length === 1 ? "result" : "results"} found
                  </>
                ) : (
                  <>
                    {items.length} {items.length === 1 ? "item" : "items"} in your vault
                  </>
                )}
              </p>
              {searchQuery && (
                <Button variant="ghost" size="sm" onClick={() => setSearchQuery("")} className="h-auto py-1">
                  Clear search
                </Button>
              )}
            </div>

            {filteredItems.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-semibold">No results found</h3>
                <p className="text-sm text-muted-foreground">Try a different search term</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredItems.map((item) => (
                  <VaultItemCard
                    key={item._id}
                    item={item}
                    onEdit={(item) => {
                      setEditingItem(item)
                      setShowForm(true)
                    }}
                    onDelete={handleDeleteItem}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
