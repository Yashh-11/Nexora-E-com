import {Router} from "express"
import UserController from "../controllers/user.controller.js";

const userRouter=Router();

//register user
userRouter.post('/register',UserController.register);

//login user
userRouter.post('/login',UserController.login);

//send email verification otp
userRouter.post('/send-verification-otp', UserController.sendVerificationOtp);

//verify email otp
userRouter.post('/verify-email-otp', UserController.verifyEmailOtp);

//logout


//delete user account
userRouter.delete('/delete-user/:id',UserController.deleteUser);

//update user
userRouter.patch('/update-user/:id',UserController.updateUser);

//get profile
userRouter.get('/getoneuser/:id',UserController.profile);

//get all users
userRouter.get('/getallusers',UserController.getAllUsers);


export default userRouter;
