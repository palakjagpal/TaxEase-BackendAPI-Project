const jwt = require("jsonwebtoken"); 

// function to generate a JWT token for a given user ID
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET;
    // fetching token expiration time from environment variables
    // if not defined, default expiration is set to 7 days
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    // creating and returning a signed JWT token
    // payload contains the user ID (id: userId)
    // secret is used to sign the token
    // expiresIn defines how long the token will remain valid
    return jwt.sign({id: userId}, secret, {expiresIn});

};

module.exports = generateToken;