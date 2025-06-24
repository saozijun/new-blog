<template>
  <div class="img-to-base64">
    <div class="upload-container">
      <input type="file" accept="image/*" @change="handleFileChange" ref="fileInput" class="file-input" />
      <button class="upload-btn" @click="triggerFileInput">选择图片</button>
      <span class="file-name">{{ fileName || '未选择文件' }}</span>
    </div>
    
    <div v-if="imageBase64" class="result-container">
      <div class="preview-section">
        <h3>预览</h3>
        <div class="preview-wrapper">
          <img :src="imageBase64" alt="预览" class="preview-image" />
        </div>
      </div>
      
      <div class="base64-section">
        <h3>Base64 结果</h3>
        <textarea readonly v-model="imageBase64" class="base64-result"></textarea>
        <div class="action-buttons">
          <button @click="copyToClipboard" class="action-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-icon">
              <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            复制
          </button>
          <button @click="clearResult" class="action-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-icon">
              <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            清除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const message = inject('message')
const fileInput = ref(null)
const fileName = ref('')
const imageBase64 = ref('')

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  fileName.value = file.name
  
  const reader = new FileReader()
  reader.onload = (e) => {
    imageBase64.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(imageBase64.value)
    .then(() => {
      message?.success('已复制到剪贴板！')
    })
    .catch(err => {
      console.error('复制失败:', err)
      message?.error('复制失败: ' + err.message)
    })
}

const clearResult = () => {
  imageBase64.value = ''
  fileName.value = ''
  fileInput.value.value = ''
}
</script>

<style lang="scss" scoped>
.img-to-base64 {
  max-width: 800px;
  margin: 0 auto;
  color: var(--vp-c-text-1);
  
  h3 {
    font-size: 1.2rem;
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--vp-c-text-1);
  }
  
  .upload-container {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 2rem;
    background-color: var(--vp-c-bg-soft);
    padding: 1.25rem;
    border-radius: 12px;
    border: 1px solid var(--vp-c-divider);
    
    .file-input {
      display: none;
    }
    
    .upload-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 1.25rem;
      background-color: var(--vp-c-brand);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: opacity 0.2s;
      white-space: nowrap;
      
      &:hover {
        opacity: 0.7;
      }
    }
    
    .file-name {
      color: var(--vp-c-text-2);
      font-size: 0.95rem;
      padding: 1rem 0.75rem;
      background-color: var(--vp-c-bg);
      border-radius: 6px;
      border: 1px solid var(--vp-c-divider);
      flex-grow: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  
  .result-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    .preview-section, .base64-section {
      display: flex;
      flex-direction: column;
    }
    
    .preview-wrapper {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--vp-c-bg-soft);
      border-radius: 12px;
      padding: 1.25rem;
      border: 1px solid var(--vp-c-divider);
      min-height: 200px;
    }
    
    .preview-image {
      max-width: 100%;
      max-height: 200px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    .base64-result {
      width: 100%;
      height: 200px;
      resize: none;
      padding: 1rem;
      font-size: 0.85rem;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      border: 1px solid var(--vp-c-divider);
      border-radius: 12px;
      background-color: var(--vp-c-bg-soft);
      color: var(--vp-c-text-1);
      margin-bottom: 1rem;
      
      &:focus {
        outline: none;
        border-color: var(--vp-c-brand);
      }
    }
    
    .action-buttons {
      display: flex;
      gap: 12px;
      
      .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 0.625rem 1.25rem;
        background-color: var(--vp-c-brand);
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: opacity 0.2s;
        flex: 1;
        
        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
}
</style>
