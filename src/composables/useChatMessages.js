import { ref, computed, nextTick, watch } from 'vue'
import { sendAutoReply, getCorrectReplier } from '../services/autoReplyService'
import { generateMessageId } from '../utils/messageIdGenerator'

export function useChatMessages(props, emit) {
  const messages = ref([])
  const roomData = ref(null)
  const isLoading = ref(false)
  const isTyping = ref(false)
  const typingSender = ref(null)
  const messagesContainer = ref(null)
  const currentUser = ref('customer@mail.com')

  const currentRoomId = computed(() => props.room?.id)

  const scrollToBottom = () => {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  }

  const saveToRoom = () => {
    emit('save-messages', { roomId: props.room.id, messages: [...messages.value] })
  }

  const loadMessages = async () => {
    isLoading.value = true

    if (props.room.messages && props.room.messages.length >= 0) {
      messages.value = [...props.room.messages]

      if (props.room.dataSource === 'new-chat') {
        roomData.value = {
          participant: [
            { id: currentUser.value, name: 'Naufal Labib', role: 2 },
            { id: props.room.userId, name: props.room.name, role: 1 },
          ],
        }
      } else if (props.room.dataSource === 'extended') {
        try {
          const res = await fetch('/extended-data.json')
          const data = await res.json()
          if (data.results?.[0]?.room) {
            roomData.value = data.results[0].room
          }
        } catch (error) {
          console.error('Error loading extended room data:', error)
        }
      } else if (props.room.dataSource === 'dummy') {
        try {
          const res = await fetch('/dummy-data.json')
          const data = await res.json()
          if (data.results?.[0]?.room) {
            roomData.value = data.results[0].room
          }
        } catch (error) {
          console.error('Error loading dummy room data:', error)
        }
      }

      isLoading.value = false
      scrollToBottom()
      return
    }

    if (props.room.dataSource === 'new-chat') {
      messages.value = []
      roomData.value = {
        participant: [
          { id: currentUser.value, name: 'Naufal Labib', role: 2 },
          { id: props.room.userId, name: props.room.name, role: 1 },
        ],
      }
      saveToRoom()
      isLoading.value = false
      return
    }

    try {
      const file = props.room.dataSource === 'extended' ? '/extended-data.json' : '/dummy-data.json'
      const res = await fetch(file)
      const data = await res.json()

      if (data.results?.[0]) {
        roomData.value = data.results[0].room
        messages.value =
          props.room.dataSource === 'extended'
            ? data.results[0].comments
            : data.results[0].comments.slice(0, 5)
        saveToRoom()
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }

    isLoading.value = false
    scrollToBottom()
  }

  const sendMessage = (messageText, attachment = null) => {
    if (!messageText.trim() && !attachment) return

    const msgType = attachment ? attachment.type : 'text'
    const msg = {
      id: generateMessageId(),
      type: msgType,
      message: messageText,
      sender: currentUser.value,
      timestamp: new Date().toISOString(),
    }

    if (attachment) {
      msg.attachment = attachment.data
    }

    const targetRoomId = props.room.id
    const contextMessage = messageText || (attachment ? `${attachment.type} file` : '')

    messages.value.push(msg)
    saveToRoom()
    scrollToBottom()

    const displayMessage = msg.message || `📎 ${attachment?.data?.file_name || 'File'}`
    emit('update-room', {
      roomId: targetRoomId,
      message: displayMessage,
      timestamp: msg.timestamp,
    })

    triggerAutoReply(contextMessage, msgType, targetRoomId)

    return msg
  }

  const triggerAutoReply = (userMessage, messageType, targetRoomId) => {
    const roomInfo = {
      ...props.room,
      participant: roomData.value?.participant || props.room.participant,
    }

    const replierUserId = getCorrectReplier(roomInfo)

    if (!replierUserId) {
      return
    }

    sendAutoReply({
      userMessage,
      messageType,
      roomId: targetRoomId,
      currentRoomId: currentRoomId.value,
      replierUserId,
      onTypingStart: (sender) => {
        if (currentRoomId.value === targetRoomId) {
          isTyping.value = true
          typingSender.value = sender
          scrollToBottom()
        }
      },
      onTypingEnd: () => {
        if (currentRoomId.value === targetRoomId) {
          isTyping.value = false
          typingSender.value = null
        }
      },
      onMessageSent: (reply) => {
        if (currentRoomId.value === targetRoomId) {
          messages.value.push(reply)
          saveToRoom()
          scrollToBottom()
        } else {
          emit('add-message-to-room', { roomId: targetRoomId, message: reply })
        }

        emit('update-room', {
          roomId: targetRoomId,
          message: reply.message,
          timestamp: reply.timestamp,
        })
      },
    })
  }

  const getParticipantAvatar = (senderId) => {
    if (props.room.dataSource === 'new-chat' && senderId === props.room.userId) {
      return props.room.avatar
    }

    if (props.room.dataSource === 'dummy' && senderId === 'agent@mail.com') {
      return props.room.avatar
    }

    const participant = roomData.value?.participant?.find((p) => p.id === senderId)
    if (participant?.avatar) {
      return participant.avatar
    }

    return `https://i.pravatar.cc/150?u=${senderId}`
  }

  const getParticipantName = (senderId) => {
    if (props.room.dataSource === 'new-chat' && senderId === props.room.userId) {
      return props.room.name
    }

    const participant = roomData.value?.participant?.find((p) => p.id === senderId)
    if (participant) {
      return participant.name
    }

    if (senderId?.includes('@')) {
      const username = senderId.split('@')[0]
      return username.charAt(0).toUpperCase() + username.slice(1).replace(/\./g, ' ')
    }

    return senderId
  }

  const resetChatState = () => {
    isTyping.value = false
    typingSender.value = null
  }

  watch(
    () => messages.value.length,
    () => {
      scrollToBottom()
    },
  )

  watch(
    () => props.room?.id,
    (newId, oldId) => {
      if (oldId && oldId !== newId) {
        isTyping.value = false
        typingSender.value = null
      }
    },
  )

  return {
    messages,
    roomData,
    isLoading,
    isTyping,
    typingSender,
    messagesContainer,
    currentUser,
    currentRoomId,
    loadMessages,
    sendMessage,
    scrollToBottom,
    getParticipantAvatar,
    getParticipantName,
    resetChatState,
    saveToRoom,
  }
}
