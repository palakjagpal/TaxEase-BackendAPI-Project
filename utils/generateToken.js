import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
// function to generate a JWT token for a given user ID
const generateToken = (user) => {
    // The jwt.sign function is used to create a JWT token. It takes three parameters:
    // 1. The payload: an object containing the user's ID, name, email, and role. This information will be encoded in the token and can be accessed when the token is decoded.
    // 2. The secret key: process.env.JWT_SECRET is the secret key used to sign the token. This should be a secure and unique value defined in your environment variables.
    // 3. Options: { expiresIn: "1h" } specifies that the token will expire in 1 hour. After this time, the token will no longer be valid and the user will need to log in again to obtain a new token.
    // The function returns the generated JWT token, which can be sent to the client and used for authentication in subsequent requests.
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export default generateToken;