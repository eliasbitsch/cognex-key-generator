import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates Cognex key from program reference
 * Formula: y = C - x (mod 2^32)
 * where C = 0xFA266148
 */
export function generateCognexKey(hexInput: string): string {
  try {
    // Remove any whitespace and convert to lowercase
    const cleanInput = hexInput.trim().toLowerCase()
    
    // Validate hex input (should be 8 characters)
    if (!/^[0-9a-f]{8}$/i.test(cleanInput)) {
      throw new Error("Invalid input: must be 8 hexadecimal characters")
    }
    
    const C = 0xFA266148
    const x = parseInt(cleanInput, 16)
    const y = (C - x) & 0xFFFFFFFF
    
    // Return as 8-character hex string
    return y.toString(16).padStart(8, '0')
  } catch (error) {
    throw error
  }
}
