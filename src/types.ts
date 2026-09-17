export type Screen =
  | 'home'
  | 'register'
  | 'login'
  | 'creator-dashboard'
  | 'sponsor-dashboard'
  | 'create-campaign'
  | 'campaign-page'
  | 'payment-flow'

export interface User {
  name: string
  email: string
  role: 'creator' | 'sponsor'
}

export interface Campaign {
  id: number
  title: string
  description: string
  goal: number
  raised: number
  duration: number
  daysLeft: number
  category: string
  videoUrl: string
  rewards: { id: number; title: string; description: string; amount: string }[]
  sponsors: number
  creatorName: string
  creatorEmail: string
  publishedAt: string
}

export interface Draft {
  id: number
  title: string
  description: string
  goal: string
  duration: string
  category: string
  videoUrl: string
  rewards: { id: number; title: string; description: string; amount: string }[]
  savedAt: string
  complete: number
}
