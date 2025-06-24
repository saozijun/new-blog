<template>
  <div class="timestamp-converter">
    <div class="tool-section">
      <div class="current-time-section">
        <h3>当前时间</h3>
        <div class="current-time">
          <div class="time-display">{{ currentTime }}</div>
          <button @click="updateCurrentTime" class="action-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-icon">
              <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M20.49 9.00008C19.9828 7.5668 19.1209 6.28542 17.9845 5.27543C16.8482 4.26545 15.4745 3.55978 13.9917 3.22427C12.5089 2.88877 10.9652 2.93436 9.50481 3.35679C8.04437 3.77922 6.71475 4.56473 5.64 5.64008L1 10.0001M23 14.0001L18.36 18.3601C17.2853 19.4354 15.9556 20.221 14.4952 20.6434C13.0348 21.0658 11.4911 21.1114 10.0083 20.7759C8.52547 20.4404 7.1518 19.7347 6.01547 18.7247C4.87913 17.7148 4.01717 16.4334 3.51 15.0001" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            刷新
          </button>
        </div>
      </div>
      
      <div class="conversion-container">
        <div class="timestamp-section">
          <h3>Unix时间戳（秒）</h3>
          <div class="input-group">
            <input 
              type="number" 
              v-model="timestamp" 
              class="time-input" 
              placeholder="请输入Unix时间戳（秒）"
            />
            <div class="button-group">
              <button @click="timestampToDate" class="action-btn primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-icon">
                  <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 8H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                转换为日期
              </button>
              <button @click="setCurrentTimestamp" class="action-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-icon">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                当前时间戳
              </button>
            </div>
          </div>
        </div>
        
        <div class="date-section">
          <h3>日期时间</h3>
          <div class="input-group">
            <input 
              type="datetime-local" 
              v-model="dateTime" 
              class="time-input date-input"
            />
            <div class="button-group">
              <button @click="dateToTimestamp" class="action-btn primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-icon">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                转换为时间戳
              </button>
              <button @click="setCurrentDateTime" class="action-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-icon">
                  <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 8H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                当前日期
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="result" class="result-section">
        <h3>转换结果</h3>
        <div class="result-box">
          <div class="result-content">{{ result }}</div>
          <button @click="copyResult" class="action-btn copy-btn">
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
import { ref, onMounted, inject } from 'vue'

const message = inject('message')
const timestamp = ref('')
const dateTime = ref('')
const currentTime = ref('')
const result = ref('')

// 更新当前时间显示
const updateCurrentTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString()
}

// 设置当前时间戳
const setCurrentTimestamp = () => {
  const now = Math.floor(Date.now() / 1000)
  timestamp.value = now
}

// 设置当前日期时间
const setCurrentDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  
  dateTime.value = `${year}-${month}-${day}T${hours}:${minutes}`
}

// 时间戳转日期
const timestampToDate = () => {
  if (!timestamp.value) {
    result.value = '请输入有效的时间戳'
    message?.warning('请输入有效的时间戳')
    return
  }
  
  try {
    const date = new Date(Number(timestamp.value) * 1000)
    if (isNaN(date.getTime())) {
      throw new Error('无效日期')
    }
    
    const formattedDate = date.toLocaleString()
    result.value = `时间戳 ${timestamp.value} 对应的日期时间为：${formattedDate}`
    
    // 更新日期输入框
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    dateTime.value = `${year}-${month}-${day}T${hours}:${minutes}`
    message?.success('转换成功')
  } catch (error) {
    result.value = `转换失败: ${error.message}`
    message?.error(`转换失败: ${error.message}`)
  }
}

// 日期转时间戳
const dateToTimestamp = () => {
  if (!dateTime.value) {
    result.value = '请选择有效的日期时间'
    message?.warning('请选择有效的日期时间')
    return
  }
  
  try {
    const date = new Date(dateTime.value)
    if (isNaN(date.getTime())) {
      throw new Error('无效日期')
    }
    
    const unixTimestamp = Math.floor(date.getTime() / 1000)
    result.value = `日期时间 ${date.toLocaleString()} 对应的Unix时间戳为：${unixTimestamp}`
    timestamp.value = unixTimestamp
    message?.success('转换成功')
  } catch (error) {
    result.value = `转换失败: ${error.message}`
    message?.error(`转换失败: ${error.message}`)
  }
}

// 复制结果
const copyResult = () => {
  if (!result.value) {
    message?.warning('没有可复制的内容')
    return
  }
  
  navigator.clipboard.writeText(result.value)
    .then(() => {
      message?.success('已复制到剪贴板！')
    })
    .catch(err => {
      console.error('复制失败:', err)
      message?.error('复制失败: ' + err.message)
    })
}

// 初始化
onMounted(() => {
  updateCurrentTime()
  setCurrentTimestamp()
  setCurrentDateTime()
})
</script>

<style lang="scss" scoped>
.timestamp-converter {
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
  
  .tool-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  
  .current-time-section {
    margin-bottom: 10px;
  }
  
  .current-time {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .time-display {
      flex-grow: 1;
      padding: 0.75rem 1rem;
      background-color: var(--vp-c-bg-soft);
      border: 1px solid var(--vp-c-divider);
      border-radius: 8px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 0.95rem;
    }
  }
  
  .conversion-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .timestamp-section, .date-section {
    display: flex;
    flex-direction: column;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .time-input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid var(--vp-c-divider);
      border-radius: 8px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      background-color: var(--vp-c-bg-soft);
      color: var(--vp-c-text-1);
      font-size: 0.95rem;
      transition: border-color 0.2s;
      
      &:focus {
        outline: none;
        border-color: var(--vp-c-brand);
      }
      
      &.date-input {
        font-family: inherit;
      }
    }
    
    .button-group {
      display: flex;
      gap: 10px;
      
      @media (max-width: 480px) {
        flex-direction: column;
      }
    }
  }
  
  .result-section {
    margin-top: 10px;
    
    .result-box {
      display: flex;
      gap: 12px;
      align-items: center;
      
      .result-content {
        flex-grow: 1;
        padding: 0.75rem 1rem;
        background-color: var(--vp-c-bg-soft);
        border: 1px solid var(--vp-c-divider);
        border-radius: 8px;
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
        font-size: 0.95rem;
        min-height: 20px;
        line-height: 1.5;
      }
      
      .copy-btn {
        flex-shrink: 0;
      }
    }
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
    white-space: nowrap;
    
    &:hover {
      opacity: .7
    }
    
    &.primary {
      background-color: var(--vp-c-brand);
      color: white;
      border: none;
    }
    
    &.copy-btn {
      background-color: var(--vp-c-brand);
      color: white;
      border: none;
    }
  }
}
</style> 