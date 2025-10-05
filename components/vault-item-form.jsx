// Vault Item Form - Add/Edit vault entries with encryption
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import PasswordGenerator from "@/components/password-generator"

export default function VaultItemForm({ item, onSave, onCancel, encryptionKey }) {
  const [title, setTitle] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [url, setUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [showGenerator, setShowGenerator] = useState(false)

  // Populate form if editing existing item
  useEffect(() => {
    if (item) {
      setTitle(item.title || "")
      setUsername(item.username || "")
      setPassword(item.password || "")
      setUrl(item.url || "")
      setNotes(item.notes || "")
    }
  }, [item])

  // Handle form submission with encryption
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Prepare data to encrypt
      const vaultData = {
        title,
        username,
        password,
        url,
        notes,
      }

      // Call parent save handler with data
      await onSave(vaultData)
    } catch (error) {
      console.error("Save error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Gmail, Facebook, Work Email"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">Username / Email</Label>
        <Input
          id="username"
          type="text"
          placeholder="username@example.com"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowGenerator(!showGenerator)}
            className="h-auto py-1 text-xs"
          >
            {showGenerator ? "Hide" : "Generate"}
          </Button>
        </div>

        {showGenerator ? (
          <div className="border border-border rounded-lg p-4 space-y-4">
            <PasswordGenerator onPasswordGenerated={(pwd) => setPassword(pwd)} />
          </div>
        ) : (
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-background"
          />
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Website URL</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional notes or security questions"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="bg-background resize-none"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="bg-transparent">
          Cancel
        </Button>
      </div>
    </form>
  )
}
