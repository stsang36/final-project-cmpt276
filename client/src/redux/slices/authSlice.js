import { createSlice } from '@reduxjs/toolkit'
import { serverApi } from 'redux/apis/serverApi'

const sessionUser = JSON.parse(sessionStorage.getItem('auth'))

const initialState = sessionUser ? { user: sessionUser.user, token: sessionUser.token, loggedIn: true } : { user: null, token: null, loggedIn: false }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) =>  {
      sessionStorage.removeItem('auth')
      state.user = null
      state.token = null
      state.loggedIn = false
    }
  },
  extraReducers: (builder) => {
    // callback after user login, store data in redux store
    builder.addMatcher(
      serverApi.endpoints.login.matchFulfilled,
      (state, {payload}) => {
        console.log('here')
        const { token, ...user } = payload
        sessionStorage.setItem('auth', JSON.stringify({
          user: user,
          token: token,
        }))
        state.loggedIn = true
        state.token = token
        state.user = user
      }
    )
    // callback after user registers, store data in redux store
    builder.addMatcher(
      serverApi.endpoints.register.matchFulfilled,
      (state, {payload}) => {
        const { token, ...user } = payload
        sessionStorage.setItem('auth', JSON.stringify({
          user: user,
          token: token,
        }))
        state.loggedIn = true
        state.token = token
        state.user = user
      }
    )
  }
})

export default authSlice.reducer
export const { logout } = authSlice.actions