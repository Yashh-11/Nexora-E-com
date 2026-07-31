import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"

const otpStore = new Map();

const createOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const getTransporter = () => {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
        return null;
    }

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS
        }
    });
};

const UserController = {
    register: async (req, res) => {
        try {

            req.body.password = await bcrypt.hash(req.body.password, 10)

            const user = await User.create(req.body);

            return res.status(200).json({ message: "User Registered Succesfully", user });

        } catch (error) {

            return res.status(500).json({ message: "Something Went Wrong!!" })

        }

    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });

            if (!user) return res.status(400).json({ message: "User not exists.." })

            const isValid = await bcrypt.compare(password, user.password)

            if (!isValid) return res.status(400).json({ message: "Password doesn't match!!" })

            if (!user.verified) return res.status(403).json({ message: "Please verify your email before login." })

            const safeUser = {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }

            return res.status(200).json({ message: "Login Success", user: safeUser })

        } catch (error) {

            return res.status(500).json({ message: "Something Went Wrong!!" })

        }
    },
    logout: async (req, res) => {
        try {

        } catch (error) {

            return res.status(500).json({ message: "Something Went Wrong!!" })

        }
    },
    sendVerificationOtp: async (req, res) => {
        try {
            const email = req.body.email?.trim().toLowerCase();

            if (!email) return res.status(400).json({ message: "Email is required." })

            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: "Account not found." })

            const transporter = getTransporter();
            if (!transporter) {
                return res.status(500).json({
                    message: "Email service is not configured. Add SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and SMTP_FROM to your server .env."
                })
            }

            const otp = createOtp();
            otpStore.set(email, {
                otp,
                expiresAt: Date.now() + 10 * 60 * 1000
            });

            await transporter.sendMail({
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: email,
                subject: "Your Nexora verification code",
                text: `Your Nexora verification code is ${otp}. It expires in 10 minutes.`
            });

            return res.status(200).json({ message: "OTP sent to registered email." })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    verifyEmailOtp: async (req, res) => {
        try {
            const email = req.body.email?.trim().toLowerCase();
            const otp = req.body.otp?.trim();

            if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required." })

            const savedOtp = otpStore.get(email);
            if (!savedOtp) return res.status(400).json({ message: "Please request a new OTP." })

            if (savedOtp.expiresAt < Date.now()) {
                otpStore.delete(email);
                return res.status(400).json({ message: "OTP expired. Please request a new one." })
            }

            if (savedOtp.otp !== otp) return res.status(400).json({ message: "Invalid OTP." })

            const user = await User.findOneAndUpdate(
                { email },
                { verified: true },
                { new: true }
            );

            if (!user) return res.status(404).json({ message: "Account not found." })

            otpStore.delete(email);

            return res.status(200).json({
                message: "Email verified successfully.",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    },
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await User.findByIdAndDelete(id, req.body, { new: true });
            return res.status(200).json({ message: "User Delete Successfully", data })
        } catch (error) {

            return res.status(500).json({ message: "Something Went Wrong!!" })

        }
    },
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await User.findByIdAndUpdate(id, req.body, { new: true });
            return res.status(200).json({ message: "User Update Successfully", user })
        } catch (error) {

            return res.status(500).json({ message: "Something Went Wrong!!" })

        }
    },
    profile: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await User.findById(id);
            return res.status(200).json({ message: "success", data })
        } catch (error) {

            return res.status(500).json({ message: "Something Went Wrong!!" })

        }
    },
    getAllUsers: async (req, res) => {
        try {
            const search = req.query.search || '';
            const page = req.query.page || 1;
            const limit = req.query.limit || 5;
            const sort = req.query.sort || '';
            const skip = (page - 1) * limit;

            let sortValue = 1;
            if (sort == "D" || "d") {
                sortValue = -1;
            }
            const data = await User.find({ name: { $regex: search, $options: 'i' } })
                .skip(skip)
                .limit(limit)
                .sort({ name: sortValue });
            return res.status(200).json({ message: "success", data })
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }
}
export default UserController
