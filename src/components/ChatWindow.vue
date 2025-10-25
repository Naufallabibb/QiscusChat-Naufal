<script setup>
import { ref, onMounted, watch } from 'vue'
import MessageBubble from './MessageBubble.vue'
import TypingIndicator from './TypingIndicator.vue'
import EmojiPicker from 'vue3-emoji-picker'
import 'vue3-emoji-picker/css'
import { useChatMessages } from '../composables/useChatMessages'
import { useFileUpload } from '../composables/useFileUpload'
import { useMessageSearch } from '../composables/useMessageSearch'

const props = defineProps({ room: Object })
const emit = defineEmits(['close', 'update-room', 'save-messages', 'add-message-to-room'])

const {
  messages,
  roomData,
  isLoading,
  isTyping,
  typingSender,
  messagesContainer,
  currentUser,
  loadMessages,
  sendMessage,
  getParticipantAvatar,
  getParticipantName,
  resetChatState,
} = useChatMessages(props, emit)

const {
  fileInput,
  selectedFile,
  filePreviewUrl,
  showFilePreview,
  handleFileAttachment,
  handleFileSelect,
  cancelFileUpload,
  prepareFileMessage,
} = useFileUpload()

const {
  showSearch,
  searchQuery,
  searchResults,
  currentSearchIndex,
  toggleSearch,
  nextSearchResult,
  prevSearchResult,
  resetSearch,
} = useMessageSearch(messages, messagesContainer)

const newMessage = ref('')
const showEmojiPicker = ref(false)

/**
 * Send text message
 */
const handleSendMessage = () => {
  if (!newMessage.value.trim()) return
  sendMessage(newMessage.value)
  newMessage.value = ''
}

/**
 * Send file message with optional caption
 */
const sendFileMessage = () => {
  const fileData = prepareFileMessage(newMessage.value)
  if (!fileData) return

  sendMessage(fileData.caption, fileData)
  newMessage.value = ''
  cancelFileUpload()
}

/**
 * Emoji picker handlers
 */
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

const onSelectEmoji = (emoji) => {
  newMessage.value += emoji.i
  showEmojiPicker.value = false
}

/**
 * Utility function for initials
 */
