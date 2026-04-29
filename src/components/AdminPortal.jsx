import { useState, useEffect } from 'react'
import './AdminPortal.css'

const EMPTY_FORM = {
  name: '',
  scientificName: '',
  emoji: '🌿',
  description: '',
  size: 'medium',
  tags: '',
  designNotes: '',
  care: {
    water: '',
    waterLevel: 'medium',
    light: '',
    lightLevel: 'medium',
    temperature: '',
    humidity: '',
    soil: '',
    fertilizer: '',
  },
}

const REQUIRED = ['name', 'scientificName', 'description', 'designNotes']
const CARE_REQUIRED = ['water', 'light', 'temperature', 'humidity', 'soil', 'fertilizer']

function validate(form) {
  const errors = {}
  REQUIRED.forEach((k) => { if (!form[k].trim()) errors[k] = 'Required' })
  CARE_REQUIRED.forEach((k) => { if (!form.care[k].trim()) errors[`care.${k}`] = 'Required' })
  return errors
}

export default function AdminPortal({ customPlants, onAdd, onDelete, onLogout, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [view, setView] = useState('add') // 'add' | 'manage'
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => { const next = { ...e }; delete next[key]; return next })
  }

  function setCareField(key, value) {
    setForm((f) => ({ ...f, care: { ...f.care, [key]: value } }))
    setErrors((e) => { const next = { ...e }; delete next[`care.${key}`]; return next })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    onAdd({
      name: form.name.trim(),
      scientificName: form.scientificName.trim(),
      emoji: form.emoji || '🌿',
      description: form.description.trim(),
      size: form.size,
      tags: form.tags.split(',').map((t) => t.trim().toLowerCase().replace(/\s+/g, '-')).filter(Boolean),
      designNotes: form.designNotes.trim(),
      care: {
        water: form.care.water.trim(),
        waterLevel: form.care.waterLevel,
        light: form.care.light.trim(),
        lightLevel: form.care.lightLevel,
        temperature: form.care.temperature.trim(),
        humidity: form.care.humidity.trim(),
        soil: form.care.soil.trim(),
        fertilizer: form.care.fertilizer.trim(),
      },
    })

    setForm(EMPTY_FORM)
    setErrors({})
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="ap-overlay">
      <div className="ap-panel" role="dialog" aria-modal="true" aria-label="Admin portal">
        {/* Sidebar */}
        <aside className="ap-sidebar">
          <div className="ap-sidebar-top">
            <div className="ap-brand">
              <span className="ap-brand-icon">🌿</span>
              <div>
                <p className="ap-brand-name">Plant Library</p>
                <p className="ap-brand-role">Admin Portal</p>
              </div>
            </div>
            <nav className="ap-nav">
              <button
                className={`ap-nav-item ${view === 'add' ? 'ap-nav-active' : ''}`}
                onClick={() => setView('add')}
              >
                <span>➕</span> Add Plant
              </button>
              <button
                className={`ap-nav-item ${view === 'manage' ? 'ap-nav-active' : ''}`}
                onClick={() => setView('manage')}
              >
                <span>📋</span> Manage Custom
                {customPlants.length > 0 && (
                  <span className="ap-badge">{customPlants.length}</span>
                )}
              </button>
            </nav>
          </div>
          <div className="ap-sidebar-bottom">
            <button className="ap-logout" onClick={onLogout}>
              <span>🔓</span> Sign Out
            </button>
            <button className="ap-close-portal" onClick={onClose}>
              ← Back to Library
            </button>
          </div>
        </aside>

        {/* Main content */}
        <div className="ap-content">
          {view === 'add' && (
            <div className="ap-section">
              <div className="ap-section-header">
                <h2 className="ap-section-title">Add New Plant</h2>
                <p className="ap-section-sub">Fill in all required fields to add a plant to the library.</p>
              </div>

              {success && (
                <div className="ap-success" role="status">
                  ✅ Plant added successfully! It's now visible in the library.
                </div>
              )}

              <form className="ap-form" onSubmit={handleSubmit} noValidate>
                <fieldset className="ap-fieldset">
                  <legend className="ap-legend">Identity</legend>

                  <div className="ap-row ap-row-3">
                    <div className="ap-field">
                      <label className="ap-label" htmlFor="f-name">Common Name <span className="req">*</span></label>
                      <input id="f-name" className={`ap-input ${errors.name ? 'ap-input-err' : ''}`}
                        type="text" value={form.name} onChange={(e) => setField('name', e.target.value)}
                        placeholder="e.g. Snake Plant" />
                      {errors.name && <span className="ap-err-msg">{errors.name}</span>}
                    </div>

                    <div className="ap-field">
                      <label className="ap-label" htmlFor="f-sci">Scientific Name <span className="req">*</span></label>
                      <input id="f-sci" className={`ap-input ${errors.scientificName ? 'ap-input-err' : ''}`}
                        type="text" value={form.scientificName} onChange={(e) => setField('scientificName', e.target.value)}
                        placeholder="e.g. Dracaena trifasciata" />
                      {errors.scientificName && <span className="ap-err-msg">{errors.scientificName}</span>}
                    </div>

                    <div className="ap-field ap-field-sm">
                      <label className="ap-label" htmlFor="f-emoji">Emoji</label>
                      <input id="f-emoji" className="ap-input ap-input-emoji"
                        type="text" value={form.emoji} onChange={(e) => setField('emoji', e.target.value)}
                        maxLength={4} placeholder="🌿" />
                    </div>
                  </div>

                  <div className="ap-row ap-row-2">
                    <div className="ap-field">
                      <label className="ap-label" htmlFor="f-size">Size</label>
                      <select id="f-size" className="ap-select" value={form.size}
                        onChange={(e) => setField('size', e.target.value)}>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>

                    <div className="ap-field">
                      <label className="ap-label" htmlFor="f-tags">Tags <span className="ap-hint">(comma-separated)</span></label>
                      <input id="f-tags" className="ap-input"
                        type="text" value={form.tags} onChange={(e) => setField('tags', e.target.value)}
                        placeholder="e.g. low-light, air-purifying, trailing" />
                    </div>
                  </div>

                  <div className="ap-field">
                    <label className="ap-label" htmlFor="f-desc">Description <span className="req">*</span></label>
                    <textarea id="f-desc" className={`ap-textarea ${errors.description ? 'ap-input-err' : ''}`}
                      rows={3} value={form.description} onChange={(e) => setField('description', e.target.value)}
                      placeholder="Describe the plant's appearance, origin, and character…" />
                    {errors.description && <span className="ap-err-msg">{errors.description}</span>}
                  </div>

                  <div className="ap-field">
                    <label className="ap-label" htmlFor="f-design">Design Notes <span className="req">*</span></label>
                    <textarea id="f-design" className={`ap-textarea ${errors.designNotes ? 'ap-input-err' : ''}`}
                      rows={2} value={form.designNotes} onChange={(e) => setField('designNotes', e.target.value)}
                      placeholder="How is this plant used in interior design contexts?" />
                    {errors.designNotes && <span className="ap-err-msg">{errors.designNotes}</span>}
                  </div>
                </fieldset>

                <fieldset className="ap-fieldset">
                  <legend className="ap-legend">Care Requirements</legend>

                  <div className="ap-row ap-row-2">
                    <div className="ap-field">
                      <label className="ap-label" htmlFor="f-water">Watering Schedule <span className="req">*</span></label>
                      <textarea id="f-water" className={`ap-textarea ap-textarea-sm ${errors['care.water'] ? 'ap-input-err' : ''}`}
                        rows={2} value={form.care.water} onChange={(e) => setCareField('water', e.target.value)}
                        placeholder="e.g. Every 1–2 weeks; allow top inch to dry…" />
                      {errors['care.water'] && <span className="ap-err-msg">{errors['care.water']}</span>}
                    </div>

                    <div className="ap-field">
                      <label className="ap-label" htmlFor="f-water-level">Water Need Level</label>
                      <select id="f-water-level" className="ap-select" value={form.care.waterLevel}
                        onChange={(e) => setCareField('waterLevel', e.target.value)}>
                        <option value="low">💧 Low (Drought-Tolerant)</option>
                        <option value="medium">💧💧 Medium</option>
                        <option value="high">💧💧💧 High</option>
                      </select>
                    </div>
                  </div>

                  <div className="ap-row ap-row-2">
                    <div className="ap-field">
                      <label className="ap-label" htmlFor="f-light">Light Requirements <span className="req">*</span></label>
                      <textarea id="f-light" className={`ap-textarea ap-textarea-sm ${errors['care.light'] ? 'ap-input-err' : ''}`}
                        rows={2} value={form.care.light} onChange={(e) => setCareField('light', e.target.value)}
                        placeholder="e.g. Bright indirect light; no direct sun…" />
                      {errors['care.light'] && <span className="ap-err-msg">{errors['care.light']}</span>}
                    </div>

                    <div className="ap-field">
                      <label className="ap-label" htmlFor="f-light-level">Light Level</label>
                      <select id="f-light-level" className="ap-select" value={form.care.lightLevel}
                        onChange={(e) => setCareField('lightLevel', e.target.value)}>
                        <option value="low">🌑 Low Light</option>
                        <option value="medium">🌤 Medium Indirect</option>
                        <option value="bright">☀️ Bright Indirect</option>
                        <option value="direct">🔆 Direct Sun</option>
                      </select>
                    </div>
                  </div>

                  <div className="ap-row ap-row-2">
                    <div className="ap-field">
                      <label className="ap-label" htmlFor="f-temp">Temperature <span className="req">*</span></label>
                      <input id="f-temp" className={`ap-input ${errors['care.temperature'] ? 'ap-input-err' : ''}`}
                        type="text" value={form.care.temperature} onChange={(e) => setCareField('temperature', e.target.value)}
                        placeholder="e.g. 65–85°F (18–29°C)" />
                      {errors['care.temperature'] && <span className="ap-err-msg">{errors['care.temperature']}</span>}
                    </div>

                    <div className="ap-field">
                      <label className="ap-label" htmlFor="f-humidity">Humidity <span className="req">*</span></label>
                      <input id="f-humidity" className={`ap-input ${errors['care.humidity'] ? 'ap-input-err' : ''}`}
                        type="text" value={form.care.humidity} onChange={(e) => setCareField('humidity', e.target.value)}
                        placeholder="e.g. Average to high; mist occasionally" />
                      {errors['care.humidity'] && <span className="ap-err-msg">{errors['care.humidity']}</span>}
                    </div>
                  </div>

                  <div className="ap-row ap-row-2">
                    <div className="ap-field">
                      <label className="ap-label" htmlFor="f-soil">Soil <span className="req">*</span></label>
                      <input id="f-soil" className={`ap-input ${errors['care.soil'] ? 'ap-input-err' : ''}`}
                        type="text" value={form.care.soil} onChange={(e) => setCareField('soil', e.target.value)}
                        placeholder="e.g. Well-draining potting mix with perlite" />
                      {errors['care.soil'] && <span className="ap-err-msg">{errors['care.soil']}</span>}
                    </div>

                    <div className="ap-field">
                      <label className="ap-label" htmlFor="f-fert">Fertilizer <span className="req">*</span></label>
                      <input id="f-fert" className={`ap-input ${errors['care.fertilizer'] ? 'ap-input-err' : ''}`}
                        type="text" value={form.care.fertilizer} onChange={(e) => setCareField('fertilizer', e.target.value)}
                        placeholder="e.g. Monthly during growing season" />
                      {errors['care.fertilizer'] && <span className="ap-err-msg">{errors['care.fertilizer']}</span>}
                    </div>
                  </div>
                </fieldset>

                <div className="ap-form-actions">
                  <button type="button" className="ap-btn-secondary" onClick={() => { setForm(EMPTY_FORM); setErrors({}) }}>
                    Clear Form
                  </button>
                  <button type="submit" className="ap-btn-primary">
                    ➕ Add to Library
                  </button>
                </div>
              </form>
            </div>
          )}

          {view === 'manage' && (
            <div className="ap-section">
              <div className="ap-section-header">
                <h2 className="ap-section-title">Manage Custom Plants</h2>
                <p className="ap-section-sub">
                  {customPlants.length === 0
                    ? 'No custom plants added yet.'
                    : `${customPlants.length} custom plant${customPlants.length > 1 ? 's' : ''} in the library.`}
                </p>
              </div>

              {customPlants.length === 0 ? (
                <div className="ap-empty">
                  <span className="ap-empty-icon">🌱</span>
                  <p>You haven't added any custom plants yet.</p>
                  <button className="ap-btn-primary" onClick={() => setView('add')}>
                    Add Your First Plant
                  </button>
                </div>
              ) : (
                <div className="ap-plant-list">
                  {customPlants.map((plant) => (
                    <div className="ap-plant-row" key={plant.id}>
                      <span className="ap-plant-emoji">{plant.emoji}</span>
                      <div className="ap-plant-info">
                        <p className="ap-plant-name">{plant.name}</p>
                        <p className="ap-plant-sci">{plant.scientificName}</p>
                        <div className="ap-plant-meta">
                          <span className={`ap-plant-size size-${plant.size}`}>{plant.size}</span>
                          <span className="ap-plant-light">☀️ {plant.care.lightLevel}</span>
                          <span className="ap-plant-water">💧 {plant.care.waterLevel}</span>
                        </div>
                      </div>
                      <button
                        className="ap-delete"
                        onClick={() => {
                          if (window.confirm(`Remove "${plant.name}" from the library?`)) {
                            onDelete(plant.id)
                          }
                        }}
                        aria-label={`Delete ${plant.name}`}
                      >
                        🗑️ Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
