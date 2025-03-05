import jwt from "jsonwebtoken";
import {User} from '../models/user.model.js'

const isAuthenticated = async(req,res,next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) {
        return res.status(401).json({message: 'Unauthorized access'});
    }
    try{
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decode.userId);
        if(!user) {
            return res.status(401).json({message: 'User not found'});
        }

        req.id = user._id;
        next();
    } catch (error) {
        console.log(error)
    }
}

export default isAuthenticated;