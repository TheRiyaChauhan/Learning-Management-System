import { Button } from '@/components/ui/button'
import React from 'react'

const HeroSection = () => {
  return (
    <div className='relative bg-gradient-to-r from-blue-400 to bg-indigo-800 dark:from-gray-800 dark:to-gray-900 text-center py-20 px-4'>
        <div  className="max-w-3xl mx-auto">
        <h1 className='text-white text-4xl font-bold mb-4 mt-4'>Find the best courses for you.</h1>
        <p className='text-gray-200 dark:text-gray-400 mb-8'>Discover,Learn and upskill with our wide range of courses</p>
        <form action="" className='flex items-center justify-center'>
            <label className="rounded-full w-full max-w-2xl flex items-center">
                <input 
                type="text" 
                placeholder='Search Courses'
                className='flex-grow bg-white border-none rounded-l-full outline-none px-6 py-2 dark:text-gray-100 mx-auto shadow-lg overflow-hidden w-full h-10'
                />
                <Button className="bg-blue-600 dark:bg-blue-700 text-center h-10 text-white px-6 py-auto text-lg rounded-r-full hover:bg-blue-700 dark:hover:bg-blue-800">Search</Button>
            </label>
        </form>
    <Button className = "bg-white dark:bg-gray-800 text-blue-600 rounded-full hover:bg-gray-300 mt-6 text-md">Explore Courses</Button>
   


        </div>
    </div>
  )
}

export default HeroSection