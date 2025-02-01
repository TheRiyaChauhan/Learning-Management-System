import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateCourseMutation } from '@/features/api/courseApi'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const AddCourse = () => {

    const [courseTitle, setCourseTitle] = useState("");
    const [category, setCategory] = useState("");

    const [createCourse, { data, isLoading, error, isSuccess }] = useCreateCourseMutation();

    const navigate = useNavigate();


    const getSelectedCategory = (value) => {
        setCategory(value);
    }

    const createCourseHandler = async () => {
        await createCourse({ courseTitle, category })
    }

    //toats
    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Course Created !")
            navigate("/admin/course");
        }
    }, [isSuccess, error])


    return (
        <div className='flex-1 mx-10 shadow-lg shadow-blue-500/70 rounded-3xl p-10 mt-5'>
            <div className='mb-6'>
                <h1 className='font-bold text-xl'>Let's Add Course</h1>
                <p className='text-sm'>Add some basic course details for your new course</p>
            </div>
            <div className='space-y-6'>
                <div>
                    <Label>Title </Label>
                    <Input
                        type="text"
                        name="courseTitle"
                        value={courseTitle}
                        onChange={(e) => setCourseTitle(e.target.value)}
                        placeholder="Your Course Name"
                    />
                </div>
                <div>
                    <Label>Category</Label>
                    <Select onValueChange={getSelectedCategory}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Category</SelectLabel>
                                <SelectItem value="Next JS">Next JS</SelectItem>
                                <SelectItem value="Data Science">Data Science</SelectItem>
                                <SelectItem value="Frontend Development">Frontend Development</SelectItem>
                                <SelectItem value="Backend Development">Backend Development</SelectItem>
                                <SelectItem value="Fullstack Development">Fullstack Development</SelectItem>
                                <SelectItem value="MERN Stack Development">MERN Stack Development</SelectItem>
                                <SelectItem value="Javascript">Javascript</SelectItem>
                                <SelectItem value="Python">Python</SelectItem>
                                <SelectItem value="Docker">Docker</SelectItem>
                                <SelectItem value="MongoDB">MongoDB</SelectItem>
                                <SelectItem value="HTML">HTML</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className='flex items-center gap-4'>
                    <Button variant="outline" onClick={() => navigate("/admin/course")} className="!bg-transparent !border !border-blue-600 text-black  hover:!bg-blue-600 hover:!text-white cssVariables">Back</Button>
                    <Button disabled={isLoading} onClick={createCourseHandler} className="bg-blue-600" >
                        {
                            isLoading ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                    Please wait
                                </>
                            ) : "Create"
                        }
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AddCourse