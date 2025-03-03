import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetCourseByIdQuery } from "@/features/api/courseApi";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "@/features/api/purchaseApi";
import { userLoggedIn } from "@/features/authSlice";

import { BadgeInfo, Currency, Lock, PlayCircle } from "lucide-react";
import React, { useEffect } from "react";
import ReactPlayer from "react-player";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseDetail = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth.user);

  const { data: courseData, isLoading: courseLoading } =
    useGetCourseByIdQuery(courseId);

  const [createOrder, { data: orderData, isSuccess }] =
    useCreateOrderMutation();

  const [verifyPayment] = useVerifyPaymentMutation();

  const handlePayment = async () => {
    try {
      if (courseData) {
        await createOrder({
          courseId,
          price: courseData?.course?.coursePrice,
        });
      }

      if (isSuccess) {

        const order_id = orderData?.order?.id; // Ensure order ID exists

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY,
          amount: orderData?.order?.amount_due,
          currency: orderData?.order?.currency,
          name: courseData?.course?.courseTitle || "Course Purchase",
          description: "Payment for course access",
          order_id,
          handler: async function (paymentResponse) {
            const { razorpay_payment_id, razorpay_signature } = paymentResponse;

            if (!razorpay_signature) {
              console.error(
                "Signature missing from response:",
                paymentResponse
              );
              toast.error(
                "Signature not received. Payment verification failed."
              );
              return;
            }

            try {
              const verification = await verifyPayment({
                courseId,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
                orderId: order_id,
              });
              dispatch(userLoggedIn(verification?.data?.user));
              toast.success(verification?.data?.message);
            } catch (error) {
              toast.error(
                error?.response?.data?.message || "Payment verification failed."
              );
            }
          },
          theme: { color: "#ff0000" },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error("Error during payment:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };
  const purchased = courseData?.course?.enrolledStudents.includes(user?._id);

  if (courseLoading) {
    return <div>Loading...</div>;
  }

  const handleContinueCourse = () => {
    if(purchased){
      navigate(`/course-progress/${courseId}`)
    }
  }

  return (
    <div className="mt-20 space-y-5">
      <div className="bg-blue-700 text-white ">
        <div className="max-w-7xl mx-auto py-8 px-4 md:px-8 flex flex-col gap-2">
          <h1 className="font-bold text-2xl md:text-3xl">
            {" "}
            {courseData?.course?.courseTitle}
          </h1>
          <p className="text-base md:text-lg">{courseData?.course?.subTitle}</p>
          <p>
            Created By{" "}
            <span className="text-[#C0C4FC] underline italic">
              {courseData?.course?.creator?.name}
            </span>
          </p>
          <div className="flex items-center gap-2 text-sm">
            <BadgeInfo size={16} />
            <p>Last updated : {courseData?.course?.updatedAt.split("T")[0]}</p>
          </div>
          <p>
            Students enrolled: {courseData?.course?.enrolledStudents.length}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto my-5 px-4 md:px-8 flex flex-col lg:flex-row justify-between gap-10">
        <div className="w-full lg:w-1/2 space-y-5">
          <h1 className="font-bold text-xl md:text-2xl">Description</h1>
          <p className="text-sm" dangerouslySetInnerHTML={{__html:courseData?.course?.description}}/>
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
              <CardDescription>
                {courseData?.course?.lectures.length} lectures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {courseData?.course?.lectures.map((lecture, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  <span>
                    {purchased ? <PlayCircle size={14} /> : <Lock size={14} />}
                  </span>
                  <p>{lecture.lectureTitle}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="w-full lg:w-1/3">
          <Card>
            <CardContent className="p-4 flex flex-col">
              <div className="w-full aspect-video mb-4">
                <ReactPlayer 
                width="100%"
                height="100%"
                url={courseData?.course.lectures[0].videoUrl}
                controls={true}
                />
              </div>
              <h1>{courseData?.course.lectures[0].lectureTitle}</h1>

              <h1 className="text-lg md:text-xl font-semibold">{courseData?.course.coursePrice}₹</h1>
            </CardContent>
            <hr/>
            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button className="w-full bg-green-500" onClick={handleContinueCourse}>Continue Course</Button>
              ) : (
                <Button className="bg-blue-700" onClick={handlePayment}>
                  Buy Course
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
