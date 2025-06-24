<template>
  <div class="password-generator">
    <div class="tool-section">
      <div class="options-section">
        <h3>密码选项</h3>
        
        <div class="option-card">
          <div class="option-group">
            <label>密码长度: {{ passwordLength }}</label>
            <div class="length-input">
              <input 
                type="range" 
                v-model="passwordLength" 
                min="4" 
                max="64" 
                step="1"
                class="range-input"
              />
              <input 
                type="number" 
                v-model="passwordLength" 
                min="4" 
                max="64" 
                class="number-input"
              />
            </div>
          </div>
          
          <div class="checkbox-options">
            <div class="option-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="includeUppercase">
                <span class="checkbox-text">包含大写字母 (A-Z)</span>
              </label>
            </div>
            
            <div class="option-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="includeLowercase">
                <span class="checkbox-text">包含小写字母 (a-z)</span>
              </label>
            </div>
            
            <div class="option-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="includeNumbers">
                <span class="checkbox-text">包含数字 (0-9)</span>
              </label>
            </div>
            
            <div class="option-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="includeSymbols">
                <span class="checkbox-text">包含特殊符号 (!@#$%^&*()_+-=[]{}|;:,.<>?)</span>
              </label>
            </div>
            
            <div class="option-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="excludeSimilar">
                <span class="checkbox-text">排除相似字符 (i, l, 1, L, o, 0, O)</span>
              </label>
            </div>
          </div>
          
          <div class="action-buttons">
            <button @click="generatePassword" class="action-btn primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-icon">
                <path d="M20.24 12.24C21.3658 11.1142 21.9983 9.58722 21.9983 7.99504C21.9983 6.40285 21.3658 4.87588 20.24 3.75004C19.1142 2.62419 17.5872 1.9917 15.995 1.9917C14.4028 1.9917 12.8758 2.62419 11.75 3.75004L5 10.5V19H13.5L20.24 12.24Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 8L2 22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17.5 15H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              生成密码
            </button>
            <button @click="resetOptions" class="action-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-icon">
                <path d="M1 4V10H7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M23 20V14H17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M20.49 9.00008C19.9828 7.5668 19.1209 6.28542 17.9845 5.27543C16.8482 4.26545 15.4745 3.55978 13.9917 3.22427C12.5089 2.88877 10.9652 2.93436 9.50481 3.35679C8.04437 3.77922 6.71475 4.56473 5.64 5.64008L1 10.0001M23 14.0001L18.36 18.3601C17.2853 19.4354 15.9556 20.221 14.4952 20.6434C13.0348 21.0658 11.4911 21.1114 10.0083 20.7759C8.52547 20.4404 7.1518 19.7347 6.01547 18.7247C4.87913 17.7148 4.01717 16.4334 3.51 15.0001" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              重置选项
            </button>
          </div>
        </div>
      </div>
      
      <div class="result-section">
        <h3>生成结果</h3>
        <div class="password-card">
          <div class="password-display">
            <input 
              type="text" 
              readonly 
              :value="generatedPassword" 
              class="password-input"
            />
            <button @click="copyPassword" class="copy-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="btn-icon">
                <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              复制
            </button>
          </div>
          
          <div class="password-strength">
            <div class="strength-info">
              <div class="strength-label">密码强度:</div>
              <div class="strength-text" :style="{ color: strengthColor }">{{ strengthText }}</div>
            </div>
            <div class="strength-bar-container">
              <div class="strength-bar" :style="{ width: `${strengthPercentage}%`, backgroundColor: strengthColor }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue'

const message = inject('message')

// 密码选项
const passwordLength = ref(16)
const includeUppercase = ref(true)
const includeLowercase = ref(true)
const includeNumbers = ref(true)
const includeSymbols = ref(true)
const excludeSimilar = ref(false)
const generatedPassword = ref('')

// 字符集
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
const numberChars = '0123456789'
const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
const similarChars = 'iIlL1oO0'

// 生成密码
const generatePassword = () => {
  // 检查是否至少选择了一个字符集
  if (!includeUppercase.value && !includeLowercase.value && 
      !includeNumbers.value && !includeSymbols.value) {
    message?.warning('请至少选择一种字符类型')
    return
  }
  
  let chars = ''
  
  if (includeUppercase.value) chars += uppercaseChars
  if (includeLowercase.value) chars += lowercaseChars
  if (includeNumbers.value) chars += numberChars
  if (includeSymbols.value) chars += symbolChars
  
  // 排除相似字符
  if (excludeSimilar.value) {
    for (let i = 0; i < similarChars.length; i++) {
      chars = chars.replace(new RegExp(similarChars[i], 'g'), '')
    }
  }
  
  let password = ''
  for (let i = 0; i < passwordLength.value; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    password += chars[randomIndex]
  }
  
  generatedPassword.value = password
}

// 复制密码
const copyPassword = () => {
  if (!generatedPassword.value) return
  
  navigator.clipboard.writeText(generatedPassword.value)
    .then(() => {
      message?.success('密码已复制到剪贴板！')
    })
    .catch(err => {
      console.error('复制失败:', err)
      message?.error('复制失败: ' + err.message)
    })
}

// 重置选项
const resetOptions = () => {
  passwordLength.value = 16
  includeUppercase.value = true
  includeLowercase.value = true
  includeNumbers.value = true
  includeSymbols.value = true
  excludeSimilar.value = false
  message?.info('已重置为默认选项')
}

// 计算密码强度
const calculateStrength = (password) => {
  if (!password) return 0
  
  let strength = 0
  
  // 长度评分
  strength += Math.min(password.length * 4, 40)
  
  // 字符类型多样性评分
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumbers = /[0-9]/.test(password)
  const hasSymbols = /[^A-Za-z0-9]/.test(password)
  
  const varietyCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols].filter(Boolean).length
  
  strength += varietyCount * 10
  
  // 密码长度额外加分
  if (password.length >= 12) strength += 10
  if (password.length >= 16) strength += 10
  
  return Math.min(strength, 100)
}

