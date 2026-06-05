import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthReducer from './reducers/auth';
import userDashboardReducer from './reducers/userDashboard';
import DashboardReducer from './reducers/daddy';
import couponsReducer from './reducers/coupons';
import addressReducer from './reducers/addressSlice';
import searchReducer from './reducers/search';

const rootPersistConfig = {
  key: 'root_v6',
  storage: AsyncStorage,
  // Whitelist Auth and Dashboard to persist them
  whitelist: ['Auth', 'Dashboard'],
};

const rootReducer = combineReducers({
  Auth: AuthReducer,
  Dashboard: DashboardReducer,
  userDahboard: userDashboardReducer,
  coupons: couponsReducer,
  address: addressReducer,
  search: searchReducer,
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistorStore = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
