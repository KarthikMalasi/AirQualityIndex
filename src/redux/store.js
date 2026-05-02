import { configureStore } from '@reduxjs/toolkit'
import airQualityReducer from './slices/airQualitySlice'
import citiesReducer from './slices/citiesSlice'
import uiReducer from './slices/uiSlice'

export const store = configureStore({
  reducer: {
    airQuality: airQualityReducer,
    cities: citiesReducer,
    ui: uiReducer,
  },
})
