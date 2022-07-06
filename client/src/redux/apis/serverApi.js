import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const serverApi = createApi({
  reducerPath: 'serverApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api' 
  }),
  tagTypes: ['Job'],
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => '/user',
    }),
    login: builder.mutation({
      query: ({username, password}) => ({
        url: `/user/login`,
        method: 'POST',
        body: {
          username,
          password,
        }
      }),
    }),
    register: builder.mutation({
      query: ({username, password, email}) => ({
        url: '/user',
        method: 'POST',
        body: {
          username,
          password, 
          email,
        }
      })
    }),
    forgotPassword: builder.mutation({
      query: ({user}) => ({
        url: `/user/forgotpassword/${user}`,
        method: 'POST',
      })
    }),
    resetPassword: builder.mutation({
      query: ({token, password}) => ({
        url: '/user/resetpassword',
        method: 'PUT',
        body: {
          token,
          password,
        }
      })
    })
  })
})

export const {
  useGetAllUsersQuery,
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = serverApi