<template>
  <div class="json-formatter">
    <div class="tool-container">
      <div class="input-section">
        <h3>输入JSON</h3>
        <textarea 
          v-model="jsonInput" 
          placeholder="请输入需要格式化的JSON字符串..." 
          class="json-textarea"
        ></textarea>
        <div class="action-buttons">
          <button @click="formatJson" class="action-btn primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-icon">
              <path d="M21 10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 6H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 14H3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M21 18H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            格式化
          </button>
          <button @click="minifyJson" class="action-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-icon">
              <path d="M4 9H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M4 15H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 3L8 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M16 3L14 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            压缩
          </button>
          <button @click="clearInput" class="action-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-icon">
              <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            清空
          </button>
        </div>
      </div>
      
      <div class="output-section">
        <h3>输出结果</h3>
        <textarea 
          v-model="jsonOutput" 
          readonly 
          class="json-textarea"
        ></textarea>
        <div class="action-row">
          <button @click="copyToClipboard" class="action-btn copy-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-icon">
              <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            复制
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'

const message = inject('message')
const jsonInput = ref('')
const jsonOutput = ref('')

const formatJson = () => {
  try {
    if (!jsonInput.value.trim()) {
      message?.warning('请输入JSON字符串')
      return
    }
    
    const obj = JSON.parse(jsonInput.value)
    jsonOutput.value = JSON.stringify(obj, null, 2)
    message?.success('JSON格式化成功')
  } catch (error) {
    jsonOutput.value = ''
    message?.error(`格式化错误: ${error.message}`)
  }
}

const minifyJson = () => {
  try {
    if (!jsonInput.value.trim()) {
      message?.warning('请输入JSON字符串')
      return
    }
    
    const obj = JSON.parse(jsonInput.value)
    jsonOutput.value = JSON.stringify(obj)
    errorMessage.value = ''
    message?.success('JSON压缩成功')
  } catch (error) {
    jsonOutput.value = ''
    message?.error(`压缩错误: ${error.message}`)
  }
}

const clearInput = () => {
  jsonInput.value = ''
  jsonOutput.value = ''
}

const copyToClipboard = () => {
  if (!jsonOutput.value) {
    message?.warning('没有可复制的内容')
    return
  }
  
  navigator.clipboard.writeText(jsonOutput.value)
    .then(() => {
      message?.success('已复制到剪贴板！')
    })
    .catch(err => {
      message?.error('复制失败: ' + err.message)
    })
}
</script>

<style lang="scss" scoped>
.json-formatter {
  max-width: 800px;
  margin: 0 auto;
  color: var(--vp-c-text-1);
  
  h2 {
    font-size: 1.8rem;
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
    font-weight: 500;
    letter-spacing: -0.01em;
  }
  
  h3 {
    font-size: 1.2rem;
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 1rem;
    color: var(--vp-c-text-1);
  }
  
  .tool-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
    
    .input-section, .output-section {
      display: flex;
      flex-direction: column;
    }
    
    .json-textarea {
      width: 100%;
      height: 260px;
      resize: none;
      padding: 1rem;
      font-size: 0.9rem;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      border: 1px solid var(--vp-c-divider);
      border-radius: 12px;
      background-color: var(--vp-c-bg-soft);
      color: var(--vp-c-text-1);
      transition: border-color 0.2s;
      margin-bottom: 1rem;
      
      &:focus {
        outline: none;
        border-color: var(--vp-c-brand);
      }
    }
    
    .action-buttons {
      display: flex;
      gap: 10px;
      margin-bottom: 1rem;
      
      @media (max-width: 768px) {
        flex-wrap: wrap;
      }
      
      .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 0.625rem 1rem;
        background-color: var(--vp-c-bg-soft);
        color: var(--vp-c-text-1);
        border: 1px solid var(--vp-c-divider);
        border-radius: 8px;
        cursor: pointer;
        font-weight: 500;
        transition: opacity 0.2s;
        flex: 1;
        min-width: 80px;
        &:hover {
          opacity: 0.7;
        }
        
        &.primary {
          background-color: var(--vp-c-brand);
          color: white;
          border: none;
        }
      }
    }
    
    .action-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .copy-btn {
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
        &:hover {
          opacity: 0.7;
        }
        
        &:active {
          transform: translateY(0);
        }
      }
    }
  }
}
</style> 