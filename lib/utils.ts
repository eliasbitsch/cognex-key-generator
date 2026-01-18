import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const BASE = 0x721440c4

// Single-bit XOR table (for bits 0-31)
const SINGLE_XOR = [
  0x0000000c, 0x0000000c, 0x00000000, 0x00000020,  // bits 0-3
  0x00000020, 0x000001c0, 0x00000080, 0x00000000,  // bits 4-7
  0x00000400, 0x00000400, 0x00002000, 0x00002000,  // bits 8-11
  0x00002000, 0x00008000, 0x00008000, 0x00010000,  // bits 12-15
  0x00020000, 0x00080000, 0x00080000, 0x00300000,  // bits 16-19
  0x00000000, 0x00800000, 0x00800000, 0x01000000,  // bits 20-23
  0x00000000, 0x00000000, 0x08000000, 0x20000000,  // bits 24-27
  0x20000000, 0x00000000, 0x80000000, 0x00000000,  // bits 28-31
]

/**
 * Generates Cognex key from program reference
 * Formula: y = C - x (mod 2^32)
 * where C = BASE ^ xor_val
 * xor_val is computed from linear and interaction terms
 */
export function generateCognexKey(hexInput: string): string {
  try {
    // Remove any whitespace and convert to lowercase
    const cleanInput = hexInput.trim().toLowerCase()
    
    // Validate hex input (should be 8 characters)
    if (!/^[0-9a-f]{8}$/i.test(cleanInput)) {
      throw new Error("Invalid input: must be 8 hexadecimal characters")
    }
    
    const x = parseInt(cleanInput, 16)
    let xorVal = 0
    
    // Linear terms
    for (let bit = 0; bit < 32; bit++) {
      if ((x >> bit) & 1) {
        xorVal ^= SINGLE_XOR[bit]
      }
    }
    
    // Interaction terms:
    // (0,1,2) without 3
    if ((x & 0x07) === 0x07 && !(x & 0x08)) {
      xorVal ^= 0x20
    }
    
    // (6,7) both set
    if ((x & 0xc0) === 0xc0) {
      xorVal ^= 0x100
    }
    
    // (8,9) without 10
    if ((x & 0x300) === 0x300 && !(x & 0x400)) {
      xorVal ^= 0x18000
    }
    
    // (16,17,18) without 19
    if ((x & 0x70000) === 0x70000 && !(x & 0x80000)) {
      xorVal ^= 0x300000
    }
    
    // (27,28,29) all set
    if ((x & 0x38000000) === 0x38000000) {
      xorVal ^= 0x80000000
    }
    
    // (4-11) all set
    if ((x & 0xff0) === 0xff0) {
      xorVal ^= 0x0821a100
    }
    
    const C = (BASE ^ xorVal) >>> 0
    const y = ((C - x) & 0xFFFFFFFF) >>> 0
    
    // Return as 8-character hex string (ensure unsigned)
    return y.toString(16).padStart(8, '0')
  } catch (error) {
    throw error
  }
}
