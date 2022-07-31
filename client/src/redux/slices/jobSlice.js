import { apiSlice } from './apiSlice'

export const jobExtendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //  All Roles
    createJob: builder.mutation({
      query: ({file, deadline, name}) => ({
        url: '/job',
        method: 'POST',
        body: { 
          file, 
          deadline,
          name, 
        }
      }),
      invalidatesTags: ['Job']
    }),
    getMyJobs: builder.query({
      query: () => '/job/my',
      providesTags: ['Job']
    }),
    getJob: builder.query({
      query: ({id}) => `/job/one/${id}`
    }),
    // only transcriber & reviewers
    getAvailableJobs: builder.query({
      query: () => '/job',
      providesTags: ['Job']
    }),
    getCurrentJobs: builder.query({
      query: () => '/job/current',
      providesTags: ['Job']
    }),
    getPastJobs: builder.query({
      query: () => '/job/past',
      providesTags: ['Job']
    }),
    updateJob: builder.mutation({
      query: ({id, file}) => ({
        url: `/job/update/${id}`,
        method: 'PUT',
        body: file
      }),
      invalidatesTags: ['Job']
    }),
    claimJob: builder.mutation({
      query: ({id}) => ({
        url: `/job/claim/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Job']
    }),
    dropJob: builder.mutation({
      query: ({id}) => ({
        url: `/job/drop/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Job']
    }),
    // admin only
    deleteJob: builder.mutation({
      query: ({id}) => ({
        url: `/job/admin/delete/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Job']
    }),
    getAllActiveJobs: builder.query({
      query: () => '/job/admin/active',
      providesTags: ['Job']
    }),
    getAllInactiveJobs: builder.query({
      query: () => '/job/admin/inactive',
      providesTags: ['Job']
    }),
  })
})

export const {
  useCreateJobMutation,
  useGetMyJobsQuery,
  useGetJobQuery,
  useGetAvailableJobsQuery,
  useGetCurrentJobsQuery,
  useGetPastJobsQuery,
  useUpdateJobMutation,
  useClaimJobMutation,
  useDropJobMutation,
  useDeleteJobMutation,
  useGetAllActiveJobsQuery,
  useGetAllInactiveJobsQuery,
} = jobExtendedApiSlice