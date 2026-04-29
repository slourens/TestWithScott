import { useState, useMemo } from 'react'
import { LIGHT_LEVELS, WATER_LEVELS, SIZES } from './data/plants'
import { useAuth } from './hooks/useAuth'
import { usePlants } from './hooks/usePlants'
import PlantCard from './components/PlantCard'
import PlantDetail from './components/PlantDetail'
import AdminLogin from './components/AdminLogin'
import AdminPortal from './components/AdminPortal'
import './App.css'

export default function App() {
  const { isAuthenticated, login, logout } = useAuth()
  const { allPlants, customPlants, addPlant, deletePlant } = usePlants()

  const [search, setSearch] = useState('')
  const [lightFilter, setLightFilter] = useState('all')
  const [waterFilter, setWaterFilter] = useState('all')
  const [sizeFilter, setSizeFilter] = useState('all')
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)

  function handleAdminClick() {
    if (isAuthenticated) {
      setShowAdmin(true)
    } else {
      setShowLogin(true)
    }
  }

  function handleLogin(username, password) {
    const ok = login(username, password)
    if (ok) {
      setShowLogin(false)
      setShowAdmin(true)
    }
    return ok
  }

  function handleLogout() {
    logout()
    setShowAdmin(false)
  }

  const filtered = useMemo(() => {
    return allPlants.filter((p) => {
      const matchSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.scientificName.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))

      const matchLight = lightFilter === 'all' || p.care.lightLevel === lightFilter
      const matchWater = waterFilter === 'all' || p.care.waterLevel === waterFilter
      const matchSize = sizeFilter === 'all' || p.size === sizeFilter

      return matchSearch && matchLight && matchWater && matchSize
    })
  }, [allPlants, search, lightFilter, waterFilter, sizeFilter])

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-title">
            <span className="header-leaf">🌿</span>
            <div>
              <h1 className="site-title">Plant Library</h1>
              <p className="site-subtitle">Interior Design Collection</p>
            </div>
          </div>

          <div className="header-right">
            <div className="header-count">
              <span className="count-num">{allPlants.length}</span>
              <span className="count-label">plants</span>
            </div>
            <button
              className={`admin-btn ${isAuthenticated ? 'admin-btn-active' : ''}`}
              onClick={handleAdminClick}
              title={isAuthenticated ? 'Open admin portal' : 'Admin login'}
            >
              {isAuthenticated ? '🔓' : '🔒'}
              <span className="admin-btn-label">Admin</span>
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="controls">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search by name, species, or tag…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <div className="filters">
            <div className="filter-group">
              <label className="filter-label">Light</label>
              <div className="filter-pills">
                {LIGHT_LEVELS.map((l) => (
                  <button
                    key={l.value}
                    className={`pill ${lightFilter === l.value ? 'pill-active' : ''}`}
                    onClick={() => setLightFilter(l.value)}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Water</label>
              <div className="filter-pills">
                {WATER_LEVELS.map((w) => (
                  <button
                    key={w.value}
                    className={`pill ${waterFilter === w.value ? 'pill-active' : ''}`}
                    onClick={() => setWaterFilter(w.value)}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Size</label>
              <div className="filter-pills">
                {SIZES.map((s) => (
                  <button
                    key={s.value}
                    className={`pill ${sizeFilter === s.value ? 'pill-active' : ''}`}
                    onClick={() => setSizeFilter(s.value)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="results-bar">
          <span className="results-count">
            {filtered.length} {filtered.length === 1 ? 'plant' : 'plants'} found
            {customPlants.length > 0 && (
              <span className="custom-count"> · {customPlants.length} custom</span>
            )}
          </span>
          {(search || lightFilter !== 'all' || waterFilter !== 'all' || sizeFilter !== 'all') && (
            <button
              className="clear-all"
              onClick={() => {
                setSearch('')
                setLightFilter('all')
                setWaterFilter('all')
                setSizeFilter('all')
              }}
            >
              Clear all filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <span className="empty-icon">🔍</span>
            <p>No plants match your search. Try adjusting the filters.</p>
          </div>
        ) : (
          <div className="grid">
            {filtered.map((plant) => (
              <PlantCard
                key={plant.id}
                plant={plant}
                onClick={() => setSelectedPlant(plant)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedPlant && (
        <PlantDetail plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
      )}

      {showLogin && !isAuthenticated && (
        <AdminLogin
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
        />
      )}

      {showAdmin && isAuthenticated && (
        <AdminPortal
          customPlants={customPlants}
          onAdd={addPlant}
          onDelete={deletePlant}
          onLogout={handleLogout}
          onClose={() => setShowAdmin(false)}
        />
      )}
    </div>
  )
}
