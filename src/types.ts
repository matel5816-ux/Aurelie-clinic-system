export type TherapyType = '雷射' | '微整' | '清粉刺' | '其他'
export type NotificationStatus = '未通知' | '已通知'

export interface Appointment {
  id: string
  clientName: string
  appointmentDateTime: Date
  therapyType: TherapyType
  staffName: string
  phoneNumber: string
  notificationStatus: NotificationStatus
  notes?: string
}

export interface Template {
  id: string
  title: string
  content: string
  createdAt: Date
}

export interface ViewType {
  type: 'table' | 'calendar' | 'board'
}
