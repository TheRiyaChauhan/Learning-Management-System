import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateLectureMutation, useGetCourseLectureQuery } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Lecture from './Lecture'

const CreateLecture = () => {
    const [lectureTitle, setLectureTitle] = useState();
    const params = useParams();
    const courseId = params.courseId;
    const navigate = useNavigate();

    const [createLecture, {data,isLoading,isSuccess, error}] = useCreateLectureMutation();
    const {data:lectureData , isLoading:lectureLoading , isError:lectureError , refetch} = useGetCourseLectureQuery(courseId);


    const createLectureHandler = async(req,res)=>{
        await createLecture({lectureTitle,courseId});
    }

    useEffect(()=>{
        if(isSuccess){
            refetch();
            toast.success(data.message)
        }
        if(error){
            toast.error(error.data.message);
        }
    },[isSuccess,error])

    return (
       <div>
         <div className='flex-1 mx-10 shadow-lg shadow-blue-500/70 rounded-3xl p-10 mt-5'>
            <div className='mb-6'>
                <h1 className='font-bold text-xl'>Let's Add Lectures</h1>
                <p className='text-sm'>Add some basic details for your new lecture</p>
            </div>
            <div className='space-y-6'>
                <div>
                    <Label>Title </Label>
                    <Input
                        type="text"
                        name="courseTitle"
                        value={lectureTitle}
                        onChange={(e) => setLectureTitle(e.target.value)}
                        placeholder="Lecture Name"
                    />
                </div>
            
                <div className='flex items-center gap-4'>
                    <Button variant="outline" onClick={() => navigate(`/admin/course/${courseId}`)} className="!bg-transparent !border !border-blue-600 text-black  hover:!bg-blue-600 hover:!text-white cssVariables">Back to Course</Button>
                    <Button disabled={isLoading}  className="bg-blue-600" onClick={createLectureHandler} >
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait
                                </>
                            ) : "Create Lecture"
                        }
                    </Button>
                </div>
               
            </div>
           
        </div>
         <div className='mt-10'>
         {
             lectureLoading ? (
                 <p>Loading Lectures....</p>
             ):lectureError ? (
                 <p>Failed to load lectures.</p>
             ):lectureData.lectures.length == 0?(
                 <p>No lectures available.</p>
             ):(
                lectureData.lectures.map((lecture,index)=>(
                 <Lecture key={lecture._id} lecture={lecture} index={index} courseId={courseId}/>
                ))
             )
         }
 </div>
       </div>
    )
}

export default CreateLecture