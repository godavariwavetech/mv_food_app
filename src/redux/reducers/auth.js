import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../utils/api';
import {endpoints} from '../../config/config';

const initialState = {
  message: null,
  loading: {
    login: false,
    verifyMobile: false,
    verifyOTP: false,
    otpVerification: false,
    categories: false,
    deleteAccount: false,
    updateProfile: false,
  },
  token: null,
  userRole: 1,
  optCode: '',
  mobileNumber: '',
  isLogged: false,
  customerId: null,
  location: null,
  locationName: null,
  locationId: null,
  shouldNavigate: false,
  orderOfferAmount: 0,
  reaturantDetails: null,
  profile: null,
};

export const getProfile = createAsyncThunk(
  'getProfile',
  async (_, {getState, rejectWithValue, fulfillWithValue}) => {
    const {customerId} = getState().Auth;
    console.log(customerId,">>>>>>>>>>>>CUSTOMERRR ID");
    const response = await api.post(endpoints.GET_PROFILE, {
      "customer_id": customerId
    });
    console.log(response,">>>>>>>>>>>>>>>>>>>>>>>>>>>getProfile");
    if (response) {
      if (response.data) {
        return fulfillWithValue(response.data);
      } else {
        return rejectWithValue('Something went wrong!');
      }
    }
  },
);

