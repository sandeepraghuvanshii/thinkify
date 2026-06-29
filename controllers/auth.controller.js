require("dotenv").config();
const User = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
// const { sendEmail } = require("../services/mail.service");
// const { welcomeEmailTemplate } = require("../templates/welcomeEmailTemplate");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    const { username, name, email, password, role, avatar } = req.body;

    const userPassword = await hashPassword(password);
    const user = await User.create({
      username,
      name,
      email,
      password: userPassword,
      role,
      avatar,
    });
    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
      // email: user.email,
    });

    // await sendEmail({
    //   to: email,
    //   subject: "Welcome to bookify",
    //   text: `Hi ${username}, Thank you for registering at bookify`,
    //   html: welcomeEmailTemplate({ username, accessToken }),
    // });
    res.cookie("accessToken", accessToken);
    return res.status(201).json({
      message: "User registered successfully",
      user,
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { username }],
    }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    // if (!user.isVerified) {
    //   return res.status(401).json({
    //     message: "Account not verified",
    //   });
    // }
    const isPasswordMatched = await comparePassword(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken({
      id: user._id,
      role: user.role,
    });
    res.cookie("accessToken", accessToken);
    return res.status(200).json({
      message: "LoggedIn successfully",
      user: {
        id: user?._id || user?.id, // Handles both MongoDB (_id) and SQL (id)
        username: user?.username,
        email: user?.email,
        avatar: user?.avatar,
      },
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// const verifyAccountController = async (req, res) => {
//   try {
//     const token = req.query.token;

//     if (!token) {
//       return res.status(400).json({
//         success: false,
//         message: "Token is required",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

//     // First find user
//     const user = await User.findOne({
//       email: decoded.email,
//     });

//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Verification failed",
//       });
//     }

//     // Check if already verified
//     if (user.isVerified) {
//       return res.status(400).json({
//         success: false,
//         message: "Account already verified",
//       });
//     }

//     // Verify account
//     user.isVerified = true;
//     await user.save();

//     return res.status(200).json({
//       success: true,
//       message: "Account verified successfully",
//     });
//   } catch (error) {
//     console.log(error);

//     return res.status(500).json({
//       success: false,
//       message: "Invalid or expired token",
//     });
//   }
// };
const profileController = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(404).json({
      success: false,
      message: "Unauthorized",
    });
  }
  const user = await User.findById({ _id: userId }) // ❌ WRONG: .select("-isVerified, role, updateAt, createAt");
    //  RIGHT: Excludes only these four fields
    .select("-isVerified -role -updatedAt -createdAt");
  return res.status(200).json({
    success: true,
    user,
  });
};

const profileUpdateController = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(404).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const { username, email, ...updateData } = req.body;
  if (username || email) {
    return res.status(400).json({
      success: false,
      message: "Username and email cannot be changed",
    });
  }

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
};

module.exports = {
  registerController,
  loginController,
  // verifyAccountController,
  profileController,
  profileUpdateController,
};
