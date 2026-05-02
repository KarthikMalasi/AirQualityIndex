import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchAirQualityData, fetchHistoricalData } from '../../services/airQualityService'

export const loadAirQuality = createAsyncThunk(
  'airQuality/load',
  async (city, { rejectWithValue }) => {
    try {
      const data = await fetchAirQualityData(city)
      return { city, data }
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch air quality data')
    }
  }
)

export const loadHistorical = createAsyncThunk(
  'airQuality/loadHistorical',
  async (city, { rejectWithValue }) => {
    try {
      const data = await fetchHistoricalData(city)
      return data
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch historical data')
    }
  }
)

const airQualitySlice = createSlice({
  name: 'airQuality',
  initialState: {
    current: null,
    historical: [],
    selectedCity: 'Delhi',
    loading: false,
    historicalLoading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    setSelectedCity(state, action) {
      state.selectedCity = action.payload
      state.current = null
      state.error = null
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Current data
      .addCase(loadAirQuality.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loadAirQuality.fulfilled, (state, action) => {
        state.loading = false
        state.current = action.payload.data
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(loadAirQuality.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Historical data
      .addCase(loadHistorical.pending, (state) => {
        state.historicalLoading = true
      })
      .addCase(loadHistorical.fulfilled, (state, action) => {
        state.historicalLoading = false
        state.historical = action.payload
      })
      .addCase(loadHistorical.rejected, (state) => {
        state.historicalLoading = false
      })
  },
})

export const { setSelectedCity, clearError } = airQualitySlice.actions
export default airQualitySlice.reducer
