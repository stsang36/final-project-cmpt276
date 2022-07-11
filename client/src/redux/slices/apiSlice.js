import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'serverApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api', // USE FOR PRODUCTION
    // baseUrl: 'http://localhost:5000/api', // FOR DEVELOPMENT ONLY
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if(token){
        headers.set('authorization', `Bearer ${token}`)
      }
      return headers
    }

  }),
  tagTypes: ['Job'],
  endpoints: () => ({})
})
