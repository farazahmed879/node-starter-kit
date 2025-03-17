const UserModel = require("../models/users");
const { setUser } = require("../service/auth");
const bcrypt = require("bcrypt");
const validator = require("validator");

const getAll = async (req, res) => {
  try {
    const { role } = req.params; // Get role from params
    const { page = 1, limit = 10 } = req.query; // Get page & limit from query params (defaults: page=1, limit=10)

    const filter = role ? { role: role } : {};

    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const skip = (pageNumber - 1) * limitNumber;
    const data = await UserModel.find(filter).skip(skip).limit(limitNumber);

    // if (!data.length) {
    //   return res.status(404).json({ message: "No users found", data: [] });
    // }

    const totalRecords = await UserModel.countDocuments(filter);

    console.log(data, pageNumber, limitNumber, skip);
    return res.status(200).json({
      message: "success",
      page: pageNumber,
      limit: limitNumber,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limitNumber),
      data,
    });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
const getById = async (req, res) => {
  try {
    const data = await findUserById(req.params.id);
    return res.status(200).json({ message: "success", data: data });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const findUserById = async (userId) => {
  return await UserModel.findById(userId);
};

const signUp = async (req, res) => {
  try {
    const { name, email, password, role, isActive } = req.body;

    if (req.file) {
      console.log("Uploaded file:", req.file);
      // You can save the file path to DB if needed
    }

    const hasUser = await UserModel.findOne({ email: email });
    if (hasUser)
      return res.status(400).json({
        message: "email already registered",
        data: null,
        isSuccess: false,
      });

    if (!name || !email || !password)
      return res.status(400).json({
        message: "All fields are required",
        data: null,
        isSuccess: false,
      });

    // console.log("validator(email)",validator(email))

    // if (!validator(email))
    //   return res.status(400).json({ message: "Email must be a valid email" });

    // if (!validator.isStrongPassword(password))
    //   return res
    //     .status(400)
    //     .json({ message: "Password must be a strong password" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      file: req.file.filename,
      isActive,
    });

    return res.status(201).json({
      message: "User Created Successfully",
      data: user,
      isSuccess: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err, data: null, isSuccess: false });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from request params
    const { name, email, password, role, isActive } = req.body;



    // Find the existing user
    let user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
        isSuccess: false,
      });
    }

    // Update user fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10); // Hash new password if provided
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    // If a new file is uploaded, update the profile picture
    if (req.file) {
      console.log("Uploaded file:", req.file);
      user.file = req.file.filename;
    }

    // Save the updated user
    await user.save();

    return res.status(200).json({
      message: "User updated successfully",
      data: user,
      isSuccess: true,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message, data: null, isSuccess: false });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    // console.log("user", user);
    if (!user) {
      return res.status(404).json({ message: "No such user found", token: "" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid credentials.", token: "" });
    }

    const token = setUser(user, "S3cUreK3y!2023#Taqr33b@t", {
      expiresIn: "3m",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
    });

    // res.cookie("userDetail", JSON.stringify(user));

    return res.status(200).json({
      message: "login success",
      user: { token: token, ...user },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "internal server error" });
  }
};

const tokenHai = async (req, res) => {
  return res.json({ message: "failed", data: false });
};

const uploadProfile = async (req, res) => {
  // console.log("req uploadProfile", req.body);
  // console.log("req uploadProfile", req.file.path);

  //  const { name, email, password, role, id } = req.body;

  return res.status(200).json({
    message: "file upload successfully",
  });
  // console.log("res uploadProfile", res);

  // const user = await UserModel.findOne({ id });
  // user.file =
  return "";
};
const verifyToken = async (req, res) => {
  const { token } = req.body;
  const isValidate = validateToken(token, "S3cUreK3y!2023#Taqr33b@t");
  return isValidate;
};
const createToken = async (user) => {
  const token = setUser(user, "S3cUreK3y!2023#Taqr33b@t", {
    expiresIn: "3m",
  });
  return token;
};

const userActivation = async (req, res) => {
  try {
    const { id, isActive } = req.body; // Get the user ID and isActive flag from request body

    // Validate the 'isActive' value
    if (typeof isActive !== "boolean") {
      return res
        .status(400)
        .json({ message: "'isActive' must be a boolean value" });
    }

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id, // The user's ID from the body
      { $set: { isActive: isActive } }, // Set the isActive field to the provided value
      { new: true } // Return the updated user document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: updatedUser,
      status: true,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
};

const logout = async (req, res) => {
  res.clearCookie("authToken");
  res.clearCookie("userDetail");
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  getAll,
  getById,
  signUp,
  login,
  uploadProfile,
  verifyToken,
  createToken,
  userActivation,
  findUserById,
  logout,
  tokenHai,
  updateUser
};
