import {configureStore} from '@reduxjs/toolkit'
import userReducer from '../Store/User/UserSlice'

export const store = configureStore({
    reducer:{
        user: userReducer
    }
})