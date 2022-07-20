import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from 'redux/slices/apiSlice'
import authReducer from 'redux/slices/authSlice'
import fileReducer from 'redux/slices/fileSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    file: fileReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat(apiSlice.middleware)
  )
})

setupListeners(store.dispatch)