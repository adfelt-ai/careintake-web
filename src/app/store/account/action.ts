import { createAsyncThunk } from "@reduxjs/toolkit";
import { profileData, setLoading } from "./accountSlice";
// import { managerProfileApi, managerProfileUpdateApi } from "@/network/Api";

export const fetchProfileDetailAction = createAsyncThunk(
  "account/fetchProfileDetailAction",
  async (_, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      dispatch(setLoading(true));
      // managerProfileApi().then((response: any) => {
      //   if (response?.data) {
      //     console.log("response?.data", response?.data);

      //     dispatch(profileData(response?.data?.data));
      //   }
      // }).catch((errors: any) => {
      //   console.log("errors", errors);
      //   dispatch(setLoading(false));
      // })
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
    }
  }
);

export const updateProfileAction = createAsyncThunk(
  "account/updateProfileAction",
  async (payload: any, thunkAPI) => {
    const { dispatch } = thunkAPI;
    try {
      dispatch(setLoading(true));
      // const response = await managerProfileUpdateApi(payload);
      // if (response?.data) {
      //   dispatch(profileData(response?.data?.data));
      //   return response?.data;
      // }
    } catch (error) {
      console.log(error);
      dispatch(setLoading(false));
      throw error;
    }
  }
);