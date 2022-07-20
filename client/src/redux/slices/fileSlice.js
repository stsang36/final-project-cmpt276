import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { downloadFileAsync } from '../services/fileServices'

export const downloadFile = createAsyncThunk(
  'file/download',
  async(fileId, thunkAPI) => {
    try{
      const { token } = thunkAPI.getState().auth
      return await downloadFileAsync(fileId, token)
    }catch(error){
      return thunkAPI.rejectWithValue(error)
    }
  }
)

const fileSlice = createSlice({
  name: 'file',
  initialState: {
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
  },
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(downloadFile.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(downloadFile.pending, (state) => {
        state.isLoading = true
      }) 
      .addCase(downloadFile.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.error = action.payload
      })
  }
})

export const { reset } = fileSlice.actions
export default fileSlice.reducer