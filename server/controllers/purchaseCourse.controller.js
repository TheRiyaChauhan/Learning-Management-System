import crypto from 'crypto';
import { User } from '../models/user.model.js';
import { Course } from '../models/course.model.js';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
})

export const createOrder = async(req,res)=>{
    const userId = req.id;
    const {courseId,price} = req.body;

    const user =await User.findById(userId);

    if(user.enrolledCourses.includes(courseId)){
        return res.status(400).json({
            message:"course already purchased."
        })
    }
    
    try {
        const order = await razorpay.orders.create({
            amount: price,
            currency: 'INR',
            payment_capture: 1
        })

        res.status(200).json({message: "Order created Succesfully", order})
        
    } catch (error) {
        res.status(500).json({ message:error });
    }

}

export const verifyPayment = async(req,res)=>{
    const userId = req.id;
    const {courseId, paymentId,signature,orderId} = req.body;

    if(!paymentId || !signature){
        return res.status(400).json({
            message:"PaymentId required"
        })
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId)
    const key_secret = process.env.RAZORPAY_SECRET;

    const generated_signature = crypto
    .createHmac("sha256", key_secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

    if(generated_signature == signature){
        user.enrolledCourses.push(courseId);
        course.enrolledStudents.push(userId);

        await user.save();
        await course.save();

        return res.status(200).json({
            message:"payment successful",
            user
        })
    }
    else{
         return res.status(400).json({
            message:"payment not successful"
         })
    }

    
}

