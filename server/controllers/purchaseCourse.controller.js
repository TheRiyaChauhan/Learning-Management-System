import crypto from 'crypto';
import { User } from '../models/user.model.js';
import { Course } from '../models/course.model.js';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
})

export const createOrder = async(req,res)=>{
    try {
    const userId = req.id;
    const {courseId,price} = req.body;

    const user =await User.findById(userId);

    if(user.enrolledCourses.includes(courseId)){
        return res.status(400).json({
            message:"course already purchased."
        })
    }
        const order = razorpay.orders.create({
            amount: price*100,
            currency: 'INR',
            payment_capture: 1
        })
        order.then(async(order)=>{
            res.status(200).json({order})
        }) 
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

    try{
        if((generated_signature === signature)){
        user.enrolledCourses.push(courseId);
        course.enrolledStudents.push(userId);

        await user.save();
        await course.save();

        return res.status(200).json({
            message:"payment successful",
            user
        })
    }
    }
    catch(error){
         return res.status(400).json({
            message: error || "payment not successful"
         })
    }

    
}

export const purchasedCourses = async (req, res) => {
    try {
        const purchasedCourses = await Course.find({
            enrolledStudents: { $exists: true, $not: { $size: 0 } }
        });

        if (!purchasedCourses.length) {
            return res.status(404).json({ message: "No purchased courses found" });
        }

        return res.status(200).json({ purchasedCourses });

    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};


