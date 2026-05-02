import { createSlice } from '@reduxjs/toolkit'

const getDarkMode = () => {
  try {
    const stored = localStorage.getItem('airscope_darkmode')
    if (stored !== null) return stored === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return true
  }
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    darkMode: getDarkMode(),
    sidebarOpen: false,
    activeTab: 'overview',
  },
  reducers: {
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode
      try {
        localStorage.setItem('airscope_darkmode', String(state.darkMode))
      } catch {}
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload
    },
  },
})

export const { toggleDarkMode, setActiveTab } = uiSlice.actions
export default uiSlice.reducer
