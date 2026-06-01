import React, { useState } from 'react'
import { Appointment, TherapyType } from '../types'
import '../styles/AppointmentForm.css'

interface AppointmentFormProps {
  onSubmit: (data: Omit<Appointment, 'id'>) => void
  onCancel: () => void
  initialData?: Partial<Appointment>
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const therapyTypes: TherapyType[] = ['雷射', '微整', '清粉刺', '其他']

  const [formData, setFormData] = useState({
    clientName: initialData?.clientName || '',
    appointmentDateTime: initialData?.appointmentDateTime
      ? new Date(initialData.appointmentDateTime).toISOString().slice(0, 16)
      : '',
    therapyType: (initialData?.therapyType || '') as TherapyType,
    staffName: initialData?.staffName || '',
    phoneNumber: initialData?.phoneNumber || '',
    notificationStatus: initialData?.notificationStatus || ('未通知' as const),
    notes: initialData?.notes || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.clientName ||
      !formData.appointmentDateTime ||
      !formData.therapyType ||
      !formData.staffName ||
      !formData.phoneNumber
    ) {
      alert('請填寫所有必填欄位')
      return
    }

    onSubmit({
      clientName: formData.clientName,
      appointmentDateTime: new Date(formData.appointmentDateTime),
      therapyType: formData.therapyType,
      staffName: formData.staffName,
      phoneNumber: formData.phoneNumber,
      notificationStatus: formData.notificationStatus as any,
      notes: formData.notes,
    })
  }

  return (
    <div className="appointment-form-overlay">
      <div className="appointment-form">
        <h2>{initialData ? '編輯預約' : '新增預約'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="clientName">客人姓名 *</label>
            <input
              id="clientName"
              type="text"
              value={formData.clientName}
              onChange={(e) =>
                setFormData({ ...formData, clientName: e.target.value })
              }
              placeholder="輸入客人姓名"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="appointmentDateTime">預約日期時間 *</label>
            <input
              id="appointmentDateTime"
              type="datetime-local"
              value={formData.appointmentDateTime}
              onChange={(e) =>
                setFormData({ ...formData, appointmentDateTime: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="therapyType">療程項目 *</label>
            <select
              id="therapyType"
              value={formData.therapyType}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  therapyType: e.target.value as TherapyType,
                })
              }
              required
            >
              <option value="">選擇療程項目</option>
              {therapyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="staffName">負責人員 *</label>
            <input
              id="staffName"
              type="text"
              value={formData.staffName}
              onChange={(e) =>
                setFormData({ ...formData, staffName: e.target.value })
              }
              placeholder="輸入負責人名字"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">電話號碼 *</label>
            <input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) =>
                setFormData({ ...formData, phoneNumber: e.target.value })
              }
              placeholder="輸入電話號碼"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="notificationStatus">通知狀態 *</label>
            <select
              id="notificationStatus"
              value={formData.notificationStatus}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  notificationStatus: e.target.value as any,
                })
              }
              required
            >
              <option value="未通知">未通知</option>
              <option value="已通知">已通知</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="notes">備註</label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="輸入備註（選填）"
              rows={3}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {initialData ? '更新' : '新增'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
