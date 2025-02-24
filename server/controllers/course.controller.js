import mongoose from "mongoose";

import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMedia, deleteVideo, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = async(req,res)=>{
    try {
        const {courseTitle, category} = req.body;
        if(!courseTitle || !category){
            return res.status(400).json({
                message:"Course tiltle and Category are required"
            })
        }
        const course = await Course.create({
            courseTitle,
            category,
            creator:req.id
        });
        return res.status(201).json({
            course,
            message:"Course created"
        })

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}

export const getPublishedCourses = async(_,res)=>{
    try {
        const courses = await Course.find({isPublished:true}).populate({path:"creator",select:"name photoUrl"})
        if(!courses){
            return res.statud(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            courses,
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get published course"
        })
    }
}

export const getCreatorCourses = async(req,res)=>{
    try {
        const userId = req.id;
        const courses = await Course.find({creator:userId})
        if(!courses){
            return res.statud(404).json({
                courses:[],
                message:"Course not found"
            })
        }
        return res.status(200).json({
            courses
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create course"
        })
    }
}

export const editCourse = async(req,res)=>{
    try {
        const courseId = req.params.courseId;
        const {courseTitle,subTitle,description,category,courseLevel ,coursePrice } = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);

        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }

        let courseThumbnail;
        if(thumbnail){
            if(course.courseThumbnail){
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMedia(publicId); //deleting old thumbnail
            }
              //uploading new thumbnail on cloudinary
            courseThumbnail = await uploadMedia(thumbnail.path)
        }

      

        const updateData = {courseTitle,subTitle,description,category,courseLevel ,coursePrice, courseThumbnail:courseThumbnail?.secure_url}
        course = await Course.findByIdAndUpdate(courseId,updateData,{new:true})
        return res.status(200).json({
            course,
            message:"course updated successfully!"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to edit course"
        })
    }
}

export const getCourseById = async(req,res)=>{
    try {
        const {courseId} = req.params;
    const course = await Course.findById(courseId);
    if(!course){
        return res.status(404).json({
            message:"course not found"
        })
    }
    return res.status(200).json({
        course
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to find course by id"
        })
    }
}

export const removeCourse = async(req,res)=>{
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"course not found"
            })
        }

        // Delete associated lectures
        await Lecture.deleteMany({ _id: { $in: course.lectures } });

        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
            message:"Course removed successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to remove course"
        })
    }
}

//lecture controllers 

export const createLecture = async(req,res) =>{
    try {
        const {lectureTitle} = req.body;
    const {courseId} = req.params;

    if(!lectureTitle || !courseId){
        return res.status(404).json({
            message:"lecture title is required"
        })
    }

    const lecture = await Lecture.create({lectureTitle});
    const course = await Course.findById(courseId);

    if(course){
        course.lectures.push(lecture._id)
        await course.save();
    }
    return res.status(200).json({
        lecture,
        message:"Lecture created successfully!"
    })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create lecture"
        })
    }
}

export const getCourseLecture = async(req,res)=>{
    try {
        const {courseId} = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ message: "Invalid courseId" });
          }
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            lectures:course.lectures
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lectures",
            
        })
    }
}

export const editLecture = async(req,res)=>{
    try {
        const {lectureTitle,videoInfo,isPreviewFree} = req.body;
        const {courseId,lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            })
        }
        if(lectureTitle) lecture.lectureTitle = lectureTitle;
        if(videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if(videoInfo?.publicid) lecture.publicId = videoInfo.publicid
        lecture.isPreviewFree = isPreviewFree;
        
        await lecture.save();

        //adding the lecture in course if it is not already added 
        const course = await Course.findById(courseId);
        if(course && !course.lectures.includes(lecture._id)){
            course.lectures.push(lecture._id)
            await course.save();
        }

        return res.status(200).json({
            lecture,
            message:"Lecture updated successfully."
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to edit lectures",
         
        })
    }
}

export const removeLecture = async(req,res) =>{
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            })
        }

        // delete lecture from cloudinary as well
        if(lecture.publicId){
            await deleteVideo(lecture.publicId)
        }

        // Remove the lecture reference from the associated course
        await Course.updateOne(
            {lectures:lectureId},
            {$pull:{lectures:lectureId}}
        )

        return res.status(200).json({
            message:"Lecture removed successfully."
        })
    

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to remove lecture",
         
        })
    }
}

export const getLectureById = async(req,res) =>{
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            })
        }
        return res.status(200).json({
            lecture
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lecture by Id",
         
        })
    }
}

export const togglePublishCourse= async(req,res)=>{
    try {
        const {courseId} = req.params;
        const {publish} = req.query;
        const course = await Course.findById(courseId)

        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            })
        }

        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished? "Published" : "Unpublished"
        return res.status(200).json({
            message:`Course is ${statusMessage}`
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to change status",
         
        })
    }
}

