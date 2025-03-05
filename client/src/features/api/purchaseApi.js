import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = `${import.meta.env.VITE_BASE_URL}/api/v1/purchase/`

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