const getInitials = (name) => {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Watch for room changes
 */
watch(
  () => props.room.id,
  () => {
    resetSearch()
    resetChatState()
    loadMessages()
  },
)

onMounted(loadMessages)
</script>

<template>
  <div class="flex flex-col h-full bg-gray-50">
    <!-- Header -->
    <div class="bg-qiscus-gradient text-white p-5 flex items-center justify-between shadow-qiscus">
      <div class="flex items-center space-x-4">
        <button
          @click="emit('close')"
          class="md:hidden p-2 hover:bg-black/60 rounded-lg transition-colors"
        >
          <i class="fas fa-arrow-left text-white text-lg"></i>
        </button>

        <div
          v-if="room.avatar"
          class="w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-white ring-opacity-30"
        >
          <img :src="room.avatar" :alt="room.name" class="w-full h-full object-cover" />
        </div>
        <div
          v-else
          class="w-11 h-11 bg-black/60 rounded-full flex items-center justify-center text-white font-semibold shrink-0"
        >
          {{ getInitials(room.name) }}
        </div>

        <div class="min-w-0">
          <h2 class="font-semibold text-white truncate text-base">{{ room.name }}</h2>
          <p class="text-xs text-white opacity-90">
            {{
              room.is_group
                ? `Group • ${roomData?.participant?.length || 0} participants`
                : room.userStatus || 'Online'
            }}
          </p>
        </div>
      </div>

      <div class="flex items-center space-x-2">
        <button
          @click="toggleSearch"
          class="p-2.5 hover:bg-black/60 rounded-xl transition-colors cursor-pointer"
        >
          <i class="fas fa-search text-white text-lg"></i>
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div
      v-if="showSearch"
      class="bg-white border-b border-gray-200 p-3 flex items-center gap-2 shadow-sm"
    >
      <div class="flex-1 relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari pesan..."
          class="w-full px-4 py-2 pr-10 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 ring-qiscus-light text-sm"
          @keydown.enter="performSearch"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div v-if="searchResults.length > 0" class="flex items-center gap-2 text-sm text-gray-600">
        <span>{{ currentSearchIndex + 1 }}/{{ searchResults.length }}</span>
        <button
          @click="prevSearchResult"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <i class="fas fa-chevron-up"></i>
        </button>
        <button
          @click="nextSearchResult"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <i class="fas fa-chevron-down"></i>
        </button>
      </div>
      <button
        @click="toggleSearch"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600 cursor-pointer"
      >
        <i class="fas fa-times"></i>
      </button>
    </div>

    <!-- Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
      <div v-if="isLoading" class="flex justify-center items-center h-full">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-qiscus-light"></div>
      </div>

      <div v-else-if="messages.length === 0" class="flex justify-center items-center h-full">
        <div class="text-center">
          <div
            class="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <i class="fas fa-comments text-gray-400 text-4xl"></i>
          </div>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Belum ada pesan</h3>
          <p class="text-gray-500 text-sm">Kirim pesan untuk memulai percakapan</p>
        </div>
      </div>

      <div v-else>
        <MessageBubble
          v-for="(message, index) in messages"
          :key="message.id"
          :message="message"
          :is-own="message.sender === currentUser"
          :sender-name="getParticipantName(message.sender)"
          :sender-avatar="getParticipantAvatar(message.sender)"
          :room-data-source="props.room.dataSource"
          :class="[
            'message-item rounded-lg',
            searchResults.some((r) => r.index === index) && searchQuery.trim()
              ? searchResults[currentSearchIndex]?.index === index
                ? 'bg-yellow-200/50 ring-2 ring-yellow-400 py-2'
                : 'bg-yellow-100/30 py-1'
              : '',
          ]"
        />

        <!-- Typing Indicator -->
        <TypingIndicator
          v-if="isTyping && typingSender"
          :sender-name="getParticipantName(typingSender)"
          :sender-avatar="getParticipantAvatar(typingSender)"
        />
      </div>
    </div>

    <!-- File Preview Modal -->
    <div
      v-if="showFilePreview"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      @click="cancelFileUpload"
    >
      <div class="max-w-4xl w-full bg-white rounded-lg shadow-2xl" @click.stop>
        <div class="flex items-center justify-between p-4 border-b-2 border-gray-200">
          <h3 class="font-semibold text-lg">Preview File</h3>
          <button
            @click="cancelFileUpload"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="p-4 max-h-[60vh] overflow-auto">
          <img
            v-if="selectedFile?.type.startsWith('image/')"
            :src="filePreviewUrl"
            :alt="selectedFile?.name"
            class="max-w-full h-auto rounded-lg mx-auto"
          />
          <video
            v-else-if="selectedFile?.type.startsWith('video/')"
            :src="filePreviewUrl"
            controls
            class="max-w-full h-auto rounded-lg mx-auto"
          ></video>
          <div v-else class="flex items-center justify-center p-8 bg-gray-100 rounded-lg">
            <div class="text-center">
              <i class="fas fa-file text-6xl text-gray-400 mb-4"></i>
              <p class="font-semibold">{{ selectedFile?.name }}</p>
              <p class="text-sm text-gray-500 mt-2">
                {{ (selectedFile?.size / 1024).toFixed(2) }} KB
              </p>
            </div>
          </div>
        </div>

        <div class="p-4 border-t-2 border-gray-200">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Tambahkan keterangan (opsional)..."
            class="w-full px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 ring-qiscus-light text-sm mb-4"
            @keydown.enter.exact.prevent="sendFileMessage"
          />
          <div class="flex justify-end gap-2">
            <button
              @click="cancelFileUpload"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              @click="sendFileMessage"
              class="px-4 py-2 bg-qiscus-light hover:bg-qiscus-light-hover text-white rounded-lg transition-colors cursor-pointer"
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="bg-white border-t border-gray-200 p-3 md:p-4 relative">
      <div
        v-if="showEmojiPicker"
        class="absolute bottom-full left-4 mb-2 shadow-2xl rounded-lg overflow-hidden z-50 bg-white"
        @click.stop
      >
        <EmojiPicker :native="true" @select="onSelectEmoji" :hide-search="false" />
      </div>

      <div class="flex items-center gap-2">
        <button
          @click="toggleEmojiPicker"
          :class="[
            'text-gray-500 hover:bg-gray-100 rounded-lg shrink-0 transition-all h-11 w-11 flex items-center justify-center cursor-pointer',
            showEmojiPicker ? 'bg-gray-100 text-qiscus-light' : 'hover:text-qiscus-light',
          ]"
          type="button"
        >
          <i class="far fa-smile text-xl"></i>
        </button>

        <button
          @click="handleFileAttachment"
          class="text-gray-500 hover:bg-gray-100 hover:text-qiscus-light rounded-lg shrink-0 transition-all h-11 w-11 flex items-center justify-center cursor-pointer"
          type="button"
        >
          <i class="fas fa-paperclip text-xl"></i>
        </button>

        <input
          ref="fileInput"
          type="file"
          accept="image/*,video/*,.pdf"
          @change="handleFileSelect"
          class="hidden"
        />

        <div class="flex-1">
          <input
            v-model="newMessage"
            @keydown.enter.exact.prevent="handleSendMessage"
            type="text"
            placeholder="Ketik sebuah pesan..."
            class="w-full h-11 px-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 ring-qiscus-light text-sm"
          />
        </div>

        <button
          @click="handleSendMessage"
          type="button"
          :disabled="!newMessage.trim()"
          :class="[
            'rounded-lg shrink-0 transition-all duration-200 flex items-center justify-center h-11 w-11',
            newMessage.trim()
              ? 'bg-qiscus-light hover:bg-qiscus-light-hover text-white shadow-md hover:shadow-lg active:scale-95 cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed',
          ]"
        >
          <i class="fas fa-paper-plane text-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>
