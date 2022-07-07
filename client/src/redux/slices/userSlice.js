import { apiSlice } from './apiSlice'

export const userExtendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // authentication
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
    // password recovery
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
    }),
    getAllUsers: builder.query({
      query: () => '/user',
    }),
    // settings
    getUserSettings: builder.query({
      query: () => '/user/settings',
    }),
    updateUserSettings: builder.mutation({
      query: (user) => ({
        url: '/user/settings',
        method: 'PUT',
        body: user,
      })
    }),
    updatePassword: builder.mutation({
      query: ({newPassword, oldPassword}) => ({
        url: '/user/settings/changepassword',
        method: 'PUT',
        body: {newPassword, oldPassword},
      })
    }),
    // admin
    updateUserRole: builder.mutation({
      query: ({id, role}) => ({
        url: '/user/admin',
        method: 'PUT',
        body: {id, role: role.toLowerCase()}
      })
    }),
    deleteUser: builder.mutation({
      query: ({id}) => ({
        url: `/user/admin/${id}`,
        method: "DELETE"
      })
    }),
  })
})

export const {
  useGetAllUsersQuery,
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
  useUpdatePasswordMutation,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = userExtendedApiSlice