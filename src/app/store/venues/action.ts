import { createAsyncThunk } from "@reduxjs/toolkit";
import { setVenues, setVenuesLoading, setVenuesError } from "./venuesSlice";
import { venueListApi } from "@/network/Api";

export const fetchVenuesAction = createAsyncThunk(
  "venues/fetchVenuesAction",
  async (organizationId: string, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      dispatch(setVenuesLoading(true));
      const response = await venueListApi(organizationId);
      if (response?.data?.data?.locations) {
        dispatch(setVenues(response.data.data.locations));
        return response.data.data.locations;
      } else {
        dispatch(setVenues([]));
        return [];
      }
    } catch (error: any) {
      console.error("Error fetching venues:", error);
      const errorMessage = error?.message || "Failed to fetch venues";
      dispatch(setVenuesError(errorMessage));
      throw error;
    }
  }
);
