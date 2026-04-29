import './PlantCard.css'

const LIGHT_ICONS = { low: '🌑', medium: '🌤', bright: '☀️', direct: '🔆' }
const LIGHT_LABELS = { low: 'Low', medium: 'Medium', bright: 'Bright Indirect', direct: 'Full Sun' }
const WATER_ICONS = { low: '💧', medium: '💧💧', high: '💧💧💧' }
const WATER_LABELS = { low: 'Low', medium: 'Medium', high: 'High' }
const SIZE_LABELS = { small: 'Small', medium: 'Medium', large: 'Large' }

export default function PlantCard({ plant, onClick }) {
  return (
    <article className="card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}>
      <div className="card-emoji-wrap">
        <span className="card-emoji">{plant.emoji}</span>
        <span className={`card-size size-${plant.size}`}>{SIZE_LABELS[plant.size]}</span>
      </div>

      <div className="card-body">
        <h2 className="card-name">{plant.name}</h2>
        <p className="card-scientific">{plant.scientificName}</p>
        <p className="card-desc">{plant.description.slice(0, 110)}…</p>

        <div className="card-care">
          <div className="care-badge">
            <span className="care-icon">{LIGHT_ICONS[plant.care.lightLevel]}</span>
            <span className="care-text">{LIGHT_LABELS[plant.care.lightLevel]}</span>
          </div>
          <div className="care-badge">
            <span className="care-icon">{WATER_ICONS[plant.care.waterLevel]}</span>
            <span className="care-text">{WATER_LABELS[plant.care.waterLevel]} water</span>
          </div>
          <div className="care-badge">
            <span className="care-icon">🌡️</span>
            <span className="care-text">{plant.care.temperature.split(';')[0]}</span>
          </div>
        </div>

        <div className="card-tags">
          {plant.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="tag">{tag.replace(/-/g, ' ')}</span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <span className="view-more">View care guide →</span>
      </div>
    </article>
  )
}
