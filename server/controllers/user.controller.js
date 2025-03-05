import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";

const cookieOptions = {
    httpOnly:true,
    expires: new Date(Date.now() + 7*24*60*60*1000),
    secure:process.env.NODE_ENV === "production"
}


export const register = async(req,res)=>{
    try {
        const {name,email,password} = req.body;

        if( !name|| !email || !password){
             return res.status(400).json({
                success:false,
                message:"All fields are required."
             })
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                success:false,
                message:"User with this email already exists."
            })
        }

        const hashedPassword = await bcrypt.hash(password,10);
        User.create({
            name,
            email,
            password:hashedPassword
        })
        return res.status(201).json({
            success:true,
            message:"Account created successfully."
        })

    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to register"
        })
    }
}

export const login = async(req,res)=>{
    try {
        const {email,password} = req.body;

        if( !email || !password){
             return res.status(400).json({
                success:false,
                message:"All fields are required."
             })
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password."
            })
        }

      const isPasswordMatch = await bcrypt.compare(password,user.password)
      if(!isPasswordMatch){
        return res.status(400).json({
            success:false,
            message:"Incorrect email or password."
        })
      }

      const token = generateToken(user);

      res.cookie("token", token, cookieOptions)

      res.status(200).json({
        success: true,
        message: `Welcome ${user.name}`,
        user,
        token,
      })

    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to login"
        })
    }
}

export const logout = async(_,res)=>{ 
    try {
        return res.status(200).cookie("token","", {maxAge:0}).json({
            message:"Logged Out Successfully",
            success:true
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to LogOut"
        }) 
    }

}

export const getUserProfile = async(req,res)=>{
    try {
       const userId = req.id;

       const user = await User.findById(userId).select("-password").populate("enrolledCourses")
       if(!user){
        return res.status(404).json({
            message:"Profile not found",
            success:false
        })
       }
       return res.status(200).json({
        success:true,
        user,
       })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to load user"
        }) 
    }
}

export const updateProfile = async(req,res)=>{
try {
    const userId = req.id;
    const {name} = req.body;
    const profilePhoto = req.file;
    
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            message:"User not found",
            success:false
        })
    }
// extracting publicId of old image from url to deslete it 
    if(user.photoUrl){
        const publicId = user.photoUrl.split("/").pop().split(".")[0];
       
        deleteMedia(publicId);
    }

// uploading new photo
const cloudResponse = await uploadMedia(profilePhoto?.path);
const photoUrl = cloudResponse?.secure_url;

const updatedData = {name,photoUrl}
const updatedUser = await User.findByIdAndUpdate(userId,updatedData,{new:true})

return res.status(200).json({
    message:"Profile Updated Successfully",
    user:updatedUser,
    success:true
})


} catch (error) {
    console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to update profile"
        }) 
}
}