// 计算密码强度百分比和描述
const strengthPercentage = computed(() => calculateStrength(generatedPassword.value))

const strengthText = computed(() => {
  const strength = strengthPercentage.value
  
  if (strength >= 80) return '非常强'
  if (strength >= 60) return '强'
  if (strength >= 40) return '中等'
  if (strength >= 20) return '弱'
  return '非常弱'
})

const strengthColor = computed(() => {
  const strength = strengthPercentage.value
  
  if (strength >= 80) return '#10b981' // 绿色
  if (strength >= 60) return '#8BC34A' // 浅绿色
  if (strength >= 40) return '#FFC107' // 黄色
  if (strength >= 20) return '#FF9800' // 橙色
  return '#F44336' // 红色
})

// 初始生成一个密码
generatePassword()

// 当选项改变时自动生成新密码
watch([passwordLength, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar], () => {
  generatePassword()
})
</script>

<style lang="scss" scoped>
.password-generator {
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .option-card, .password-card {
    background-color: var(--vp-c-bg-soft);
    border-radius: 12px;
    border: 1px solid var(--vp-c-divider);
    padding: 1.5rem;
  }
  
  .option-group {
    margin-bottom: 1.2rem;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .length-input {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      .range-input {
        flex-grow: 1;
        height: 6px;
        -webkit-appearance: none;
        appearance: none;
        background-color: var(--vp-c-gutter);
        border-radius: 3px;
        outline: none;
        
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: var(--vp-c-brand);
          cursor: pointer;
          transition: all 0.2s;
          
          &:hover {
            transform: scale(1.2);
          }
        }
        
        &::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: var(--vp-c-brand);
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          
          &:hover {
            transform: scale(1.2);
          }
        }
      }
      
      .number-input {
        width: 60px;
        padding: 0.5rem;
        text-align: center;
        border: 1px solid var(--vp-c-divider);
        border-radius: 6px;
        background-color: var(--vp-c-bg);
        color: var(--vp-c-text-1);
        font-size: 0.95rem;
        
        &:focus {
          outline: none;
          border-color: var(--vp-c-brand);
        }
      }
    }
  }
  
  .checkbox-options {
    margin-bottom: 1.5rem;
  }
  
  .checkbox-label {
    display: flex;
    align-items: center;
    cursor: pointer;
    
    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin-right: 0.5rem;
      accent-color: #539a83;
      cursor: pointer;
    }
    
    .checkbox-text {
      user-select: none;
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 12px;
    
    @media (max-width: 480px) {
      flex-direction: column;
    }
    
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 0.75rem 1.25rem;
      background-color: var(--vp-c-bg);
      color: var(--vp-c-text-1);
      border: 1px solid var(--vp-c-divider);
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: opacity 0.2s;
      flex: 1;
      
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
  
  .password-display {
    display: flex;
    margin-bottom: 1.5rem;
    
    .password-input {
      flex-grow: 1;
      padding: 0.75rem 1rem;
      border: 1px solid var(--vp-c-divider);
      border-radius: 8px 0 0 8px;
      background-color: var(--vp-c-bg);
      color: var(--vp-c-text-1);
      font-size: 1rem;
      border-right: none;
    }
    
    .copy-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 0 1.25rem;
      background-color: var(--vp-c-brand);
      color: white;
      border: none;
      border-radius: 0 8px 8px 0;
      cursor: pointer;
      transition: opacity 0.2s;
      
      &:hover {
        opacity: 0.7;
      }
    }
  }
  
  .password-strength {
    .strength-info {
      display: flex;
      align-items: center;
      margin-bottom: 0.5rem;
      
      .strength-label {
        margin-right: 0.5rem;
        font-weight: 500;
      }
      
      .strength-text {
        font-weight: bold;
      }
    }
    
    .strength-bar-container {
      height: 8px;
      background-color: var(--vp-c-gutter);
      border-radius: 4px;
      overflow: hidden;
      
      .strength-bar {
        height: 100%;
        transition: width 0.3s, background-color 0.3s;
      }
    }
  }
}
</style> 