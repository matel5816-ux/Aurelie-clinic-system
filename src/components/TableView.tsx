import React, { useState } from 'react'
import { Appointment, TherapyType, NotificationStatus } from '../types'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import '../styles/TableView.css'

interface TableViewProps {
  appointments: Appointment[]
  onUpdate: (id: string, updates: Partial<Appointment>) => void
  onDelete: (id: string) => void
  onAdd: () => void
}

export const TableView: React.FC<TableViewProps> = ({
  appointments,
  onUpdate,
  onDelete,
  onAdd,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Appointment>>({})

  const therapyTypes: TherapyType[] = ['雷射', '微整', '清粉刺', '其他']
  const statuses: NotificationStatus[] = ['未通知', '已通知']

  const handleEdit = (apt: Appointment) => {
    setEditingId(apt.id)
    setEditData({ ...apt })
  }

  const handleSave = () => {
    if (editingId && editData) {
      onUpdate(editingId, editData)
      setEditingId(null)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditData({})
  }

  return (
    <div className="table-view">
      <div className="table-header">
        <h2>預約表格</h2>
        <button className="btn btn-primary" onClick={onAdd}>
          + 新增預約
        </button>
      </div>

      <div className="table-container">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>客人姓名</th>
              <th>預約時間</th>
              <th>療程項目</th>
              <th>負責人員</th>
              <th>電話號碼</th>
              <th>通知狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((apt) => (
              <tr key={apt.id} className={editingId === apt.id ? 'editing' : ''}>
                <td>
                  {editingId === apt.id ? (
                    <input
                      type="text"
                      value={editData.clientName || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, clientName: e.target.value })
                      }
                    />
                  ) : (
                    apt.clientName
                  )}
                </td>
                <td>
                  {editingId === apt.id ? (
                    <input
                      type="datetime-local"
                      value={
                        editData.appointmentDateTime
                          ? new Date(editData.appointmentDateTime)
                              .toISOString()
                              .slice(0, 16)
                          : ''
                      }
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          appointmentDateTime: new Date(e.target.value),
                        })
                      }
                    />
                  ) : (
                    format(apt.appointmentDateTime, 'yyyy-MM-dd HH:mm', {
                      locale: zhTW,
                    })
                  )}
                </td>
                <td>
                  {editingId === apt.id ? (
                    <select
                      value={editData.therapyType || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          therapyType: e.target.value as TherapyType,
                        })
                      }
                    >
                      <option value="">選擇療程</option>
                      {therapyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={`therapy-badge therapy-${apt.therapyType}`}>
                      {apt.therapyType}
                    </span>
                  )}
                </td>
                <td>
                  {editingId === apt.id ? (
                    <input
                      type="text"
                      value={editData.staffName || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, staffName: e.target.value })
                      }
                    />
                  ) : (
                    apt.staffName
                  )}
                </td>
                <td>
                  {editingId === apt.id ? (
                    <input
                      type="tel"
                      value={editData.phoneNumber || ''}
                      onChange={(e) =>
                        setEditData({ ...editData, phoneNumber: e.target.value })
                      }
                    />
                  ) : (
                    apt.phoneNumber
                  )}
                </td>
                <td>
                  {editingId === apt.id ? (
                    <select
                      value={editData.notificationStatus || ''}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          notificationStatus: e.target.value as NotificationStatus,
                        })
                      }
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span
                      className={`status-badge status-${apt.notificationStatus}`}
                    >
                      {apt.notificationStatus}
                    </span>
                  )}
                </td>
                <td className="actions">
                  {editingId === apt.id ? (
                    <>
                      <button
                        className="btn btn-small btn-success"
                        onClick={handleSave}
                      >
                        保存
                      </button>
                      <button
                        className="btn btn-small btn-secondary"
                        onClick={handleCancel}
                      >
                        取消
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-small btn-edit"
                        onClick={() => handleEdit(apt)}
                      >
                        編輯
                      </button>
                      <button
                        className="btn btn-small btn-danger"
                        onClick={() => onDelete(apt.id)}
                      >
                        刪除
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
