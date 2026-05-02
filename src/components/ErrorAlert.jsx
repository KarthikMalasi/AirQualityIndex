import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearError } from '../redux/slices/airQualitySlice'

export default function ErrorAlert({ message }) {
  const dispatch = useDispatch()
  const darkMode = useSelector((s) => s.ui.darkMode)

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${
      darkMode
        ? 'bg-red-500/10 border-red-500/20 text-red-400'
        : 'bg-red-50 border-red-200 text-red-600'
    } animate-slide-up`}>
      <span className="text-lg">⚠️</span>
      <div className="flex-1">
        <p className="text-sm font-medium">Failed to load air quality data</p>
        <p className={`text-xs mt-0.5 ${darkMode ? 'text-red-400/70' : 'text-red-500'}`}>
          {message || 'Please check your connection and try again.'}
        </p>
        <p className={`text-xs mt-1 ${darkMode ? 'text-white/30' : 'text-gray-400'}`}>
          Showing demo data as fallback.
        </p>
      </div>
      <button
        onClick={() => dispatch(clearError())}
        className={`text-sm ${darkMode ? 'text-red-400/50 hover:text-red-400' : 'text-red-400 hover:text-red-600'}`}
      >
        ✕
      </button>
    </div>
  )
}
