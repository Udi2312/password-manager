// Vault Item Card - Display individual vault entry with actions
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Eye, EyeOff, Edit, Trash2, ExternalLink, Check } from "lucide-react"

export default function VaultItemCard({ item, onEdit, onDelete }) {
  const [showPassword, setShowPassword] = useState(false)
  const [copiedField, setCopiedField] = useState(null)

  // Copy field to clipboard with auto-clear after 15 seconds
  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)

      // Auto-clear clipboard after 15 seconds
      setTimeout(async () => {
        await navigator.clipboard.writeText("")
        console.log("[v0] Clipboard cleared after 15 seconds")
      }, 15000)

      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="border border-border rounded-lg p-4 space-y-3 hover:border-primary/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{item.title}</h3>
          {item.username && <p className="text-sm text-muted-foreground truncate">{item.username}</p>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button size="icon" variant="ghost" onClick={() => onEdit(item)} className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(item)}
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Password Field */}
      {item.password && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted border border-border rounded px-3 py-2 font-mono text-sm overflow-hidden">
              {showPassword ? item.password : "••••••••••••"}
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setShowPassword(!showPassword)}
              className="h-9 w-9 shrink-0 bg-transparent"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => copyToClipboard(item.password, "password")}
              className="h-9 w-9 shrink-0 bg-transparent"
            >
              {copiedField === "password" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}

      {/* URL Field */}
      {item.url && (
        <div className="flex items-center gap-2 text-sm">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-primary hover:underline truncate flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3 shrink-0" />
            <span className="truncate">{item.url}</span>
          </a>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => copyToClipboard(item.url, "url")}
            className="h-7 w-7 shrink-0"
          >
            {copiedField === "url" ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      )}

      {/* Notes Field */}
      {item.notes && (
        <div className="pt-2 border-t border-border">
          <p className="text-sm text-muted-foreground line-clamp-2">{item.notes}</p>
        </div>
      )}
    </div>
  )
}
