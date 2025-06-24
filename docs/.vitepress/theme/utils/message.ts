import { createApp, ComponentPublicInstance } from 'vue'
// @ts-ignore - 临时忽略模块找不到的警告
import MessageComponent from '../components/Message.vue'

interface MessageInstance {
  id: string;
  vm: ComponentPublicInstance;
  height: number;
}

interface MessageOptions {
  message?: string;
  type?: 'success' | 'warning' | 'info' | 'error';
  duration?: number;
  showClose?: boolean;
  onClose?: () => void;
  [key: string]: any;
}

interface MessageReturn {
  close: () => void;
}

interface MessageFunction {
  (options: MessageOptions | string): MessageReturn;
  success: (options: MessageOptions | string) => MessageReturn;
  warning: (options: MessageOptions | string) => MessageReturn;
  info: (options: MessageOptions | string) => MessageReturn;
  error: (options: MessageOptions | string) => MessageReturn;
}

// 存储所有消息实例
const instances: MessageInstance[] = []
let seed = 1

// 消息之间的间距
const MESSAGE_GAP = 16
// 消息的最小高度（包含内边距）
const MIN_HEIGHT = 54

// 更新所有消息的位置
const updatePositions = () => {
  let currentOffset = 20
  instances.forEach(instance => {
    // @ts-ignore
    instance.vm.offset = currentOffset
    currentOffset += instance.height + MESSAGE_GAP
  })
}

// 基础消息方法
const MessageBase = (options: MessageOptions | string = {}): MessageReturn => {
  // 处理字符串参数
  if (typeof options === 'string') {
    options = { message: options }
  }
  
  // 默认配置
  const defaultOptions: MessageOptions = {
    duration: 3000,
    type: 'info',
    message: '',
    showClose: false,
    onClose: undefined
  }
  
  // 合并选项
  const mergedOptions = { ...defaultOptions, ...options }
  
  // 生成唯一ID
  const id = `message_${seed++}`
  
  // 创建容器
  const container = document.createElement('div')
  
  // 创建应用实例
  const app = createApp(MessageComponent, {
    ...mergedOptions,
    id,
    onDestroy: () => {
      // 移除实例
      const index = instances.findIndex(instance => instance.id === id)
      if (index > -1) {
        instances.splice(index, 1)
      }
      
      // 更新剩余消息的位置
      updatePositions()
      
      // 调用用户传入的关闭回调
      if (typeof mergedOptions.onClose === 'function') {
        mergedOptions.onClose()
      }
      
      // 卸载组件
      app.unmount()
      
      // 移除容器
      if (container.parentNode) {
        container.parentNode.removeChild(container)
      }
    }
  })
  
  // 挂载应用
  const vm = app.mount(container) as ComponentPublicInstance
  
  // 添加到DOM
  document.body.appendChild(container)
  
  // 创建实例对象并添加到实例列表
  const instance: MessageInstance = {
    id,
    vm,
    height: MIN_HEIGHT // 初始化为最小高度
  }
  
  instances.push(instance)
  
  // 使用 setTimeout 确保 DOM 已更新并且元素已渲染
  setTimeout(() => {
    // 更新实例的高度，确保至少有最小高度
    const elHeight = vm.$el.offsetHeight
    instance.height = Math.max(elHeight, MIN_HEIGHT)
    
    // 更新所有消息的位置
    updatePositions()
  }, 50)
  
  // 设置自动关闭
  let timer: number | null = null
  if (mergedOptions.duration && mergedOptions.duration > 0) {
    timer = window.setTimeout(() => {
      // @ts-ignore
      vm.close()
    }, mergedOptions.duration)
  }
  
  // 鼠标悬停时清除计时器，离开时重新计时
  vm.$el.addEventListener('mouseenter', () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  })
  
  vm.$el.addEventListener('mouseleave', () => {
    if (mergedOptions.duration && mergedOptions.duration > 0) {
      timer = window.setTimeout(() => {
        // @ts-ignore
        vm.close()
      }, mergedOptions.duration)
    }
  })
  
  return {
    close: () => {
      // @ts-ignore
      vm.close()
    }
  }
}

// 创建最终的 Message 函数
const Message = MessageBase as MessageFunction

// 提供不同类型的消息方法
;['success', 'warning', 'info', 'error'].forEach(type => {
  Message[type as keyof MessageFunction] = (options: MessageOptions | string = {}) => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type as 'success' | 'warning' | 'info' | 'error'
    return MessageBase(options)
  }
})

export default Message 