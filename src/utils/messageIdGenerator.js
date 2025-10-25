/**
 * Message ID Generator
 * Ensures unique IDs for all messages
 */

let messageCounter = 0

/**
 * Generate unique message ID
 * Format: timestamp-counter-random
 */
export function generateMessageId() {
  messageCounter++
  const timestamp = Date.now()
  const counter = messageCounter
  const random = Math.floor(Math.random() * 10000)
  return `msg_${timestamp}_${counter}_${random}`
}

/**
 * Reset counter (for testing)
 */
export function resetMessageCounter() {
  messageCounter = 0
}
