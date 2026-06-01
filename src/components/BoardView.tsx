import React, { useState } from 'react'
import { Appointment } from '../types'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import '../styles/BoardView.css'

interface BoardViewProps {
  appointments: Appointment[]
  groupBy: 'therapyType' | 'date' | 'staffName'
  onSelectAppointment?: (apt: Appointment) => void
}

export const BoardView: React.FC<BoardViewProps> = ({
  appointments,
  groupBy = 'therapyType',
  onSelectAppointment,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)

  const groupAppointments = () => {
    const grouped: Record<string, Appointment[]> = {}

    appointments.forEach((apt) => {
      let key: string
      if (groupBy === 'therapyType') {
        key = apt.therapyType
      } else if (groupBy === 'date') {
        key = format(apt.appointmentDateTime, 'yyyy-MM-dd', { locale: zhTW })
      } else {
        key = apt.staffName
      }

      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(apt)
    })

    return grouped
  }

  const grouped = groupAppointments()
  const groups = Object.keys(grouped).sort()

  return (
    <div className="board-view">
      <div className="board-header">
        <h2>看板檢視</h2>
        <div className="board-info">
          分組方式：{groupBy === 'therapyType' ? '療程項目' : groupBy === 'date' ? '預約日期' : '負責人員'}
        </div>
      </div>

      <div className="board-container">
        {groups.map((groupName) => (
          <div key={groupName} className="board-column">
            <div
              className={`column-header group-${groupName}`}
              onClick={() =>
                setSelectedGroup(selectedGroup === groupName ? null : groupName)
              }
            >
              <h3>{groupName}</h3>
              <span className="count">{grouped[groupName].length}</span>
            </div>

            <div className="cards-list">
              {grouped[groupName].map((apt) => (
                <div
                  key={apt.id}
                  className={`appointment-card therapy-${apt.therapyType}`}
                  onClick={() => {
                    onSelectAppointment?.(apt)
                    setSelectedGroup(groupName)
                  }}
                >
                  <div className="card-title">{apt.clientName}</div>
                  <div className="card-info">
                    <div className="info-row">
                      <span className="label">時間：</span>
                      <span className="value">
                        {format(apt.appointmentDateTime, 'HH:mm', {
                          locale: zhTW,
                        })}
                      </span>
                    </div>
                    <div className="info-row">
                      <span className="label">項目：</span>
                      <span className="value">{apt.therapyType}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">人員：</span>
                      <span className="value">{apt.staffName}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">電話：</span>
                      <span className="value">{apt.phoneNumber}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">通知：</span>
                      <span className={`status-badge status-${apt.notificationStatus}`}>
                        {apt.notificationStatus}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
