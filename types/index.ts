// types/index.ts

export interface User {
  id: string
  email: string
  user_metadata?: {
    firstName?: string
    lastName?: string
    company?: string
    website?: string
  }
}

export interface Session {
  access_token: string
  user: User
}

export interface Conversation {
  id: string
  sessionId: string
  visitorName?: string
  visitorEmail?: string
  status: 'active' | 'converted' | 'completed' | 'abandoned'
  messageCount: number
  orderValue?: number
  createdAt: Date
  lastMessageAt: Date
}

export interface Order {
  id: string
  orderNumber: string
  conversationId: string
  customerName: string
  customerPhone: string
  customerEmail: string
  items: OrderItem[]
  totalAmount: number
  paymentMethod: 'mobile_money' | 'cash' | 'card' | 'bank_transfer'
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  name: string
  quantity: number
  price: number
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  keywords?: string
  priority: 'low' | 'normal' | 'high'
  createdAt: Date
}

export interface Document {
  id: string
  name: string
  type: string
  size: number
  category: string
  description: string
  createdAt: Date
  status: 'processing' | 'processed' | 'error'
}

// Global declarations for better TypeScript support
declare global {
  interface Window {
    fs: {
      readFile: (path: string, options?: { encoding?: string }) => Promise<Uint8Array | string>
    }
  }
}