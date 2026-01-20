import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface AccountState {
  profileData: any
  isLoading: boolean
}

const initialState: AccountState = {
  profileData: {},
  isLoading: false,
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    profileData: (state,action: PayloadAction<any>) => {
      state.profileData = action?.payload
      state.isLoading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { profileData, setLoading } = accountSlice.actions

export default accountSlice.reducer