export const updateProfile = createAsyncThunk(
  'updateProfile',
  async (profileData, {getState, rejectWithValue, fulfillWithValue}) => {
    const {customerId} = getState().Auth;
    const payload = {
      ...profileData,
      "user_id": profileData.user_id || customerId
    };
    console.log("updateProfile Payload:", payload);
    try {
      const response = await api.post(endpoints.UPDATE_PROFILE, payload);
      if (response) {
        if (response.data) {
          return fulfillWithValue(response.data);
        } else {
          return rejectWithValue('Something went wrong!');
        }
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong!');
    }
  },
);

export const verifyMobile = createAsyncThunk(
  'verifyMobile',
  async ({mobileNumber}, {getState, rejectWithValue, fulfillWithValue}) => {
    const data = {
      mobile: mobileNumber,
    };
    // const response = await api.post(endpoints.VERIFY_MOBILE, data);
    const response = {
      data: {data: [{}], status: true},
    };
    if (response) {
      if (response.data) {
        return fulfillWithValue(response.data);
      } else {
        return rejectWithValue('Something went wrong!');
      }
    }
  },
);

export const addCustomer = createAsyncThunk(
  'addCustomer',
  async (
    { mobileNumber, otp },
    { getState, rejectWithValue, fulfillWithValue }
  ) => {
    try {
     
      const data = {
        customer_mobile_number: mobileNumber,
        customer_otp: otp,
      };
      const response = await api.post(endpoints.VERIFY_CUSTOMER_OTP, data);
      if (response?.data) {
        return fulfillWithValue(response.data);
      } else {
        return rejectWithValue('Invalid server response');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Network or server error');
    }
  }
);


export const loginAction = createAsyncThunk(
  'loginAction',
  async ({enteredOtp}, {getState, rejectWithValue, fulfillWithValue}) => {
    const {mobileNumber} = getState().Auth;
    const data = {
      mobile: mobileNumber,
      otp: enteredOtp,
    };
    const response = await api.post(endpoints.LOGIN, data);
    if (response) {
      if (response.data) {
        return fulfillWithValue(response.data);
      } else {
        return rejectWithValue('Something went wrong!');
      }
    }
  },
);

export const verifyCustomerMobile = createAsyncThunk(
  'verifyCustomerMobile',
  async (
    {customer_mobile_number},
    {getState, rejectWithValue, fulfillWithValue},
  ) => {
    const data = {
      "customer_mobile_number":customer_mobile_number,
    }; 
    try {

      const response = await api.post(endpoints.REQUEST_OTP, data);
      
      if (response?.data) {
        return fulfillWithValue(response.data);
      } else {
        return rejectWithValue('Something went wrong!');
      }
    } catch (error) {
      
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  },
);

export const verifyCustomerOTP = createAsyncThunk(
  'verifyCustomerOTP',
  async (
    {customer_mobile_number, customer_otp},
    {getState, rejectWithValue, fulfillWithValue},
  ) => {
    const data = {
      customer_mobile_number,
      customer_otp,
    };
    try {
      const response = await api.post(endpoints.VERIFY_CUSTOMER_OTP, data);
      if (response?.data) {
        return fulfillWithValue(response.data);
      } else {
        return rejectWithValue('Something went wrong!');
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Something went wrong!');
    }
  },
);

export const deleteAccount = createAsyncThunk(
  'deleteAccount',
  async (_, {getState, rejectWithValue, fulfillWithValue}) => {
    const {customerId} = getState().Auth;
    const response = await api.post(endpoints.DELETE_ACCOUNT, {
        "user_id":customerId
    });
    if (response) {
      if (response.data) {
        return fulfillWithValue(response.data);
      } else {
        return rejectWithValue('Something went wrong!');
      }
    }
  },
);

export const AuthSlice = createSlice({
  name: 'authlice',
  initialState,
  reducers: {
    actionLogout: state => {
      state.token = null;
      state.customerId = null;
      state.profile = null;
    },
    actionLogin: state => {
      state.token = 'sample token';
    },
    setMobile: (state, action) => {
      state.mobileNumber = action.payload;
    },
    setInitial: state => {
      (state.loading = {
        login: false,
        verifyMobile: false,
        verifyOTP: false,
        otpVerification: false,
        categories: false,
        deleteAccount: false,
        updateProfile: false,
      }), (state.message = null);
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setLocationName: (state, action) => {
      
      state.locationName = action.payload;
    },
    setLocationId: (state, action) => {
      
      state.locationId = action.payload;
    },
    setRestaurnatDetails: (state, action) => {
      state.reaturantDetails = action.payload;
    },
    clearNavigationFlag: state => {
      state.shouldNavigate = false;
    },
   
    setOrderOfferAmount: (state, action) => {
      state.orderOfferAmount = action.payload;
    },
    setCustomerId: (state, action) => {
      state.customerId = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(loginAction.pending, (state, action) => {
      state.loading.login = true;
      state.message = null;
    });
    builder.addCase(loginAction.fulfilled, (state, action) => {
      state.loading.login = false;
      state.message = null;
      if (action.payload.token) {
        state.token = action.payload.token;
        state.isLogged = true;
        state.shouldNavigate = true;
        if (action.payload.data?.[0]?.customer_id) {
          state.customerId = action.payload.data[0].customer_id;
        } else if (action.payload.customer_id) {
          state.customerId = action.payload.customer_id;
        }
      }
    });
    builder.addCase(loginAction.rejected, (state, action) => {
      state.loading.login = false;
      state.message = 'Please try again!';
    });

    builder.addCase(verifyMobile.pending, (state, action) => {
      state.loading.verifyMobile = true;
      state.message = null;
    });
    builder.addCase(verifyMobile.fulfilled, (state, action) => {
      state.loading.verifyMobile = false;
      state.message = null;
     
      if (action.payload?.data[0]?.mobile) {
        state.mobileNumber = action.payload?.data[0]?.mobile;
      }
    });
    builder.addCase(verifyMobile.rejected, (state, action) => {
      state.loading.verifyMobile = false;
      state.message = 'Please try again!';
    });

    // Customer Mobile Verification
    builder.addCase(verifyCustomerMobile.pending, (state, action) => {
      state.loading.verifyMobile = true;
      state.message = null;
    });
    builder.addCase(verifyCustomerMobile.fulfilled, (state, action) => {
      state.loading.verifyMobile = false;
      state.message = null;
      // if (action.payload?.data?.[0]?.customer_mobile_number) {
      //   state.mobileNumber = action.payload.data[0].customer_mobile_number;
      // }
    });
    builder.addCase(verifyCustomerMobile.rejected, (state, action) => {
      state.loading.verifyMobile = false;
      state.message = action.payload || 'Please try again!';
    });

    // Customer OTP Verification
    builder.addCase(verifyCustomerOTP.pending, (state, action) => {
      state.loading.otpVerification = true;
      state.message = null;
    });
    builder.addCase(verifyCustomerOTP.fulfilled, (state, action) => {
      state.loading.otpVerification = false;
      state.message = null;
      if (action.payload?.token) {
        state.token = action.payload.token;
        state.isLogged = true;
        if (action.payload.data?.[0]?.customer_id) {
          state.customerId = action.payload.data[0].customer_id;
        } else if (action.payload.customer_id) {
          state.customerId = action.payload.customer_id;
        }
      }
    });
    builder.addCase(verifyCustomerOTP.rejected, (state, action) => {
      state.loading.otpVerification = false;
      state.message = action.payload || 'Please try again!';
    });

    builder.addCase(addCustomer.pending, (state, action) => {
      state.loading.categories = true;
      state.message = null;
    });
    builder.addCase(addCustomer.fulfilled, (state, action) => {
      state.loading.categories = false;
      state.message = null;
      state.customerId = action.payload.data.customer_id;
    });
    builder.addCase(addCustomer.rejected, (state, action) => {
      state.loading.categories = false;
      state.message = 'Please try again!';
    });

    builder.addCase(getProfile.pending, (state, action) => {
      state.loading.categories = true;
      state.message = null;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.loading.categories = false;
      state.message = null;
      if (action.payload?.data?.[0]) {
        state.profile = action.payload.data[0];
        state.customerId = action.payload.data[0].customer_id;
      }
    });
    builder.addCase(getProfile.rejected, (state, action) => {
      state.loading.categories = false;
      state.message = 'Please try again!';
    });

    builder.addCase(updateProfile.pending, (state, action) => {
      state.loading.updateProfile = true;
      state.message = null;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.loading.updateProfile = false;
      state.message = 'Profile updated successfully!';
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.loading.updateProfile = false;
      state.message = 'Failed to update profile!';
    });
  },
});

export const {
  actionLogout,
  actionLogin,
  setMobile,
  setInitial,
  setLocation,
  setLocationName,
  setLocationId,
  clearNavigationFlag,
  setRestaurnatDetails,
  setOrderOfferAmount,
  setCustomerId,
} = AuthSlice.actions;

export default AuthSlice.reducer;
