import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: '',
    email: '',
    userid: '',
    status: 'loggedout'
};

const userSlice = createSlice({
    name: 'user',
    initialState ,
    reducers: {
        loginSuccess: (state, action) => {
            state.status = 'loggedin',
            state.username = action.payload.username,
            state.email = action.payload.email,
            state.userid = action.payload.userid
        },
        loginFailure: (state, action) => {
            state.status = 'failed',
            state.user = '',
            state.email = '',
            state.userid = action.payload.userid
        },
        logout: (state) => {
            state.status = 'loggedout',
            state.username ='',
            state.email = '',
            state.userid = ''
        }
    }
})

export const {loginSuccess, loginFailure, logout} = userSlice.actions;
export default userSlice.reducer;