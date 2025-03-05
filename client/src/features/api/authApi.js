import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { updateUser, userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = `${import.meta.env.VITE_BASE_URL}/api/v1/user/`

export const authApi = createApi({
    reducerPath : "authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:USER_API,
        credentials:'include',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if(token){
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints:(builder)=>({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url:"register",
                method:"POST",
                body:inputData
            })
        }),
        loginUser: builder.mutation({
            query: (inputData) => ({
                url:"login",
                method:"POST",
                body:inputData
            }),
            async onQueryStarted(_,{queryFulfilled,dispatch}){
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn(result.data));
                } catch (error) {
                    console.log(error);
                }
            }
    
        }),
        logoutUser: builder.mutation({
            query:()=>({
                url:"logout",
                method:"GET"
            }),
            async onQueryStarted(_,{dispatch}){
                try {
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        loadUser:builder.query({
            query:()=>({
                url:"profile",
                method:"GET"
            }),
            onQueryStarted: async(_,{queryFulfilled,dispatch}) => {
                try {
                    const result = await queryFulfilled;
                    dispatch(updateUser(result?.data?.user));
                } catch (error) {
                    console.log(error);
                }
            }
          
        }),
        updateUser: builder.mutation({
            query: (formData) => ({
                url:"profile/update",
                method:"PUT",
                prepareHeaders: (headers) => {
                    headers.set("Content-Type", "multipart/form-data")
                      return headers
                  },
                body:formData,
                credentials:"include"
            }),
           
    
        }),
        
    })
})

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation
} = authApi;