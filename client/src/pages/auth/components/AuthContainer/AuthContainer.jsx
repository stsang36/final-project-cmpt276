import Layout from 'common/components/Layout'
import style from './style.module.css'
import { useState } from 'react'

// all the imports to use authentication functions
import { logout } from 'redux/slices/authSlice'
import { useSelector, useDispatch } from 'react-redux'
import {
  useLoginMutation,
  useRegisterMutation, 
} from 'redux/apis/serverApi'


const AuthContainer = () => {
  // this line access the client state and gets the user, loggedIn, and token if they exists, will return null if user not signed in
  const {user, loggedIn, token} = useSelector(state => state.auth)

  // component state for the input values set below, just think of these as variables 
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // initialize this hook, is needed to run any functions for the state!!!
  const dispatch = useDispatch()

  /* 
    these are the functions i created to login and register, they both take in an object as a variable, should look like this
    {
      username: <<USERNAME>>,
      password: <<PASSWORD>>
    }
  */
  // the results is just an object that has fields like { isSuccess, isLoading, isError, error }, can be used for checking status of function
  const [login, loginResult] = useLoginMutation()
  const [register, registerResult] = useRegisterMutation()

  return (
    <Layout title={'Authentication Page'}>
      <div>
        {loggedIn && 
          <div>
            <div>Current username: {user.username}</div>
            <div>Current token: {token} </div>
          </div>}
        {!loggedIn && <div>Not Logged In</div>}
      </div>
      <div>
        <h1>Authentication</h1>
        {/* this is just how u set up a controlled input so it saves the data as soon as u type it */}
        <input type='text' placeholder='username' value={username} onChange={(e)=>setUsername(e.target.value)}/>
        <input type='text' placeholder='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
        {/* no need for a dispatch with login & register functions */}
        <button onClick={()=>login({username, password})}>login</button>
        <button onClick={()=>register({username, password})}>register</button>
      </div>
      {/* this is how u dispatch a logout function */}
      <button onClick={()=>dispatch(logout())}>Log Out</button>
    </Layout>
  )
}

export default AuthContainer