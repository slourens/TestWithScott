import { useEffect } from 'react'
import './PlantDetail.css'

const CARE_ROWS = [
  { key: 'water', icon: '💧', label: 'Watering' },
  { key: 'light', icon: '☀️', label: 'Light' },
  { key: 'temperature', icon: '🌡️', label: 'Temperature' },
  { key: 'humidity', icon: '💨', label: 'Humidity' },
  { key: 'soil', icon: '🪴', label: 'Soil' },
  { key: 'fertilizer', icon: '🌱', label: 'Fertilizer' },
]

const LEVEL_COLORS = {
  water: { low: '#bbf7d0', medium: '#fde68a', high: '#fed7aa' },
  light: { low: '#e5e7eb', medium: '#fde68a', bright: '#fef3c7', direct: '#fed7aa' },
}

export default function PlantDetail({ plant, onClose }) {
  useEffect(() => {
    const handleKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        <div className="modal-header">
          <span className="modal-emoji">{plant.emoji}</span>
          <div>
            <h2 className="modal-name">{plant.name}</h2>
            <p className="modal-scientific">{plant.scientificName}</p>
            <div className="modal-badges">
              <span className={`modal-badge size-${plant.size}`}>
                {plant.size.charAt(0).toUpperCase() + plant.size.slice(1)} plant
              </span>
              <span className="modal-badge level-badge"
                style={{ background: LEVEL_COLORS.water?.[plant.care.waterLevel] || '#e5e7eb' }}>
                💧 {plant.care.waterLevel} water needs
              </span>
              <span className="modal-badge level-badge"
                style={{ background: LEVEL_COLORS.light?.[plant.care.lightLevel] || '#e5e7eb' }}>
                ☀️ {plant.care.lightLevel} light
              </span>
            </div>
          </div>
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <h3 className="section-title">About</h3>
            <p className="modal-desc">{plant.description}</p>
          </section>

          <section className="modal-section">
            <h3 className="section-title">Care Guide</h3>
            <div className="care-table">
              {CARE_ROWS.map(({ key, icon, label }) => (
                <div className="care-row" key={key}>
                  <div className="care-row-label">
                    <span className="care-row-icon">{icon}</span>
                    <span className="care-row-name">{label}</span>
                  </div>
                  <p className="care-row-value">{plant.care[key]}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="modal-section">
            <h3 className="section-title">Design Notes</h3>
            <div className="design-notes">
              <span className="design-notes-icon">🏛️</span>
              <p>{plant.designNotes}</p>
            </div>
          </section>

          <section className="modal-section">
            <h3 className="section-title">Tags</h3>
            <div className="modal-tags">
              {plant.tags.map((tag) => (
                <span key={tag} className="modal-tag">{tag.replace(/-/g, ' ')}</span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
