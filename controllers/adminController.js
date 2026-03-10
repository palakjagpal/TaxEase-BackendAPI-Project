import User from "../models/User.js";

//fetching all users
export const getAllUsers  = async(req,res) => {
    try{
        const users = await User.find().select("-password");
        res.json({
            message : "All users fetched successfully", total : users.length, users
        });
    }catch(err){
        res.status(500).json({
            error : "Failed to fetch users"
        });
    }
};

//delete a user
export const deleteUser = async(req,res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).json({
                message : "User not found"
            });
        }
        res.json({
            message : "User deleted successfully"
        })
    }catch(err){
        res.status(500).json({
            error : "Failed to delete user"
        });
    }
};