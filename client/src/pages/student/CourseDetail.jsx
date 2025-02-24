import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetCourseByIdQuery } from '@/features/api/courseApi';
import { useCreateOrderMutation, useVerifyPaymentMutation } from '@/features/api/purchaseApi';
import { userLoggedIn } from '@/features/authSlice';

import { BadgeInfo, Currency, Lock, PlayCircle } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';



const CourseDetail = () => {
    const params = useParams();
    const courseId = params.courseId;
    const dispatch = useDispatch();
    const {data:courseData} = useGetCourseByIdQuery(courseId)
    const [createOrder,{data,isLoading,isError,isSuccess}] = useCreateOrderMutation();
    const [verifyPayment,{isData}] = useVerifyPaymentMutation();

    const handlePayment = ()=>{
       createOrder({courseId,price})

       if(isSuccess){
          const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY,
            amount:data?.order?.amount,
            currency:data?.order?.currency,
            name:courseData.courseTitle,
            description:nskncljasnvclkadnvcklad,
            orderId:data?.order?.id,
            handler: async function (response) {
                try {
                  const payment_id = response.razorpay_payment_id;
                  const signature = response.razorpay_signature;
                  const verification = verifyPayment({courseId, paymentId:payment_id,signature,orderId:data?.order?.id})
        
                  dispatch(userLoggedIn(verification?.data?.user));
                  toast.success(verification?.data?.message);
                } catch (error) {
                  toast.error(error?.response?.data?.message);
                }
              },
              theme:{
                color: '#ff0000',
              }
          }
          const razorpay = new window.razorpay(options);
          razorpay.open();
       }
    }
    const purchased = false;
    return (
        <div className='mt-20 space-y-5'>
            <div className='bg-blue-700 text-white '>
                <div className='max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2'>
                    <h1 className="font-bold text-2xl md:text-3xl"> {courseData.courseTitle}</h1>
                    <p className="text-base md:text-lg">{courseData.courseSubTitle}</p>
                    <p>
                        Created By{" "}
                        <span className="text-[#C0C4FC] underline italic">Bansal mernStack</span>
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                        <BadgeInfo size={16} />
                        <p>Last updated 17-04-03</p>
                    </div>
                    <p>Students enrolled: 10</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
                <div className="w-full lg:w-1/2 space-y-5">
                    <h1 className="font-bold text-xl md:text-2xl">Description</h1>
                    <p className="text-sm">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, nostrum. Eligendi accusamus laborum, eum sequi molestias deleniti quo, architecto cupiditate facere consequatur voluptate, repellat rerum necessitatibus nihil cumque sunt ipsa perspiciatis doloremque natus consectetur. Ut cupiditate placeat nam fugit aut!
                    </p>
                    <Card>
                        <CardHeader>
                            <CardTitle>Course Content</CardTitle>
                            <CardDescription>4 lectures</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[1, 2, 3].map((lecture, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-sm">
                                    <span>
                                        {true ? <PlayCircle size={14} /> : <Lock size={14} />}
                                    </span>
                                    <p>lectureTitle</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div className="w-full lg:w-1/3">
                    <Card >
                        <CardContent className="p-4 flex flex-col">
                            <div className="w-full aspect-video mb-4">
                                video
                            </div>
                            <h1>Lecture title</h1>
                          
                            <h1 className="text-lg md:text-xl font-semibold">Course Price</h1>
                        </CardContent>
                        <CardFooter className="flex justify-center p-4">
                            {purchased ? (
                                <Button className="w-full">Continue Course</Button>
                            ) : (
                                <Button className='bg-blue-700' onClick = {handlePayment}>Buy Course</Button>
                            )}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default CourseDetail