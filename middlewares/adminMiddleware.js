export const adminMiddleware = (req,res,next) =>{
    //checking if user exists
    if(!req.user){
        return res.status(401).json({
            message : "Unauthorized : No user found"
        })
    }

    //checking role is admin
    if(req.user.role !== "admin"){
        return res.status(403).json({
            message : "Access denied : Admin Only!"
        })
    }

    //alow access
    next();
}