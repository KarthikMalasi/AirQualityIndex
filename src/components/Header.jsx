import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleDarkMode } from '../redux/slices/uiSlice'

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const WindIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
  </svg>
)

export default function Header() {
  const dispatch = useDispatch()
  const darkMode = useSelector((s) => s.ui.darkMode)
  const { pathname } = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/details', label: 'Details' },
  ]

  const isDark = darkMode

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
      isDark ? 'bg-surface/90 border-white/5 backdrop-blur-xl' : 'bg-white/90 border-gray-200 backdrop-blur-xl'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-accent-cyan/10 text-accent-cyan' : 'bg-cyan-50 text-cyan-600'} group-hover:scale-110 transition-transform`}>
              <WindIcon />
            </div>
            <span className={`font-display font-700 text-lg tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Air<span className="text-accent-cyan">Scope</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname === path
                    ? isDark
                      ? 'bg-white/10 text-white'
                      : 'bg-gray-100 text-gray-900'
                    : isDark
                      ? 'text-white/50 hover:text-white hover:bg-white/5'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Dark mode toggle */}
          <button
            onClick={() => dispatch(toggleDarkMode())}
            className={`p-2.5 rounded-xl transition-all ${
              isDark
                ? 'text-white/60 hover:text-white hover:bg-white/5'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
            aria-label="Toggle dark mode"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        {/* Mobile nav */}
        <div className="sm:hidden flex gap-1 pb-3">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex-1 text-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                pathname === path
                  ? isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'
                  : isDark ? 'text-white/50' : 'text-gray-500'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
