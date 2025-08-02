// src/redux/reducers/coupons.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { endpoints } from '../../config/config';
import api from '../../utils/api';

// Define the async thunk for fetching coupons
export const fetchCoupons = createAsyncThunk(
  'fetchCoupons',
  async (
    _,
    {getState, rejectWithValue, fulfillWithValue}
  ) => {
    const response = await api.post(endpoints.GET_COUPONS,{
      "location_id": "1",
      "coupon_category_id": "1"
  })
  console.log(response.data,"RESPONSE")
  
    if (response) {


        if (response.data) {
          return fulfillWithValue(response.data);
        } else {
          return rejectWithValue('Something went wrong!');
        }
      }
}
);

const initialState = {
  appliedCoupon: null,
  coupons: [], // New state to store the list of coupons
  loading: false, // Optional: to handle loading state
  error: null, // Optional: to handle error state
};

const couponSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    applyCoupon: (state, action) => {
      state.appliedCoupon = action.payload;
    },
    removeCoupon: (state) => {
      state.appliedCoupon = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCoupons.pending, (state) => {
        state.loading = true; // Set loading to true while fetching
      })
      builder.addCase(fetchCoupons.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false on success
        state.coupons = action.payload.data; 
      })
      builder.addCase(fetchCoupons.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.error.message; // Store the error message
      });
  },
});

export const { applyCoupon, removeCoupon } = couponSlice.actions;
export default couponSlice.reducer;