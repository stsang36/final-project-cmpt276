import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from 'redux/slices/apiSlice'
import authReducer from 'redux/slices/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat(apiSlice.middleware)
  )
})

setupListeners(store.dispatch)