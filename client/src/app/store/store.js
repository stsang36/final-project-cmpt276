import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { serverApi } from 'redux/apis/serverApi'
import authReducer from 'redux/slices/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [serverApi.reducerPath]: serverApi.reducer,
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat(serverApi.middleware)
  )
})

setupListeners(store.dispatch)