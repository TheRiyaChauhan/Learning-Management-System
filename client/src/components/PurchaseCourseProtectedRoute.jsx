import { useGetCourseByIdQuery } from "@/features/api/courseApi";
import { useParams, Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; 

const PurchaseCourseProtectedRoute = ({ children }) => {
    const { courseId } = useParams();
    const { data, isLoading } = useGetCourseByIdQuery(courseId);

    
    const user = useSelector((state) => state.auth.user); 

    if (isLoading) return <p>Loading...</p>;

   
    const purchased = data?.course?.enrolledStudents.includes(user?._id);

    return purchased ? children : <Navigate to={`/course-detail/${courseId}`} />;
};

export default PurchaseCourseProtectedRoute;
