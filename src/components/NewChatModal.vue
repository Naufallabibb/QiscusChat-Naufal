<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue'

const props = defineProps({
  availableUsers: Array,
})

const emit = defineEmits(['close', 'start-chat'])

const searchQuery = ref('')

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.availableUsers
  }
  const query = searchQuery.value.toLowerCase()
  return props.availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query),
  )
})

const closeModal = () => {
  emit('close')
}

const selectUser = (user) => {
  emit('start-chat', user)
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    @click="closeModal"
  >
    <div
      class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col"
      @click.stop
    >
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Mulai Chat Baru</h2>
          <button
            @click="closeModal"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <i class="fas fa-times text-xl text-gray-600"></i>
          </button>
        </div>

        <!-- Search -->
        <div class="relative">
          <i
            class="fas fa-search text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
          ></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari pengguna..."
            class="w-full px-4 py-2.5 pl-11 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 ring-qiscus-light border border-transparent focus:border-qiscus-light transition-all"
          />
        </div>
      </div>

      <!-- User List -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="filteredUsers.length === 0" class="text-center py-8">
          <i class="fas fa-user-slash text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-500">Tidak ada pengguna tersedia</p>
        </div>

        <div v-else class="space-y-2">
          <div
            v-for="user in filteredUsers"
            :key="user.id"
            @click="selectUser(user)"
            class="flex items-center p-4 hover:bg-gray-50 rounded-lg transition-all duration-200 cursor-pointer group"
          >
            <!-- Avatar -->
            <div class="relative shrink-0">
              <img
                :src="user.avatar"
                :alt="user.name"
                class="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-qiscus-light transition-all"
              />
              <div
                v-if="user.status === 'online'"
                class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full ring-2 ring-white"
              ></div>
            </div>

            <!-- User Info -->
            <div class="ml-4 flex-1 min-w-0">
              <h3 class="font-semibold text-gray-900 truncate">{{ user.name }}</h3>
              <p class="text-sm text-gray-500 truncate">{{ user.role }}</p>
            </div>

            <!-- Arrow Icon -->
            <div class="ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <i class="fas fa-arrow-right text-qiscus-light"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
