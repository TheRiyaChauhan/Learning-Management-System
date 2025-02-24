import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { useEditLectureMutation, useGetLectureByIdQuery, useRemoveLectureMutation } from '@/features/api/courseApi'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

const LectureTab = () => {
    const MEDIA_API = "http://localhost:8080/api/v1/media"

    const [lectureTitle,setLectureTitle] =useState("")
    const [uploadVideoInfo, setUploadVideoInfo] = useState(null)
    const [isPreviewFree, setIsPreviewFree] = useState(false)
    const [mediaProgress, setMediaProgress]= useState(false)
    const [uploadProgress,setUploadProgress] = useState(0)
    const [btnDisable , setBtnDisable] = useState(true)

    const params = useParams();
    const {courseId,lectureId} = params;

    const {data:lectureData} = useGetLectureByIdQuery(lectureId);
    const lecture = lectureData?.lecture;

   useEffect(()=>{
        if(lecture){
            setLectureTitle(lecture.lectureTitle)
            setIsPreviewFree(lecture.isPreviewFree)
            setUploadVideoInfo(lecture.videoInfo)
        }
    },[lecture])

   
    const [editLecture,{data,isLoading,error,isSuccess}] =useEditLectureMutation();
    const [removeLecture , {data:removeData , error:removeError, isSuccess:removeIsSuccess }] = useRemoveLectureMutation();


    const fileChangeHandler = async(e)=>{
        const file = e.target.files[0];
        if(file){
            const formData = new FormData();
            formData.append("file" , file)
            setMediaProgress(true);
            try {
                const res = await axios.post(`${MEDIA_API}/upload-video` , formData,{
                    onUploadProgress:({loaded,total})=>{
                        setUploadProgress(Math.round((loaded*100) / total))
                    }
                })
                if(res.data.success){
                    
                    setUploadVideoInfo({videoUrl:res.data.data.url , publicId:res.data.data.public_Id})
                    setBtnDisable(false);
                    toast.success(res.data.message)
                }
                
            } catch (error) {
                console.log(error)
                toast.error("Video upload failed")
            }finally{
                setMediaProgress(false)
            }
        }
    }

    const editLectureHandler = async()=>{
        await editLecture({lectureTitle,videoInfo:uploadVideoInfo,isPreviewFree,courseId,lectureId})
    }

    const removeLectureHandler = async()=>{
        await removeLecture(lectureId);
    }

    useEffect(()=>{
        if(isSuccess){
            toast.success(data.message)
        }
        if(error){
            toast.error(error.data.message)
        }
    },[isSuccess,error])

    useEffect(()=>{
        if(removeIsSuccess){
            toast.success(removeData?.message )
        }
        if(removeError){
            toast.error(removeError?.removeData?.message)
        }
    },[removeIsSuccess, removeError])

  return (
    <div >
        <Card className="shadow-lg shadow-blue-500/70 rounded-3xl p-5" >
            <CardHeader className="flex-row justify-between ">
                <div>
                <CardTitle className="text-lg">Edit Lecture</CardTitle>
                <CardDescription>Make changes and click save when done</CardDescription>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant = "destructive" onClick={removeLectureHandler}>Remove Lecture</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div>
                    <Label>Title</Label>
                    <Input 
                    type="text"
                    value = {lectureTitle}
                    onChange={(e)=>setLectureTitle(e.target.value)}
                   
                    />
                </div>
                <div className='my-5'>
                    <Label>Video <span className='text-red-700 text-lg'>*</span></Label>
                    <Input 
                    type="file"
                    accept="video/*"
                    onChange={fileChangeHandler}
                    className="w-fit"
                
                    />
                </div>
                <div className='flex place-items-center space-x-2 my-8'>
                <Switch checked={isPreviewFree} onCheckedChange={setIsPreviewFree} id="airplane-mode" />
                <Label htmlFor="airplane-mode">Is this video Free</Label>
                </div>
                {
                    mediaProgress && (
                        <div className='my-5'>
                            <Progress value={uploadProgress} />
                            <p>{uploadProgress}% uploaded</p>
                        </div>
                    )
                }
                <div className='mt-4'>
                    <Button className="bg-blue-600" onClick = {editLectureHandler}>Update Lecture</Button>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default LectureTab