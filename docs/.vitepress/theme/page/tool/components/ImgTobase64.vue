<template>
  <div class="img-to-base64">
    <div class="upload-area" 
         :class="{ 'is-dragover': isDragging }"
         @click="triggerFileInput" 
         @dragover.prevent="isDragging = true" 
         @dragleave.prevent="isDragging = false"
         @dragenter.prevent="isDragging = true"
         @drop.prevent="handleFileDrop">
      <input type="file" accept="image/*" @change="handleFileChange" ref="fileInput" class="file-input" />
      
      <div v-if="!imageBase64" class="upload-placeholder">
        <div class="upload-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="upload-text">
          <span>点击或拖拽图片至此处</span>
          <small>{{ fileName || '支持 JPG、PNG、GIF 等格式' }}</small>
        </div>
      </div>
      
      <div v-else class="preview-container">
        <img :src="imageBase64" alt="预览" class="preview-image" />
        <div class="preview-actions">
          <button @click.stop="triggerFileInput" class="action-btn change-btn" title="更换图片">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button @click.stop="clearResult" class="action-btn remove-btn" title="移除图片">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="imageBase64" class="result-container">
      <div class="base64-section">
        <div class="section-header">
          <h3>Base64 结果</h3>
          <div class="format-switch" style="margin-left: auto;">
            <label class="switch">
              <input type="checkbox" v-model="appendImgTag">
              <span class="slider"></span>
            </label>
            <span class="switch-label">追加 img 标签</span>
          </div>
          <div class="format-switch">
            <label class="switch">
              <input type="checkbox" v-model="removePrefix">
              <span class="slider"></span>
            </label>
            <span class="switch-label">去掉 base64 前缀</span>
          </div>
        </div>
        <textarea readonly :value="getResultText" class="base64-result"></textarea>
        <button @click="copyToClipboard" class="copy-btn">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>复制到剪贴板</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed } from 'vue'

const message = inject('message')
const fileInput = ref(null)
const fileName = ref('')
const imageBase64 = ref('')
const appendImgTag = ref(false)
const removePrefix = ref(false)
const isDragging = ref(false)

const getResultText = computed(() => {
  if (!imageBase64.value) return ''
  let result = imageBase64.value
  if (removePrefix.value) {
    // 去掉 data:image/...;base64, 前缀
    const match = result.match(/^data:image\/[a-zA-Z0-9+]+;base64,(.*)$/)
    if (match) {
      result = match[1]
    }
  }
  if (appendImgTag.value) {
    return `<img src="${removePrefix.value ? 'data:image/*;base64,' + result : result}" alt="" />`
  }
  return result
})

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (!file || !file.type.startsWith('image/')) {
    message?.error('请上传有效的图片文件')
    return
  }
  
  processFile(file)
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  processFile(file)
}

const processFile = (file) => {
  fileName.value = file.name
  
  const reader = new FileReader()
  reader.onload = (e) => {
    imageBase64.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(getResultText.value)
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
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style lang="scss" scoped>
.img-to-base64 {
  max-width: 800px;
  margin: 0 auto;
  color: var(--vp-c-text-1);
  
  .upload-area {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 280px;
    background-color: var(--vp-c-bg-soft);
    border: 2px dashed var(--vp-c-divider);
    border-radius: 12px;
    transition: all 0.2s ease;
    margin-bottom: 2rem;
    position: relative;
    overflow: hidden;
    
    &:hover, &.is-dragover {
      border-color: var(--vp-c-brand);
      background-color: var(--vp-c-bg-soft-up);
      
      .upload-icon {
        transform: scale(1.1);
      }
    }
    
    &.is-dragover {
      border-width: 3px;
      box-shadow: 0 0 10px var(--vp-c-brand);
    }
    
    .file-input {
      display: none;
    }
    
    .upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
    }
    
    .upload-icon {
      width: 50px;
      height: 50px;
      margin-bottom: 1rem;
      color: var(--vp-c-brand);
      transition: transform 0.2s ease;
      
      svg {
        width: 100%;
        height: 100%;
      }
    }
    
    .upload-text {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      span {
        font-size: 1rem;
        font-weight: 500;
      }
      
      small {
        color: var(--vp-c-text-2);
        font-size: 0.85rem;
      }
    }
    
    .preview-container {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .preview-image {
        max-width: 100%;
        max-height: 280px;
        object-fit: contain;
      }
      
      .preview-actions {
        position: absolute;
        top: 12px;
        right: 12px;
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      
      &:hover .preview-actions {
        opacity: 1;
      }
      
      .action-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.5);
        border: none;
        cursor: pointer;
        color: white;
        transition: all 0.2s ease;
        
        svg {
          width: 16px;
          height: 16px;
        }
        
        &:hover {
          background-color: rgba(0, 0, 0, 0.7);
          transform: scale(1.1);
        }
        
        &.change-btn {
          background-color: var(--vp-c-brand);
          
          &:hover {
            background-color: var(--vp-c-brand);
          }
        }
      }
    }
  }
  
  .result-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
    
    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      
      h3 {
        font-size: 1.1rem;
        font-weight: 500;
        margin: 0;
        color: var(--vp-c-text-1);
      }
      
      .format-switch {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-left: 20px;
        .switch {
          position: relative;
          display: inline-block;
          width: 36px;
          height: 20px;
          
          input {
            opacity: 0;
            width: 0;
            height: 0;
            
            &:checked + .slider {
              background-color: var(--vp-c-brand);
            }
            
            &:checked + .slider:before {
              transform: translateX(16px);
            }
          }
          
          .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: var(--vp-c-divider);
            transition: .4s;
            border-radius: 34px;
            
            &:before {
              position: absolute;
              content: "";
              height: 16px;
              width: 16px;
              left: 2px;
              bottom: 2px;
              background-color: white;
              transition: .4s;
              border-radius: 50%;
            }
          }
        }
        
        .switch-label {
          font-size: 0.85rem;
          color: var(--vp-c-text-2);
        }
      }
    }
    
    .base64-section {
      display: flex;
      flex-direction: column;
    }
    
    .base64-result {
      width: 100%;
      height: 220px;
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
    
    .copy-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 0.75rem;
      background-color: var(--vp-c-brand);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: opacity 0.2s;
      width: 100%;
      
      svg {
        width: 16px;
        height: 16px;
      }
      
      &:hover {
        opacity: 0.9;
      }
    }
  }
}
</style>
