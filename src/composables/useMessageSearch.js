/**
 * Composable for Message Search
 */
import { ref, watch, nextTick } from 'vue'

export function useMessageSearch(messagesRef, messagesContainer) {
  const showSearch = ref(false)
  const searchQuery = ref('')
  const searchResults = ref([])
  const currentSearchIndex = ref(-1)

  /**
   * Toggle search bar
   */
  const toggleSearch = () => {
    showSearch.value = !showSearch.value
    if (!showSearch.value) {
      searchQuery.value = ''
      searchResults.value = []
      currentSearchIndex.value = -1
    }
  }

  /**
   * Perform search in messages
   */
  const performSearch = () => {
    if (!searchQuery.value.trim()) {
      searchResults.value = []
      currentSearchIndex.value = -1
      return
    }

    const query = searchQuery.value.toLowerCase()
    searchResults.value = messagesRef.value
      .map((msg, index) => ({ msg, index }))
      .filter(({ msg }) => msg.message?.toLowerCase().includes(query))

    if (searchResults.value.length > 0) {
      currentSearchIndex.value = 0
      nextTick(() => scrollToSearchResult(0))
    }
  }

  /**
   * Navigate to next search result
   */
  const nextSearchResult = () => {
    if (searchResults.value.length === 0) return
    currentSearchIndex.value = (currentSearchIndex.value + 1) % searchResults.value.length
    nextTick(() => scrollToSearchResult(currentSearchIndex.value))
  }

  /**
   * Navigate to previous search result
   */
  const prevSearchResult = () => {
    if (searchResults.value.length === 0) return
    currentSearchIndex.value =
      (currentSearchIndex.value - 1 + searchResults.value.length) % searchResults.value.length
    nextTick(() => scrollToSearchResult(currentSearchIndex.value))
  }

  /**
   * Scroll to specific search result
   */
  const scrollToSearchResult = (index) => {
    if (!messagesContainer.value || !searchResults.value[index]) return

    const elements = messagesContainer.value.querySelectorAll('.message-item')
    const targetIndex = searchResults.value[index].index

    if (elements[targetIndex]) {
      elements[targetIndex].scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  /**
   * Reset search when needed
   */
  const resetSearch = () => {
    showSearch.value = false
    searchQuery.value = ''
    searchResults.value = []
    currentSearchIndex.value = -1
  }

  // Watch for search query changes
  watch(searchQuery, performSearch)

  return {
    // State
    showSearch,
    searchQuery,
    searchResults,
    currentSearchIndex,

    // Methods
    toggleSearch,
    performSearch,
    nextSearchResult,
    prevSearchResult,
    scrollToSearchResult,
    resetSearch,
  }
}
