<script setup>
import { ref, onMounted, computed } from 'vue'
import ChatList from './components/ChatList.vue'
import ChatWindow from './components/ChatWindow.vue'
import NewChatModal from './components/NewChatModal.vue'

const chatRooms = ref([
  {
    id: 1,
    name: 'Agent A',
    is_group: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    last_message: 'Baik, silahkan kirimkan lampiran bukti pembayarannya',
    last_timestamp: '2024-01-15T19:31:40Z',
    unread_count: 2,
    dataSource: 'dummy',
    messages: null,
  },
  {
    id: 2,
    name: 'Product Qiscus Team',
    is_group: true,
    avatar:
      'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=300',
    last_message: 'Meeting jam 3 sore ya!',
    last_timestamp: '2024-01-15T09:15:00Z',
    unread_count: 5,
    dataSource: 'extended',
    messages: null,
  },
])

const selectedRoom = ref(null)
const isMobileChatOpen = ref(false)
const searchQuery = ref('')
const showNewChatModal = ref(false)
const availableUsers = ref([])

const filteredRooms = computed(() => {
  if (!searchQuery.value.trim()) {
    return chatRooms.value
  }
  const query = searchQuery.value.toLowerCase()
  return chatRooms.value.filter(
    (room) =>
      room.name.toLowerCase().includes(query) || room.last_message.toLowerCase().includes(query),
  )
})

const selectRoom = (room) => {
  selectedRoom.value = room
  isMobileChatOpen.value = true

  if (room.unread_count > 0) {
    room.unread_count = 0
  }
}

const closeMobileChat = () => {
  isMobileChatOpen.value = false
}

const openNewChatModal = async () => {
  try {
    const response = await fetch('/extended-data.json')
    const data = await response.json()

    if (data.available_users) {
      const existingUserIds = chatRooms.value.map((room) => room.userId || room.name.toLowerCase())
      availableUsers.value = data.available_users.filter(
        (user) =>
          !existingUserIds.includes(user.id) && !existingUserIds.includes(user.name.toLowerCase()),
      )
      showNewChatModal.value = true
    }
  } catch (error) {
    console.error('Error loading available users:', error)
  }
}

const closeNewChatModal = () => {
  showNewChatModal.value = false
}

const startNewChat = (user) => {
  const newId = Math.max(...chatRooms.value.map((r) => r.id)) + 1

  const newRoom = {
    id: newId,
    name: user.name,
    is_group: false,
    avatar: user.avatar,
    last_message: 'Mulai percakapan baru...',
    last_timestamp: new Date().toISOString(),
    unread_count: 0,
    dataSource: 'new-chat',
    userId: user.id,
    userEmail: user.email,
    userRole: user.role,
    userStatus: user.status,
    messages: [],
  }

  chatRooms.value.unshift(newRoom)
  selectRoom(newRoom)
  closeNewChatModal()
}

const updateRoomLastMessage = ({ roomId, message, timestamp }) => {
  const room = chatRooms.value.find((r) => r.id === roomId)
  if (!room) return

  room.last_message = message
  room.last_timestamp = timestamp

  const index = chatRooms.value.findIndex((r) => r.id === roomId)
  if (index > 0) {
    const [movedRoom] = chatRooms.value.splice(index, 1)
    chatRooms.value.unshift(movedRoom)
  }
}

const saveRoomMessages = ({ roomId, messages: msgs }) => {
  const room = chatRooms.value.find((r) => r.id === roomId)
  if (room) {
    room.messages = [...msgs]
  }
}

const addMessageToRoom = ({ roomId, message }) => {
  const room = chatRooms.value.find((r) => r.id === roomId)
  if (!room) return

  if (!room.messages) {
    room.messages = []
  }

  room.messages.push(message)
  room.last_message = message.message
  room.last_timestamp = message.timestamp

  const index = chatRooms.value.findIndex((r) => r.id === roomId)
  if (index > 0) {
    const [movedRoom] = chatRooms.value.splice(index, 1)
    chatRooms.value.unshift(movedRoom)
  }

  if (selectedRoom.value?.id !== roomId) {
    room.unread_count = (room.unread_count || 0) + 1
  }
}

onMounted(() => {
  selectedRoom.value = chatRooms.value[0]
})
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar Chat List -->
    <div
      :class="[
        'w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col shadow-lg',
        isMobileChatOpen ? 'hidden md:flex' : 'flex',
      ]"
    >
      <!-- Header -->
      <div
        class="bg-qiscus-gradient text-white p-5 flex items-center justify-between shadow-qiscus"
      >
        <div class="flex items-center space-x-4">
          <div
            class="w-11 h-11 rounded-full flex items-center justify-center font-semibold text-white"
          >
            <img
              src="https://randomuser.me/api/portraits/men/36.jpg"
              alt="Avatar Me"
              class="w-full h-full object-cover rounded-full"
              loading="lazy"
            />
          </div>
          <div>
            <h1 class="font-semibold text-lg">Naufal Labib</h1>
            <p class="text-xs text-white opacity-90">Online</p>
          </div>
        </div>
        <button
          @click="openNewChatModal"
          class="p-2.5 hover:bg-black/60 rounded-xl transition-all duration-200 cursor-pointer"
          title="New Chat"
        >
          <i class="fas fa-plus text-lg"></i>
        </button>
      </div>

      <!-- Search -->
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <div class="relative">
          <i
            class="fas fa-search text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
          ></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Telusuri chat atau pengguna"
            class="w-full px-4 py-2.5 pl-11 bg-white rounded-full focus:outline-none focus:ring-2 ring-qiscus-light border border-gray-200 transition-all"
          />
        </div>
      </div>

      <!-- Chat List -->
      <div
        v-if="filteredRooms.length === 0 && searchQuery.trim()"
        class="flex-1 flex flex-col items-center justify-center p-8"
      >
        <div class="text-center">
          <i class="fas fa-search text-5xl text-gray-300 mb-4"></i>
          <h3 class="text-lg font-semibold text-gray-700 mb-2">Tidak Ditemukan</h3>
          <p class="text-sm text-gray-500">
            Tidak ada chat atau pengguna yang cocok dengan pencarian "{{ searchQuery }}"
          </p>
        </div>
      </div>
      <ChatList
        v-else
        :rooms="filteredRooms"
        :selected-room="selectedRoom"
        @select-room="selectRoom"
      />
    </div>

    <!-- Chat Window -->
    <div :class="['flex-1 flex flex-col', !isMobileChatOpen ? 'hidden md:flex' : 'flex']">
      <ChatWindow
        v-if="selectedRoom"
        :room="selectedRoom"
        @close="closeMobileChat"
        @update-room="updateRoomLastMessage"
        @save-messages="saveRoomMessages"
        @add-message-to-room="addMessageToRoom"
      />
      <div
        v-else
        class="flex-1 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100"
      >
        <div class="text-center">
          <div
            class="w-32 h-32 bg-qiscus-gradient rounded-full mx-auto mb-6 flex items-center justify-center shadow-qiscus-lg"
          >
            <i class="fas fa-comments text-white text-5xl"></i>
          </div>
          <h2 class="text-2xl font-semibold text-qiscus-dark mb-2">Qiscus Chat</h2>
          <p class="text-gray-500">Pilih chat untuk memulai percakapan</p>
        </div>
      </div>
    </div>

    <!-- New Chat Modal -->
    <NewChatModal
      v-if="showNewChatModal"
      :available-users="availableUsers"
      @close="closeNewChatModal"
      @start-chat="startNewChat"
    />
  </div>
</template>
