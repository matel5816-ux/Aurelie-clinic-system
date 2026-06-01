import React, { useState } from 'react'
import { Template } from '../types'
import '../styles/TemplateManager.css'

interface TemplateManagerProps {
  templates: Template[]
  onAddTemplate: (template: Omit<Template, 'id' | 'createdAt'>) => void
  onDeleteTemplate: (id: string) => void
  onSelectTemplate?: (template: Template) => void
}

export const TemplateManager: React.FC<TemplateManagerProps> = ({
  templates,
  onAddTemplate,
  onDeleteTemplate,
  onSelectTemplate,
}) => {
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  })

  const defaultTemplate = `📢 明日預約提醒通知

親愛的顧客您好：
提醒您明日有安排醫美療程項目。

預約時間：
療程項目：
負責人員：

期待您的光臨！若需變更時間請提前告知診所同仁。`

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content) {
      alert('請填寫模板標題和內容')
      return
    }

    onAddTemplate({
      title: formData.title,
      content: formData.content,
    })

    setFormData({ title: '', content: '' })
    setShowForm(false)
  }

  const handleUseDefault = () => {
    setFormData({
      title: '【自動排版】明日預約提醒文字',
      content: defaultTemplate,
    })
  }

  return (
    <div className="template-manager">
      <div className="template-header">
        <h2>預約提醒模板</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '關閉' : '+ 新建模板'}
        </button>
      </div>

      {showForm && (
        <div className="template-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="templateTitle">模板標題</label>
              <input
                id="templateTitle"
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="輸入模板標題"
              />
            </div>

            <div className="form-group">
              <label htmlFor="templateContent">模板內容</label>
              <textarea
                id="templateContent"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="輸入模板內容"
                rows={8}
              />
              <button
                type="button"
                className="btn btn-small btn-secondary"
                onClick={handleUseDefault}
              >
                使用預設模板
              </button>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                保存模板
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowForm(false)
                  setFormData({ title: '', content: '' })
                }}
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="templates-list">
        {templates.length === 0 ? (
          <div className="empty-state">
            <p>還沒有任何模板，點擊「新建模板」開始建立</p>
          </div>
        ) : (
          templates.map((template) => (
            <div key={template.id} className="template-card">
              <div className="template-title">{template.title}</div>
              <div className="template-content">{template.content}</div>
              <div className="template-actions">
                <button
                  className="btn btn-small btn-primary"
                  onClick={() => {
                    const text = template.content
                    navigator.clipboard.writeText(text).then(() => {
                      alert('已複製到剪貼板！')
                    })
                    onSelectTemplate?.(template)
                  }}
                >
                  複製
                </button>
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => onDeleteTemplate(template.id)}
                >
                  刪除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
