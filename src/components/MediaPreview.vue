<script setup>
import { defineProps, defineEmits } from 'vue'
import { formatFileSize } from '../utils/dateFormatter'

const props = defineProps({
  media: Object,
})

const emit = defineEmits(['close'])

const closePreview = () => {
  emit('close')
}

const downloadFile = async () => {
  try {
    if (props.media.url.startsWith('data:')) {
      const link = document.createElement('a')
      link.href = props.media.url
      link.download = props.media.file_name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    const response = await fetch(props.media.url)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = props.media.file_name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Download error:', error)
    window.open(props.media.url, '_blank')
  }
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
    @click="closePreview"
  >
    <!-- Close Button -->
    <button
      @click="closePreview"
      class="absolute top-4 right-4 p-3 text-white hover:bg-black/60 rounded-lg transition-colors z-10 cursor-pointer"
    >
      <i class="fas fa-times text-2xl"></i>
    </button>

    <!-- Download Button -->
    <button
      @click.stop="downloadFile"
      class="absolute top-4 right-20 p-3 text-white hover:bg-black/60 rounded-lg transition-colors z-10 cursor-pointer"
      title="Download file"
    >
      <i class="fas fa-download text-2xl"></i>
    </button>

    <!-- Media Content -->
    <div class="max-w-6xl max-h-[90vh] w-full flex flex-col items-center" @click.stop>
      <!-- Image -->
      <img
        v-if="props.media.mime_type?.includes('image')"
        :src="props.media.url"
        :alt="props.media.file_name"
        class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
      />

      <!-- Video -->
      <video
        v-else-if="props.media.mime_type?.includes('video')"
        :src="props.media.url"
        controls
        autoplay
        class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
      >
        Browser Anda tidak mendukung video.
      </video>

      <!-- File Info -->
      <div class="mt-2 text-white text-center">
        <p class="font-semibold mb-0 text-lg">{{ props.media.file_name }}</p>
        <p class="text-sm text-gray-300">{{ formatFileSize(props.media.file_size) }}</p>
      </div>
    </div>

    <!-- Instructions -->
    <div
      class="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-white text-sm text-center"
    >
      <p class="opacity-75">Klik button close untuk menutup atau download untuk mengunduh</p>
    </div>
  </div>
</template>
