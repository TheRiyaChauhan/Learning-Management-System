import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = "http://localhost:8080/api/v1/purchase";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
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
        })
    })
})

})

export const {
   useCreateOrderMutation,
   useVerifyPaymentMutation
} = purchaseApi;