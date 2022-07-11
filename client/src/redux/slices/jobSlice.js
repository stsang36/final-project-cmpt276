import { apiSlice } from './apiSlice'

export const jobExtendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //  create new Job post
    createJob: builder.mutation({
      query: ({file, deadline}) => ({
        url: '/job',
        method: 'POST',
        body: { 
          file, 
          deadline 
        }
      }),
    }),
    getAllJobs: builder.query({
      query: () => '/job',
    }),
  })
})

export const {
  useCreateJobMutation,
  useGetAllJobsQuery,
} = jobExtendedApiSlice