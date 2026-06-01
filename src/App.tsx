import React, { useState } from 'react'
import { useAppointments } from './hooks/useAppointments'
import { TableView } from './components/TableView'
import { CalendarView } from './components/CalendarView'
import { BoardView } from './components/BoardView'
import { AppointmentForm } from './components/AppointmentForm'
import { TemplateManager } from './components/TemplateManager'
import { Appointment } from './types'
import './styles/App.css'

type ViewType = 'table' | 'calendar' | 'board' | 'templates'
type BoardGroupBy = 'therapyType' | 'date' | 'staffName'

function App() {
  const { appointments, templates, addAppointment, updateAppointment, deleteAppointment, addTemplate, deleteTemplate } =
    useAppointments()

  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [showForm, setShowForm] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [boardGroupBy, setBoardGroupBy] = useState<BoardGroupBy>('therapyType')

  const handleAddAppointment = (data: Omit<Appointment, 'id'>) => {
    addAppointment(data)
    setShowForm(false)
    setSelectedAppointment(null)
  }

  const handleUpdateAppointment = (id: string, updates: Partial<Appointment>) => {
    updateAppointment(id, updates)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>【醫美診所】預約排程管理</h1>
        <p className="subtitle">Notion 風格的預約管理系統</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${currentView === 'table' ? 'active' : ''}`}
          onClick={() => setCurrentView('table')}
        >
          📊 表格檢視
        </button>
        <button
          className={`nav-btn ${currentView === 'calendar' ? 'active' : ''}`}
          onClick={() => setCurrentView('calendar')}
        >
          📅 日曆檢視
        </button>
        <button
          className={`nav-btn ${currentView === 'board' ? 'active' : ''}`}
          onClick={() => setCurrentView('board')}
        >
          📌 看板檢視
        </button>
        <button
          className={`nav-btn ${currentView === 'templates' ? 'active' : ''}`}
          onClick={() => setCurrentView('templates')}
        >
          📝 提醒模板
        </button>
      </nav>

      <div className="app-content">
        {currentView === 'table' && (
          <TableView
            appointments={appointments}
            onUpdate={handleUpdateAppointment}
            onDelete={deleteAppointment}
            onAdd={() => {
              setSelectedAppointment(null)
              setShowForm(true)
            }}
          />
        )}

        {currentView === 'calendar' && (
          <div>
            <CalendarView appointments={appointments} />
            <div className="view-actions">
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                + 新增預約
              </button>
            </div>
          </div>
        )}

        {currentView === 'board' && (
          <div>
            <div className="board-controls">
              <label htmlFor="groupBy">分組方式：</label>
              <select
                id="groupBy"
                value={boardGroupBy}
                onChange={(e) => setBoardGroupBy(e.target.value as BoardGroupBy)}
              >
                <option value="therapyType">療程項目</option>
                <option value="date">預約日期</option>
                <option value="staffName">負責人員</option>
              </select>
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                + 新增預約
              </button>
            </div>
            <BoardView
              appointments={appointments}
              groupBy={boardGroupBy}
              onSelectAppointment={(apt) => {
                setSelectedAppointment(apt)
                setShowForm(true)
              }}
            />
          </div>
        )}

        {currentView === 'templates' && (
          <TemplateManager
            templates={templates}
            onAddTemplate={addTemplate}
            onDeleteTemplate={deleteTemplate}
          />
        )}
      </div>

      {showForm && (
        <AppointmentForm
          initialData={selectedAppointment}
          onSubmit={handleAddAppointment}
          onCancel={() => {
            setShowForm(false)
            setSelectedAppointment(null)
          }}
        />
      )}

      <footer className="app-footer">
        <p>預約總數：{appointments.length} | 模板總數：{templates.length}</p>
      </footer>
    </div>
  )
}

export default App
