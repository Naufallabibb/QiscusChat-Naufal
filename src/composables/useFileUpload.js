/**
 * Composable for File Upload Management
 */
import { ref } from 'vue'

export function useFileUpload() {
  const fileInput = ref(null)
  const selectedFile = ref(null)
  const filePreviewUrl = ref(null)
  const showFilePreview = ref(false)

  /**
   * Trigger file input dialog
   */
  const handleFileAttachment = () => {
    fileInput.value?.click()
  }

  /**
   * Handle file selection
   */
  const handleFileSelect = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    selectedFile.value = file

    const reader = new FileReader()
    reader.onload = (e) => {
      filePreviewUrl.value = e.target.result
      showFilePreview.value = true
    }
    reader.readAsDataURL(file)
  }

  /**
   * Cancel file upload
   */
  const cancelFileUpload = () => {
    selectedFile.value = null
    filePreviewUrl.value = null
    showFilePreview.value = false
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }

  /**
   * Prepare file message data
   */
  const prepareFileMessage = (caption = '') => {
    if (!selectedFile.value) return null

    const file = selectedFile.value
    let type = 'text'

    if (file.type.startsWith('image/')) {
      type = 'image'
    } else if (file.type.startsWith('video/')) {
      type = 'video'
    } else if (file.type === 'application/pdf') {
      type = 'pdf'
    }

    return {
      type,
      caption,
      data: {
        url: filePreviewUrl.value,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      },
    }
  }

  /**
   * Get display text for last message
   */
  const getFileDisplayText = (caption = '') => {
    if (caption) return caption
    if (selectedFile.value) {
      return `📎 ${selectedFile.value.name}`
    }
    return 'File'
  }

  return {
    // Refs
    fileInput,
    selectedFile,
    filePreviewUrl,
    showFilePreview,

    // Methods
    handleFileAttachment,
    handleFileSelect,
    cancelFileUpload,
    prepareFileMessage,
    getFileDisplayText,
  }
}
