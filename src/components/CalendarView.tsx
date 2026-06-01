import React, { useState } from 'react'
import { Appointment } from '../types'
import { eachDayOfInterval, startOfMonth, endOfMonth, isSameDay } from 'date-fns'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import '../styles/CalendarView.css'

interface CalendarViewProps {
  appointments: Appointment[]
  onSelectDate?: (date: Date) => void
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  appointments,
  onSelectDate,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // 補充前後月份的日期
  const startDate = new Date(monthStart)
  startDate.setDate(startDate.getDate() - monthStart.getDay())

  const endDate = new Date(monthEnd)
  endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()))

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate })

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter((apt) => isSameDay(apt.appointmentDateTime, day))
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h2>日曆檢視</h2>
        <div className="calendar-controls">
          <button className="btn btn-nav" onClick={previousMonth}>
            ← 上月
          </button>
          <h3>{format(currentMonth, 'yyyy年 MMMM', { locale: zhTW })}</h3>
          <button className="btn btn-nav" onClick={nextMonth}>
            下月 →
          </button>
        </div>
      </div>

      <div className="calendar-container">
        <div className="weekdays">
          {['日', '一', '二', '三', '四', '五', '六'].map((day) => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            const dayAppointments = getAppointmentsForDay(day)
            const isCurrentMonth = isSameDay(day, currentMonth) ||
              (day.getMonth() === currentMonth.getMonth() &&
                day.getFullYear() === currentMonth.getFullYear())

            return (
              <div
                key={index}
                className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'}`}
                onClick={() => onSelectDate?.(day)}
              >
                <div className="day-number">{day.getDate()}</div>
                <div className="appointments-list">
                  {dayAppointments.slice(0, 3).map((apt) => (
                    <div
                      key={apt.id}
                      className={`appointment-badge therapy-${apt.therapyType}`}
                      title={`${apt.clientName} - ${apt.therapyType}`}
                    >
                      {apt.clientName.slice(0, 3)}
                    </div>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="more-count">+{dayAppointments.length - 3}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
