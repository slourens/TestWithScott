import { useState, useCallback } from 'react'
import { plants as staticPlants } from '../data/plants'

const STORAGE_KEY = 'plant_library_custom'

function loadCustom() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCustom(plants) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plants))
}

export function usePlants() {
  const [customPlants, setCustomPlants] = useState(loadCustom)

  const allPlants = [...staticPlants, ...customPlants]

  const addPlant = useCallback((plantData) => {
    const newPlant = {
      ...plantData,
      id: `custom-${Date.now()}`,
      isCustom: true,
    }
    setCustomPlants((prev) => {
      const next = [...prev, newPlant]
      saveCustom(next)
      return next
    })
    return newPlant
  }, [])

  const deletePlant = useCallback((id) => {
    setCustomPlants((prev) => {
      const next = prev.filter((p) => p.id !== id)
      saveCustom(next)
      return next
    })
  }, [])

  return { allPlants, customPlants, addPlant, deletePlant }
}
