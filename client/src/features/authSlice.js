import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    user: null,
    isAuthenticated: false,
    token: null
}

const authSlice = createSlice({
    name:"authSlice",
    initialState,
    reducers:{
        userLoggedIn:(state,action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.token = action.payload.token
        },

        userLoggedOut:(state) =>{
            state.user = null;
            state.isAuthenticated = false;
            state.token = null
        },

        updateUser:(state,action) =>{
            state.user = action.payload
        }
    }
})

export const { userLoggedIn,userLoggedOut, updateUser} = authSlice.actions;
export default authSlice.reducer;