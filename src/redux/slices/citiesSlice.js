import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'airscope_favorites'

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : ['Delhi', 'Mumbai', 'London', 'New York', 'Beijing']
  } catch {
    return ['Delhi', 'Mumbai', 'London', 'New York', 'Beijing']
  }
}

const saveToStorage = (favorites) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  } catch {
    // silent fail
  }
}

const citiesSlice = createSlice({
  name: 'cities',
  initialState: {
    favorites: loadFromStorage(),
    searchResults: [],
    searchQuery: '',
  },
  reducers: {
    addFavorite(state, action) {
      const city = action.payload
      if (!state.favorites.includes(city)) {
        state.favorites.push(city)
        saveToStorage(state.favorites)
      }
    },
    removeFavorite(state, action) {
      state.favorites = state.favorites.filter((c) => c !== action.payload)
      saveToStorage(state.favorites)
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload
    },
    setSearchResults(state, action) {
      state.searchResults = action.payload
    },
    reorderFavorites(state, action) {
      state.favorites = action.payload
      saveToStorage(state.favorites)
    },
  },
})

export const { addFavorite, removeFavorite, setSearchQuery, setSearchResults, reorderFavorites } = citiesSlice.actions
export default citiesSlice.reducer
