import { configureStore } from '@reduxjs/toolkit'
import kmeansReducer from './features/kmeansSlice'
export default configureStore({
  reducer: {
    kmeans: kmeansReducer
  }
})