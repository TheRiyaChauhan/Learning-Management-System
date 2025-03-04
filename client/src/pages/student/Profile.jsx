import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Course from './Course';
import { useLoadUserQuery, useUpdateUserMutation } from '@/features/api/authApi';
import { toast } from 'sonner';

const Profile = () => {

    const [name, setName] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");


    const {data,isLoading,refetch, isSuccess} = useLoadUserQuery();
    const [updateUser, {data:updateUserData,isLoading:updateUserIsLoading,isError:updateUserError, isSuccess:updateIsSuccess}] = useUpdateUserMutation();

    const onChangeHandler = (e)=>{
        const file = e.target.files?.[0];
        if(file) setProfilePhoto(file);

    }
    
    const updateUserHandler = async(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("name",name);
        formData.append("profilePhoto",profilePhoto);
        await updateUser(formData)
        
    }

    useEffect(()=>{
        refetch()
        
    }, [refetch])
    
    useEffect(() => {
        if (updateIsSuccess) {
            refetch();
            toast.success(updateUserData.message || "Profile updated.");
        }
        if (updateUserError) {
            toast.error(updateUserError.message || "Failed to update profile");
          }
    }, [updateUserData,updateIsSuccess, updateUserError]);
    
    if(isLoading) return <h1>Profile is Loading ....</h1>
    const {user} = data || {};
  return (
    <div className='mx-auto my-20 max-w-4xl px-4 bg-gray-100 rounded-2xl dark:bg-black p-5'>
        <h1 className='text-center text-2xl md:text-left font-bold'>MY PROFILE</h1>
        <div className='flex flex-col md:flex-row items-center md:items-start gap-8 my-5'>
            <div className='flex flex-col items-center'>
            <Avatar className='h-24 w-24 md:h-44 md:w-44 border-e-8 border-blue-200 mt-2'>
              <AvatarImage src={ user?.photoUrl || "https://thumbs.dreamstime.com/b/d-icon-avatar-cartoon-cute-freelancer-woman-working-online-learning-laptop-transparent-png-background-works-embodying-345422695.jpg"} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            </div >
            <div className="ml-5 mt-4">
                <div className='mb-2'>
                    <h1 className='font-semibold text-gray-900 dark:text-gray-100 text-lg '>
                         Name:
                         <span className='text-gray-800 dark:text-gray-300 font-normal ml-2 text-md'>{user?.name}</span>
                    </h1>
                </div>
                <div className='mb-2'>
                    <h1 className='font-semibold text-gray-900 dark:text-gray-100 text-xl'>
                         Email:
                         <span className='text-gray-800 dark:text-gray-300 font-normal ml-2 text-lg'>{user?.email}</span>
                    </h1>
                </div>
                <div className='mb-2'>
                    <h1 className='font-semibold text-gray-900 dark:text-gray-100 text-xl'>
                         Role:
                         <span className='text-gray-800 dark:text-gray-300 font-normal ml-2 text-lg'>{user?.role.toUpperCase()}</span>
                    </h1>
                </div>
               
                <Dialog >
                    <DialogTrigger asChild>
                        <Button className="mt-2 bg-blue-600 text-white">Edit Profile</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. click save when you're done
                            </DialogDescription>
                        </DialogHeader>
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <label>Name</label>
                                <Input 
                                type="text" 
                                value = {name}
                                onChange= {(e)=>setName(e.target.value)}
                                placeholder="Name" 
                                className="col-span-3"/>
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <label>Profile Photo</label>
                                <Input 
                                onChange ={onChangeHandler}
                                type="file" 
                                accept="image/*" 
                                className="col-span-3"/>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button  disabled={updateUserIsLoading} onClick = {updateUserHandler}>
                                {
                                    updateUserIsLoading ? (
                                        <>
                                        <Loader2 className='mr-2 h-4 w-4  animate-spin '/> Please Wait.
                                        </>
                                    ) : "Save Changes"
                                }
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                
             
            </div>
        </div>
        <div>
            <h1 className='font-semibold text-lg'>Courses you're enrolled in.</h1>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-5'>
                        {
                            user?.enrolledCourses.length === 0 ? <h1>You haven't enrolled in any course yet</h1> : (
                                user?.enrolledCourses.map((course)=> <Course course ={course} key={course._id}/>)
                            )
                        }
            </div>
        </div>
    </div>
  )
}

export default Profile;