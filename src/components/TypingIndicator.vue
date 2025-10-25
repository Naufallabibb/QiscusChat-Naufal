<script setup>
import { defineProps } from 'vue'

defineProps({
  senderName: String,
  senderAvatar: String,
})
</script>

<template>
  <div class="flex justify-start mb-2">
    <div class="flex max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[60%]">
      <!-- Avatar -->
      <div class="shrink-0 mr-2 sm:mr-3">
        <img
          :src="senderAvatar"
          :alt="senderName"
          class="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ring-gray-100"
        />
      </div>

      <!-- Typing Bubble -->
      <div class="min-w-0 flex-1">
        <!-- Username -->
        <div class="mb-1.5 sm:mb-2 px-1">
          <span class="text-xs font-semibold text-gray-700">{{ senderName }}</span>
        </div>

        <!-- Typing Animation -->
        <div class="bg-white rounded-lg shadow-sm px-5 py-3 inline-block">
          <div class="flex items-center space-x-1">
            <div
              class="w-2 h-2 bg-gray-400 rounded-full animate-typing-dot"
              style="animation-delay: 0s"
            ></div>
            <div
              class="w-2 h-2 bg-gray-400 rounded-full animate-typing-dot"
              style="animation-delay: 0.2s"
            ></div>
            <div
              class="w-2 h-2 bg-gray-400 rounded-full animate-typing-dot"
              style="animation-delay: 0.4s"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes typing-dot {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

.animate-typing-dot {
  animation: typing-dot 1.4s infinite ease-in-out;
}
</style>
