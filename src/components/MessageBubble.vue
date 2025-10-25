<script setup>
import { defineProps, ref, computed, onMounted, onUnmounted } from 'vue'
import { formatTimestamp, formatFileSize } from '../utils/dateFormatter'
import MediaPreview from './MediaPreview.vue'

const props = defineProps({
  message: Object,
  isOwn: Boolean,
  senderName: String,
  senderAvatar: String,
  roomDataSource: String,
})

const showMediaPreview = ref(false)
const previewMedia = ref(null)
const currentTime = ref(Date.now())
let intervalId = null

onMounted(() => {
  intervalId = setInterval(() => {
    currentTime.value = Date.now()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

const messageStatus = computed(() => {
  if (!props.isOwn) return null

  currentTime.value
  const messageTime = new Date(props.message.timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now - messageTime) / 1000)

  if (diffInSeconds < 1) {
    return { icon: 'fa-check', color: 'text-white/50' }
  }
  return { icon: 'fa-check-double', color: 'text-white' }
})

const openMediaPreview = (attachment) => {
  previewMedia.value = attachment
  showMediaPreview.value = true
}

const closeMediaPreview = () => {
  showMediaPreview.value = false
  previewMedia.value = null
}

const downloadPDF = async (attachment) => {
  try {
    if (attachment.url.startsWith('data:')) {
      const link = document.createElement('a')
      link.href = attachment.url
      link.download = attachment.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    const response = await fetch(attachment.url)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = attachment.file_name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download error:', error)
    window.open(attachment.url, '_blank')
  }
}
</script>

<template>
  <div :class="['flex mb-2', isOwn ? 'justify-end' : 'justify-start']">
    <div
      :class="[
        'flex max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[60%]',
        isOwn ? 'flex-row-reverse' : 'flex-row',
      ]"
    >
      <!-- Avatar -->
      <div v-if="!isOwn" class="shrink-0 mr-2 sm:mr-3">
        <img
          :src="senderAvatar"
          :alt="senderName"
          class="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-gray-100"
        />
      </div>

      <!-- Message Content -->
      <div class="min-w-0 flex-1">
        <!-- Username (only for other users) -->
        <div v-if="!isOwn" class="mb-1.5 sm:mb-2 px-1">
          <span class="text-xs font-semibold text-gray-700">{{ senderName }}</span>
        </div>

        <!-- Message Bubble -->
        <div
          :class="[
            'rounded-lg shadow-sm transition-all duration-200',
            isOwn ? 'chat-bubble-own' : 'chat-bubble-other',
          ]"
        >
          <!-- Text Message -->
          <div
            v-if="!props.message.type || props.message.type === 'text'"
            class="px-4 sm:px-5 py-3"
          >
            <p class="text-sm whitespace-pre-wrap wrap-break-word leading-relaxed">
              {{ props.message.message }}
            </p>
          </div>

          <!-- Image Message -->
          <div v-else-if="props.message.type === 'image'" class="overflow-hidden">
            <div
              @click="openMediaPreview(props.message.attachment)"
              class="cursor-pointer hover:opacity-90 transition-opacity"
            >
              <img
                :src="props.message.attachment.url"
                :alt="props.message.attachment.file_name"
                class="w-full h-auto max-h-64 sm:max-h-80 object-cover rounded-t-lg"
                loading="lazy"
              />
            </div>
            <div class="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3">
              <p
                v-if="props.message.message"
                class="text-xs sm:text-sm mb-2 whitespace-pre-wrap wrap-break-word leading-relaxed"
              >
                {{ props.message.message }}
              </p>
              <div
                class="flex items-center justify-between text-[10px] sm:text-xs opacity-75 gap-2"
              >
                <span class="truncate flex-1 min-w-0">{{
                  props.message.attachment.file_name
                }}</span>
                <span class="shrink-0 whitespace-nowrap">{{
                  formatFileSize(props.message.attachment.file_size)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Video Message -->
          <div v-else-if="props.message.type === 'video'" class="overflow-hidden">
            <div class="relative bg-black rounded-t-lg">
              <video
                :src="props.message.attachment.url"
                controls
                class="w-full h-auto max-h-64 sm:max-h-80 object-contain"
                preload="metadata"
              >
                Browser Anda tidak mendukung video.
              </video>
            </div>
            <div class="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3">
              <p
                v-if="props.message.message"
                class="text-xs sm:text-sm mb-2 whitespace-pre-wrap wrap-break-word leading-relaxed"
              >
                {{ props.message.message }}
              </p>
              <div
                class="flex items-center justify-between text-[10px] sm:text-xs opacity-75 gap-2"
              >
                <span class="truncate flex-1 min-w-0">{{
                  props.message.attachment.file_name
                }}</span>
                <span class="shrink-0 whitespace-nowrap">
                  {{ formatFileSize(props.message.attachment.file_size) }}
                  <span v-if="props.message.attachment.duration">
                    • {{ props.message.attachment.duration }}s</span
                  >
                </span>
              </div>
            </div>
          </div>

          <!-- PDF Message -->
          <div v-else-if="props.message.type === 'pdf'" class="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3">
            <div
              @click="downloadPDF(props.message.attachment)"
              :class="[
                'flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg mb-2 transition-colors cursor-pointer',
                isOwn
                  ? 'bg-qiscus-dark hover:bg-qiscus-dark-hover'
                  : 'bg-gray-100 hover:bg-gray-200',
              ]"
            >
              <div class="shrink-0">
                <i
                  class="fas fa-file-pdf text-2xl sm:text-3xl"
                  :class="isOwn ? 'text-white' : 'text-red-500'"
                ></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs sm:text-sm font-medium truncate">
                  {{ props.message.attachment.file_name }}
                </p>
                <p class="text-[10px] sm:text-xs opacity-75 mt-1">
                  {{ formatFileSize(props.message.attachment.file_size) }}
                  <span v-if="props.message.attachment.page_count">
                    • {{ props.message.attachment.page_count }} halaman
                  </span>
                </p>
              </div>
              <div class="shrink-0">
                <i class="fas fa-download text-base sm:text-lg"></i>
              </div>
            </div>
            <p
              v-if="props.message.message"
              class="text-xs sm:text-sm whitespace-pre-wrap wrap-break-word leading-relaxed"
            >
              {{ props.message.message }}
            </p>
          </div>

          <!-- Timestamp with Status -->
          <div
            :class="[
              'px-3 sm:px-4 md:px-5 pb-2 text-[10px] sm:text-xs flex items-center justify-end space-x-2',
              isOwn ? 'text-white' : 'text-gray-500',
            ]"
          >
            <span :class="isOwn ? 'text-white/90' : ''">{{
              formatTimestamp(props.message.timestamp)
            }}</span>
            <!-- Read indicator for own messages -->
            <i
              v-if="isOwn && messageStatus"
              :class="[
                'fas',
                messageStatus.icon,
                messageStatus.color,
                'text-xs sm:text-sm transition-all duration-300 drop-shadow-md',
              ]"
            ></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Preview Modal -->
    <MediaPreview
      v-if="showMediaPreview && previewMedia"
      :media="previewMedia"
      @close="closeMediaPreview"
    />
  </div>
</template>
