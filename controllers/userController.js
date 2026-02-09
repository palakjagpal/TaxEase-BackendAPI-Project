import User from "../models/User.js";
import emailValidator from "../utils/emailValidator.js";
// Get user profile
export const getProfile = async (req, res) => {
    try {
        // Find the user by ID, exclude the password field, and populate the plan details
        // Ensure that the user exists before returning the profile
        // If the user is not found, return a 404 error
        const user = await User.findById(req.user._id)
            .select("-password")
            .populate("plan");

        if (!user) {
            return res.status(404).json({ error: "User not found in database" });
        }

        return res.json({ user });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
};

// Update user profile
export const updateProfile = async ( req, res) => {
    try{
        // Extract the name, email, and password from the request body
        const { name, email, password } = req.body;

        // Validate the email format if an email is provided
        const user = await User.findById(req.user._id);
        
        // If the user is not found, return a 404 error
        if(!user)
            return res.status(404).json({error : "User not found"});

        // If an email is provided, validate its format
        if(name) user.name = name;
        if(email) user.email = email;
        if(password) user.password = await bcrypt.hash(password, 10);

        // Save the updated user profile to the database
        await user.save();
        // Retrieve the updated user profile, excluding the password and populating the plan details
        // Return a success message along with the updated user profile in the response
        // Ensure that the updated user profile is returned in the response, excluding the password and including the plan details
        const safe = await User.findById(user._id)
            .select("-password")
            .populate("plan");

        res.json({
            message: "Profile updated successfully",
            user: safe
        });
        console.log("Profile updated successfully");

    }catch(err){
        res.status(500).json({error : "Failed to update profile"});
        console.log("Failed to update profile");
    }
};