import React from 'react'
import Course from './Course';
import { CourseSkeleton } from './Courses';
import { useLoadUserQuery } from '@/features/api/authApi';

const MyLearning = () => {

    const {data, isLoading} = useLoadUserQuery();
    const myLearning = data?.user.enrolledCourses || [];
  return (
    <div className='max-w-4xl mx-auto my-24 px-4 md:px-0'>
        <h1 className='font-bold text-2xl'>MY LEARNING</h1>
        <div className='mt-5'>
            {
                isLoading?<MyLearningSkeleton /> : myLearning.length == 0 ? (<p className='text-lg text-center mt-20'>You are not enrolled in any course.</p>):(
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            myLearning.map((course,index)=><Course key={index} course={course}/>)
                        }
                    </div>
                )
               
            }
        </div>
    </div>
   
  )
}

export default MyLearning;

const MyLearningSkeleton = ()=>{
   return(
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {
        Array.from({length:3}).map((_,index)=>(
                    <CourseSkeleton key={index}/>
                ))
            }
    </div>
   )
}

