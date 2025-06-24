import { createApp, ComponentPublicInstance } from 'vue'
// @ts-ignore - 临时忽略模块找不到的警告
import MessageComponent from '../components/Message.vue'

interface MessageInstance {
  id: string;
  vm: ComponentPublicInstance;
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

// 计算消息的垂直偏移量
const getVerticalOffset = (offset = 20): number => {
  let verticalOffset = offset
  instances.forEach(({ vm }) => {
    verticalOffset += (vm.$el.offsetHeight || 0) + 16
  })
  return verticalOffset
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
      instances.forEach(({ vm }) => {
        const verticalOffset = getVerticalOffset()
        vm.$el.style.top = `${verticalOffset}px`
      })
      
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
  
  // 计算位置
  const verticalOffset = getVerticalOffset()
  vm.$el.style.top = `${verticalOffset}px`
  
  // 添加到实例列表
  const instance: MessageInstance = {
    id,
    vm
  }
  
  instances.push(instance)
  
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