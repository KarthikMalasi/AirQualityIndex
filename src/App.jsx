import React, { Suspense, lazy, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from './components/Header'
import ErrorBoundary from './components/ErrorBoundary'
import PageLoader from './components/PageLoader'

// Lazy loaded pages
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Details = lazy(() => import('./pages/Details'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  const darkMode = useSelector((state) => state.ui.darkMode)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-surface text-white' : 'bg-gray-50 text-gray-900'}`}>
      <ErrorBoundary>
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/details" element={<Details />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
      </ErrorBoundary>
    </div>
  )
}
