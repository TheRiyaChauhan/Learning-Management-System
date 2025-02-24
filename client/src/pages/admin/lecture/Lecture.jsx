import { Edit } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Lecture = ({lecture,index,courseId}) => {
    const navigate = useNavigate();
    
    const goToUpdateLecture = ()=>{
        navigate(`/admin/course/${courseId}/lecture/${lecture._id}`)
    }
  return (
    <div className='flex items-center justify-between bg-[#c7e2e2] dark:bg-[#1F1F1F] bg-opacity-50 px-4 py-2 rounded-2xl my-2 mx-10'>
        <h1 className='font-bold text-gray-800 dark:text-gray-100'>
         Lecture - {index+1}: {lecture.lectureTitle}
        </h1>
        <Edit 
        onClick={goToUpdateLecture}
        size={20}
        className='cursor-pointer text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
        />
    </div>
  )
}

export default Lecture;