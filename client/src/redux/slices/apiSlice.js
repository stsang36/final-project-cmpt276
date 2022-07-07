import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'serverApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api' 
  }),
  tagTypes: ['Job'],
  endpoints: () => ({})
})
