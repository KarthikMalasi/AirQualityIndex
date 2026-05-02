import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedCity } from '../redux/slices/airQualitySlice'
import { addFavorite } from '../redux/slices/citiesSlice'
import { KNOWN_CITIES } from '../services/airQualityService'
import { useDebounce } from '../hooks/useDebounce'

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

export default function CitySearch() {
  const dispatch = useDispatch()
  const darkMode = useSelector((s) => s.ui.darkMode)
  const selectedCity = useSelector((s) => s.airQuality.selectedCity)

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const containerRef = useRef(null)

  const results = React.useMemo(() => {
    if (!debouncedQuery.trim()) return []
    return KNOWN_CITIES
      .filter((c) => c.toLowerCase().includes(debouncedQuery.toLowerCase()))
      .slice(0, 8)
  }, [debouncedQuery])

  const handleSelect = useCallback((city) => {
    dispatch(setSelectedCity(city))
    dispatch(addFavorite(city))
    setQuery('')
    setOpen(false)
  }, [dispatch])

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <div className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-all ${
        darkMode
          ? 'bg-surface-hover border-white/10 focus-within:border-accent-cyan/50'
          : 'bg-gray-100 border-gray-200 focus-within:border-cyan-400'
      }`}>
        <span className={darkMode ? 'text-white/30' : 'text-gray-400'}>
          <SearchIcon />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          placeholder={`Search city... (${selectedCity})`}
          className={`bg-transparent outline-none text-sm flex-1 placeholder:text-sm ${
            darkMode ? 'text-white placeholder-white/30' : 'text-gray-900 placeholder-gray-400'
          }`}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false) }}
            className={`text-xs ${darkMode ? 'text-white/30 hover:text-white/60' : 'text-gray-400 hover:text-gray-600'}`}
          >
            ✕
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className={`absolute top-full mt-2 left-0 right-0 rounded-xl border shadow-xl z-50 overflow-hidden animate-fade-in ${
          darkMode ? 'bg-surface-card border-white/10' : 'bg-white border-gray-200'
        }`}>
          {results.map((city) => (
            <button
              key={city}
              onClick={() => handleSelect(city)}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                city === selectedCity
                  ? darkMode ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-900'
                  : darkMode ? 'text-white/70 hover:bg-white/5 hover:text-white' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{city}</span>
              {city === selectedCity && (
                <span className="text-accent-cyan text-xs">✓ Selected</span>
              )}
            </button>
          ))}
        </div>
      )}

      {open && query && results.length === 0 && (
        <div className={`absolute top-full mt-2 left-0 right-0 rounded-xl border shadow-xl z-50 px-4 py-3 text-sm ${
          darkMode ? 'bg-surface-card border-white/10 text-white/40' : 'bg-white border-gray-200 text-gray-400'
        }`}>
          No cities found for "{query}"
        </div>
      )}
    </div>
  )
}
