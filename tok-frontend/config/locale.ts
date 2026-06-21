'use server'

import { cookies, headers } from 'next/headers'
import fs from 'fs'
import path from 'path'

// Available languages automatically detected by reading /messages
const MESSAGES_DIR = path.join(process.cwd(), 'messages')
const AVAILABLE_LOCALES = fs.readdirSync(MESSAGES_DIR)
  .map(file => file.replace('.json', '').toLowerCase())

const DEFAULT_LOCALE = 'en'

export async function getUserLocale() {
  // 1. Check Cookie
  const cookieStore = await cookies()
  const saved = cookieStore.get('NEXT_LOCALE')?.value
  if (saved && AVAILABLE_LOCALES.includes(saved)) {
    return saved
  }

  // 2. Check accept-language Header
  const h = await headers()
  const accept = h.get('accept-language')

  if (accept) {
    // Example: "es-ES,es;q=0.9,en-US;q=0.8,fr;q=0.7"
    const parts = accept.split(',')

    for (const p of parts) {
      const lang = p.split(';')[0].trim().toLowerCase()

      // lang → "es-es" → base "es"
      const base = lang.split('-')[0]

      // If full language matches:
      if (AVAILABLE_LOCALES.includes(lang)) return lang

      // If base language matches:
      if (AVAILABLE_LOCALES.includes(base)) return base
    }
  }

  // 3. Final Fallback
  return DEFAULT_LOCALE
}

export async function getAppMessages(locale: string) {
  try {
    return (await import(`../messages/${locale}.json`)).default
  } catch {
    return (await import(`../messages/${DEFAULT_LOCALE}.json`)).default
  }
}