import { useState, useCallback, useEffect } from 'react'
import { Appointment, Template } from '../types'
import { v4 as uuidv4 } from 'uuid'

const APPOINTMENTS_STORAGE_KEY = 'beauty_clinic_appointments'
const TEMPLATES_STORAGE_KEY = 'beauty_clinic_templates'

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [templates, setTemplates] = useState<Template[]>([])

  useEffect(() => {
    const savedAppointments = localStorage.getItem(APPOINTMENTS_STORAGE_KEY)
    const savedTemplates = localStorage.getItem(TEMPLATES_STORAGE_KEY)

    if (savedAppointments) {
      try {
        const parsed = JSON.parse(savedAppointments)
        setAppointments(
          parsed.map((apt: any) => ({
            ...apt,
            appointmentDateTime: new Date(apt.appointmentDateTime),
          }))
        )
      } catch (error) {
        console.error('Failed to parse appointments:', error)
      }
    }

    if (savedTemplates) {
      try {
        const parsed = JSON.parse(savedTemplates)
        setTemplates(
          parsed.map((tpl: any) => ({
            ...tpl,
            createdAt: new Date(tpl.createdAt),
          }))
        )
      } catch (error) {
        console.error('Failed to parse templates:', error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments))
  }, [appointments])

  useEffect(() => {
    localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates))
  }, [templates])

  const addAppointment = useCallback((apt: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...apt,
      id: uuidv4(),
    }
    setAppointments((prev) => [...prev, newAppointment])
    return newAppointment
  }, [])

  const updateAppointment = useCallback((id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt))
    )
  }, [])

  const deleteAppointment = useCallback((id: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id))
  }, [])

  const addTemplate = useCallback((template: Omit<Template, 'id' | 'createdAt'>) => {
    const newTemplate: Template = {
      ...template,
      id: uuidv4(),
      createdAt: new Date(),
    }
    setTemplates((prev) => [...prev, newTemplate])
    return newTemplate
  }, [])

  const deleteTemplate = useCallback((id: string) => {
    setTemplates((prev) => prev.filter((tpl) => tpl.id !== id))
  }, [])

  return {
    appointments,
    templates,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    addTemplate,
    deleteTemplate,
  }
}
