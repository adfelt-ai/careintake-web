import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Venue {
  id: string
  name: string
  description: string
  cover_image: string
  location_name?: string
  amenities?: Array<{
    name: string
    icon: string
  }>
  address?: {
    street: string
    city: string
    state: string
    country: string
    postal_code: string
  }
  [key: string]: any
}

export interface VenuesState {
  venues: Venue[]
  isLoading: boolean
  error: string | null
}

const initialState: VenuesState = {
  venues: [],
  isLoading: false,
  error: null,
}

export const venuesSlice = createSlice({
  name: 'venues',
  initialState,
  reducers: {
    setVenues: (state, action: PayloadAction<Venue[]>) => {
      state.venues = action.payload
      state.isLoading = false
      state.error = null
    },
    setVenuesLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setVenuesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
      state.isLoading = false
    },
    clearVenues: (state) => {
      state.venues = []
      state.isLoading = false
      state.error = null
    },
  },
})

// Action creators are generated for each case reducer function
export const { setVenues, setVenuesLoading, setVenuesError, clearVenues } = venuesSlice.actions

export default venuesSlice.reducer
