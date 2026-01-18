'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Copy, Check, Moon, Sun } from 'lucide-react'
import { generateCognexKey } from '@/lib/utils'

export default function Home() {
  const [programReference, setProgramReference] = useState('')
  const [programKey, setProgramKey] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleGenerate = () => {
    try {
      setError('')
      const key = generateCognexKey(programReference)
      setProgramKey(key)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid input')
      setProgramKey('')
    }
  }

  const handleCopy = async () => {
    if (programKey) {
      await navigator.clipboard.writeText(programKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProgramReference(e.target.value)
    setError('')
    // Auto-generate on valid input
    if (e.target.value.length === 8) {
      try {
        const key = generateCognexKey(e.target.value)
        setProgramKey(key)
      } catch {
        setProgramKey('')
      }
    } else {
      setProgramKey('')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-500">
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-full hover:opacity-90 transition-all duration-300"
        >
          {darkMode ? <Sun className="h-5 w-5 text-slate-600 dark:text-slate-300" /> : <Moon className="h-5 w-5 text-slate-600 dark:text-slate-300" />}
        </Button>
      </div>
      <Card className="w-full max-w-md shadow-2xl animate-slide-in">
        <CardHeader className="border-b">
          <CardTitle className="text-3xl font-bold text-center">
            Cognex Key Generator
          </CardTitle>
          <CardDescription className="text-center">
            Enter an 8-character hexadecimal program reference to generate the offline program key
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="programReference" className="text-sm font-medium">
              Offline-Program Reference
            </label>
            <Input
              id="programReference"
              type="text"
              placeholder="e.g., bd0710c1"
              value={programReference}
              onChange={handleInputChange}
              maxLength={8}
              className="font-mono uppercase transition-all duration-300"
              style={{ textTransform: 'lowercase' }}
            />
            {error && <p className="text-sm text-red-500 animate-slide-in">{error}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="programKey" className="text-sm font-medium">
              Offline-Program Key
            </label>
            <div className="flex gap-2">
              <Input
                id="programKey"
                type="text"
                value={programKey}
                readOnly
                placeholder="Generated key will appear here"
                className="font-mono bg-muted transition-all duration-300"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                disabled={!programKey}
                className={`shrink-0 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 ${copied ? 'bg-slate-800 text-white' : ''}`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="pt-4 text-xs text-muted-foreground text-center border-t mt-6">
            <p className="font-mono">Formula: y = 0xFA266148 - x (mod 2³²)</p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
