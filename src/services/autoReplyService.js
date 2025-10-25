import { generateMessageId } from '../utils/messageIdGenerator'

if (!window.replyQueue) {
  window.replyQueue = {}
}

if (!window.activeReplies) {
  window.activeReplies = new Set()
}

export function getSingleReply(messageText, messageType = 'text') {
  const text = messageText.toLowerCase()

  if (messageType === 'image') {
    return 'Terima kasih sudah mengirim fotonya 📸'
  }
  if (messageType === 'video') {
    return 'Video sudah diterima dengan baik 🎥'
  }
  if (messageType === 'pdf') {
    return 'Dokumen sudah saya terima 📄'
  }

  if (
    text.includes('halo') ||
    text.includes('hai') ||
    text.includes('hello') ||
    text.includes('selamat')
  ) {
    return 'Halo! Ada yang bisa saya bantu? 😊'
  }

  if (text.includes('pembayaran') || text.includes('bayar') || text.includes('bukti')) {
    return 'Baik, terima kasih. Saya akan proses pembayaran Anda segera 💳'
  }

  if (text.includes('foto') || text.includes('gambar') || text.includes('image')) {
    return 'Terima kasih sudah mengirim fotonya 📸'
  }

  if (text.includes('video')) {
    return 'Video sudah diterima dengan baik 🎥'
  }

  if (text.includes('pdf') || text.includes('dokumen') || text.includes('file')) {
    return 'Dokumen sudah saya terima 📄'
  }

  if (text.includes('terima kasih') || text.includes('thanks') || text.includes('makasih')) {
    return 'Sama-sama! Senang bisa membantu 😊'
  }

  if (text.includes('?')) {
    return 'Baik, biarkan saya cek informasinya dulu ya'
  }

  if (text.includes('makan')) {
    return 'Wah makan nih! Selamat makan ya! 🍽️'
  }

  return 'Baik, saya sudah menerima pesannya'
}

export function getCorrectReplier(room) {
  if (room.dataSource === 'dummy') {
    return 'agent@mail.com'
  }

  if (room.dataSource === 'new-chat' && room.userId) {
    return room.userId
  }

  if (room.dataSource === 'extended' && room.participant) {
    const currentUser = 'customer@mail.com'
    const otherParticipants = room.participant.filter((p) => p.id !== currentUser)
    if (otherParticipants.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherParticipants.length)
      return otherParticipants[randomIndex].id
    }
  }

  return null
}

export function clearRoomReplyQueue(roomId) {
  if (window.replyQueue[roomId]) {
    window.replyQueue[roomId].forEach((timeout) => clearTimeout(timeout))
    delete window.replyQueue[roomId]
  }
  window.activeReplies.delete(roomId)
}

export function isRoomReplying(roomId) {
  return window.activeReplies.has(roomId)
}

export function sendAutoReply({
  userMessage = '',
  messageType = 'text',
  roomId,
  currentRoomId,
  replierUserId,
  onTypingStart,
  onTypingEnd,
  onMessageSent,
}) {
  if (isRoomReplying(roomId)) {
    clearRoomReplyQueue(roomId)
  }

  if (!replierUserId) {
    return
  }

  const responseText = getSingleReply(userMessage, messageType)

  window.activeReplies.add(roomId)
  window.replyQueue[roomId] = []

  const readDelay = 2500 + Math.random() * 500

  const typingTimeout = setTimeout(() => {
    if (!window.replyQueue[roomId]) {
      return
    }

    if (currentRoomId === roomId) {
      onTypingStart(replierUserId)
    }
  }, readDelay)

  window.replyQueue[roomId].push(typingTimeout)

  const typingDuration = 1500 + Math.random() * 1000
  const totalDelay = readDelay + typingDuration

  const messageTimeout = setTimeout(() => {
    if (!window.replyQueue[roomId]) {
      return
    }

    if (currentRoomId === roomId) {
      onTypingEnd()
    }

    const reply = {
      id: generateMessageId(),
      type: 'text',
      message: responseText,
      sender: replierUserId,
      timestamp: new Date().toISOString(),
    }

    onMessageSent(reply)

    window.activeReplies.delete(roomId)
    delete window.replyQueue[roomId]
  }, totalDelay)

  window.replyQueue[roomId].push(messageTimeout)
}
