import { apiSlice } from './apiSlice'

export const configExtendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppConfig: builder.query({
      query: () => '/config',
      providesTags: ['Config']
    }),
    updateAppConfig: builder.mutation({
      query: (settings) => ({
        url: '/config',
        method: 'PUT',
        body: settings
      }),
      invalidatesTags: ['Config']
    })
  })
})

export const {
  useGetAppConfigQuery,
  useUpdateAppConfigMutation,
} = configExtendedApiSlice