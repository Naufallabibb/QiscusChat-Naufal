<script setup>
import { defineProps, defineEmits } from 'vue'
import { formatTimestamp } from '../utils/dateFormatter'

defineProps({
  rooms: Array,
  selectedRoom: Object,
})

const emit = defineEmits(['select-room'])

const selectRoom = (room) => {
  emit('select-room', room)
}

const getInitials = (name) => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <div class="flex-1 overflow-y-auto">
    <div
      v-for="room in rooms"
      :key="room.id"
      @click="selectRoom(room)"
      :class="[
        'flex items-center p-4 border-b border-gray-100 hover:bg-linear-to-r hover:from-blue-50 hover:to-transparent cursor-pointer transition-all duration-200',
        selectedRoom?.id === room.id
          ? 'bg-linear-to-r from-blue-50 to-transparent border-l-4 border-qiscus-light'
          : '',
      ]"
    >
      <!-- Avatar -->
      <div class="relative shrink-0">
        <div v-if="room.avatar" class="w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-100">
          <img :src="room.avatar" :alt="room.name" class="w-full h-full object-cover" />
        </div>
        <div
          v-else
          class="w-14 h-14 bg-qiscus-light rounded-full flex items-center justify-center text-white font-semibold shadow-md"
        >
          {{ getInitials(room.name) }}
        </div>
        <div
          v-if="room.is_group"
          class="absolute -bottom-1 -right-1 w-6 h-6 bg-qiscus-green rounded-full flex items-center justify-center ring-2 ring-white"
        >
          <i class="fas fa-users text-white text-xs"></i>
        </div>
      </div>

      <!-- Content -->
      <div class="ml-4 flex-1 min-w-0">
        <div class="flex items-center justify-between mb-1.5">
          <h3 class="font-semibold text-gray-900 truncate text-base">{{ room.name }}</h3>
          <span class="text-xs text-gray-500 shrink-0 ml-4">
            {{ formatTimestamp(room.last_timestamp) }}
          </span>
        </div>
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-600 truncate flex-1 pr-3">{{ room.last_message }}</p>
          <span
            v-if="room.unread_count > 0"
            class="ml-3 px-2.5 py-1 bg-qiscus-green text-white text-xs rounded-full shrink-0 min-w-6 text-center font-medium shadow-sm"
          >
            {{ room.unread_count > 99 ? '99+' : room.unread_count }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
