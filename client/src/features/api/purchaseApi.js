import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { updateUser } from "../authSlice.js";

const COURSE_PURCHASE_API = `${import.meta.env.VITE_BASE_URL}/api/v1/purchase/`

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if(token){
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
  }),
endpoints: (builder)=>({
    createOrder: builder.mutation({
        query:({courseId,price})=>({
            url:"/",
            method:"POST",
            body:{courseId,price}
        })
    }),
    verifyPayment: builder.mutation({
        query:(data) =>({
            url:"/verify",
            method:"POST",
            body:data
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
    purchasedCourses: builder.query({
        query:()=>({
            url:"/purchased-course",
            method:"GET"
        })
    })
})

})

export const {
   useCreateOrderMutation,
   useVerifyPaymentMutation,
   usePurchasedCoursesQuery
} = purchaseApi;