// Password Generator Component - Generates secure passwords with customizable options
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, RefreshCw, Check } from "lucide-react"

export default function PasswordGenerator({ onPasswordGenerated }) {
  const [password, setPassword] = useState("")
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [copied, setCopied] = useState(false)
  const [copyTimeout, setCopyTimeout] = useState(null)

  // Character sets for password generation
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const lowercase = "abcdefghijklmnopqrstuvwxyz"
  const numbers = "0123456789"
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"

  // Similar-looking characters to exclude
  const similarChars = "il1Lo0O"

  // Generate password based on selected options
  const generatePassword = () => {
    let charset = ""
    let generatedPassword = ""

    // Build character set based on options
    if (includeUppercase) charset += uppercase
    if (includeLowercase) charset += lowercase
    if (includeNumbers) charset += numbers
    if (includeSymbols) charset += symbols

    // Remove similar characters if option is enabled
    if (excludeSimilar) {
      charset = charset
        .split("")
        .filter((char) => !similarChars.includes(char))
        .join("")
    }

    // Ensure at least one character set is selected
    if (charset.length === 0) {
      charset = lowercase // Fallback to lowercase
    }

    // Generate random password using crypto.getRandomValues for security
    const array = new Uint32Array(length)
    crypto.getRandomValues(array)

    for (let i = 0; i < length; i++) {
      generatedPassword += charset[array[i] % charset.length]
    }

    setPassword(generatedPassword)

    // Call callback if provided (for vault form)
    if (onPasswordGenerated) {
      onPasswordGenerated(generatedPassword)
    }
  }

  // Generate password on component mount and when options change
  useEffect(() => {
    generatePassword()
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar])

  // Copy password to clipboard with auto-clear after 15 seconds
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)

      // Clear any existing timeout
      if (copyTimeout) {
        clearTimeout(copyTimeout)
      }

      // Auto-clear clipboard after 15 seconds
      const timeout = setTimeout(async () => {
        await navigator.clipboard.writeText("")
        setCopied(false)
        console.log("[v0] Clipboard cleared after 15 seconds")
      }, 15000)

      setCopyTimeout(timeout)

      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  // Calculate password strength
  const calculateStrength = () => {
    let strength = 0
    if (includeUppercase) strength++
    if (includeLowercase) strength++
    if (includeNumbers) strength++
    if (includeSymbols) strength++
    if (length >= 12) strength++
    if (length >= 16) strength++
    return Math.min(strength, 5)
  }

  const strength = calculateStrength()

  return (
    <div className="space-y-6">
      {/* Generated Password Display */}
      <div className="space-y-3">
        <Label>Generated Password</Label>
        <div className="flex gap-2">
          <div className="flex-1 bg-muted border border-border rounded-lg px-4 py-3 font-mono text-sm break-all">
            {password || "Click generate to create a password"}
          </div>
          <Button size="icon" variant="outline" onClick={copyToClipboard} className="shrink-0 bg-transparent">
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button size="icon" variant="outline" onClick={generatePassword} className="shrink-0 bg-transparent">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Password Strength Indicator */}
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-1 flex-1 rounded-full transition-colors ${
                level <= strength
                  ? strength <= 2
                    ? "bg-destructive"
                    : strength <= 3
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {copied ? "Copied! Will auto-clear in 15 seconds" : "Click copy to copy password"}
        </p>
      </div>

      {/* Length Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Length</Label>
          <span className="text-sm font-medium">{length}</span>
        </div>
        <Slider value={[length]} onValueChange={(value) => setLength(value[0])} min={8} max={64} step={1} />
      </div>

      {/* Character Options */}
      <div className="space-y-3">
        <Label>Character Types</Label>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="uppercase"
              checked={includeUppercase}
              onCheckedChange={setIncludeUppercase}
              disabled={!includeLowercase && !includeNumbers && !includeSymbols}
            />
            <label
              htmlFor="uppercase"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Uppercase Letters (A-Z)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="lowercase"
              checked={includeLowercase}
              onCheckedChange={setIncludeLowercase}
              disabled={!includeUppercase && !includeNumbers && !includeSymbols}
            />
            <label
              htmlFor="lowercase"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Lowercase Letters (a-z)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="numbers"
              checked={includeNumbers}
              onCheckedChange={setIncludeNumbers}
              disabled={!includeUppercase && !includeLowercase && !includeSymbols}
            />
            <label
              htmlFor="numbers"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Numbers (0-9)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="symbols"
              checked={includeSymbols}
              onCheckedChange={setIncludeSymbols}
              disabled={!includeUppercase && !includeLowercase && !includeNumbers}
            />
            <label
              htmlFor="symbols"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Symbols (!@#$%^&*)
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="exclude-similar" checked={excludeSimilar} onCheckedChange={setExcludeSimilar} />
            <label
              htmlFor="exclude-similar"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Exclude Similar Characters (i, l, 1, L, o, 0, O)
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
