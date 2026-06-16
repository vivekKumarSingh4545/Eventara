import { User } from "../models/user.model.js";
import { Event } from "../models/events.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { mail, otpFormat } from "../utils/email.js";
import { generateOTP } from "../utils/generateOTP.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const register = asyncHandler(async (req, res) => {
    const { email, username, password, role } = req.body;

    if (!email || !username || !password || !role) {
        return res.status(400).send({
            message: "All fields are required",
            success: false
        });
    }

    let user = await User.findOne({ email });
    if (user) {
        if (user.otp) {
            // Unverified user. Delete the old record so they can register again.
            await User.findByIdAndDelete(user._id);
        } else {
            return res.status(400).send({
                message: "User already exists",
                success: false
            });
        }
    }

    const otp = generateOTP();
    const hashPassword = await bcrypt.hash(password, 10);

    user = new User({
        username,
        email,
        password: hashPassword,
        role,
        otp,
        otpExpires: Date.now() + 10 * 60 * 1000 // 10 minutes from now
    });

    await user.save();

    console.log("========================================");
    console.log(`DEVELOPMENT ALERT - Generated OTP for ${user.username} (${user.email}): ${otp}`);
    console.log("========================================");

    // TODO: Send OTP via email here
    const content = {
        to : user.email,
        subject : "Eventara OTP Verification",
        html : otpFormat(user.username , otp)
    };

    const sent = await mail(content);
    if(!sent){
        console.error(`Failed to send OTP email to ${user.email}. OTP: ${otp}`);
        // Continuing anyway to allow developers to retrieve OTP from logs if email blocks on deployment
    }
  
    return res.status(200).send({
        message: "OTP sent to your email",
        success: true
    });
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { otp, email } = req.body;

    if (!otp || !email) {
        return res.status(400).send({
            message: "OTP missing",
            success: false
        });
    }

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || Date.now() > user.otpExpires) {
        return res.status(400).send({
            message: "OTP not verified or expired",
            success: false
        });
    }

    user.otp = "";
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).send({
        user,
        message: "OTP verified. Registration successful and signed in.",
        success: true
    });
});

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({
            message: "All fields are required",
            success: false
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).send({
            message: "User does not exist",
            success: false
        });
    }

    if (user.otp) {
        if (Date.now() > user.otpExpires) {
            await User.findOneAndDelete({ email });
            return res.status(400).send({
                message: "OTP was not verified in time. Account deleted",
                success: false
            });
        } else {
            return res.status(400).send({
                message: "Please verify your OTP to activate your account",
                success: false
            });
        }
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).send({
            message: "Incorrect email or password",
            success: false
        });
    }

    const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    return res.status(200)
        .cookie("token", token, {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            maxAge: 24 * 60 * 60 * 1000 
        })
        .send({
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
                role: user.role
            },
            token,
            message: "Login successful",
            success: true
        });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
   .populate("eventsOrganized", "title banner  status eventDateTime")
    .populate("eventsAttended", "title banner status eventDateTime")
    .populate("starredEvents", "title banner status eventDateTime");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    user,
    message: "User profile fetched successfully",
  });
});

const logout = asyncHandler(async (req ,res) => {
    res.clearCookie("token" , {
        httpOnly: true,
        sameSite: "None",
        secure: true,
    });
    return res.status(200).send({
        message : "Logout Successfull", 
        success : true
    })
})

const toggleStarEvent = asyncHandler(async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        // Initialize if missing (for older users)
        if (!user.starredEvents) {
            user.starredEvents = [];
        }

        // Cast to string to safely compare
        const isStarred = user.starredEvents.some(id => id.toString() === eventId);

        if (isStarred) {
            // Remove from starred
            user.starredEvents = user.starredEvents.filter(id => id.toString() !== eventId);
        } else {
            // Add to starred
            user.starredEvents.push(eventId);
        }

        await user.save();

        // Re-fetch user to populate for response if needed or just return raw
        const updatedUser = await User.findById(userId)
            .populate("eventsOrganized", "title banner status eventDateTime")
            .populate("eventsAttended", "title banner status eventDateTime")
            .populate("starredEvents", "title banner status eventDateTime");

        return res.status(200).send({
            success: true,
            message: isStarred ? "Event removed from starred list" : "Event starred successfully",
            starredEvents: updatedUser.starredEvents,
            user: updatedUser
        });
    } catch (error) {
        console.error("TOGGLE STAR EVENT ERROR:", error);
        return res.status(500).send({ success: false, message: "Internal server error", error: error.message });
    }
});

const resendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).send({
            message: "Email is required",
            success: false
        });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).send({
            message: "User not found",
            success: false
        });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const content = {
        to : user.email,
        subject : "Eventara OTP Verification (Resend)",
        html : otpFormat(user.username , otp)
    };

    const sent = await mail(content);
    if(!sent){
        return res.status(400).send({
            message : "Problem with resending OTP",
            success : false
        })
    }

    return res.status(200).send({
        message: "OTP resent to your email",
        success: true
    });
});

export { register, verifyOtp, login , logout , getUserProfile, toggleStarEvent, resendOtp };