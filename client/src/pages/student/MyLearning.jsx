import React from 'react'
import Course from './Course';
import { CourseSkeleton } from './Courses';

const MyLearning = () => {
    const isLoading = false;
    const MyLearningCourses = [1,2,3]
  return (
    <div className='max-w-4xl mx-auto my-24 px-4 md:px-0'>
        <h1 className='font-bold text-2xl'>MY LEARNING</h1>
        <div className='mt-5'>
            {
                isLoading?<MyLearningSkeleton /> : MyLearningCourses.length == 0 ? (<p className='text-lg text-center mt-20'>You are not enrolled in any course.</p>):(
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {
                            MyLearningCourses.map((course,index)=><Course key={index} />)
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

