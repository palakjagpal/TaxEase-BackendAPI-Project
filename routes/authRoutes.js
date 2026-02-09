import { registerUser, loginUser, protectedRoute, publicRoute } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import express from "express";  

// We create a new router object using express.Router(). This router will be used to define our authentication-related routes, such as registration, login, and protected routes. By using a router, we can modularize our route definitions and keep our code organized
const router = express.Router();
// We define our authentication routes using the router object. Each route is associated with a specific HTTP method (e.g., POST for registration and login, GET for protected and public routes) and a corresponding controller function that handles the logic for that route. The authMiddleware is applied to the protected route to ensure that only authenticated users can access it.

// The router.post("/register", registeredUser) line defines a POST route for user registration. When a client sends a POST request to the "/register" endpoint, the registeredUser controller function will be executed to handle the registration logic.

router.post("/register", registerUser);
// The router.post("/login", loginUser) line defines a POST route for user login. When a client sends a POST request to the "/login" endpoint, the loginUser controller function will be executed to handle the login logic.

router.post("/login", loginUser);
// The router.get("/protected", authMiddleware, protectedRoute) line defines a GET route for a protected resource. When a client sends a GET request to the "/protected" endpoint, the authMiddleware will first be executed to authenticate the request. If authentication is successful, the protectedRoute controller function will be executed to handle the logic for the protected resource.

router.get("/protected", authMiddleware, protectedRoute);
// The router.get("/public", publicRoute) line defines a GET route for a public resource. When a client sends a GET request to the "/public" endpoint, the publicRoute controller function will be executed to handle the logic for the public resource. This route does not require authentication, so it can be accessed by anyone.
router.get("/public", publicRoute);

export default router;
