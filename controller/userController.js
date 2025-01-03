const UserModel = require("../models/users");
const { setUser } = require("../service/auth");
const bcrypt = require("bcrypt");
const validator = require("validator");

const getAll = async (req, res) => {
  try {
    const role = req.params.role;
    const data = await UserModel.find(role ? { role } : {});
    return res.status(200).json({ message: "success", data: data });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
const getById = async (req, res) => {
  try {
    const data = await UserModel.findById(req.params.id);
    return res.status(200).json({ message: "success", data: data });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hasUser = await UserModel.findOne({ email: email });
    if (hasUser)
      return res.status(400).json({ message: "email already registered" });

    // if (!name || !email || !password)
    //   return res.status(400).json({ message: "All fields are required" });

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
    });

    return res
      .status(201)
      .json({ message: "User Created Successfully", data: user });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

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
    // const token = setUser(user, process.env.JWT_KEY, {
    //   expiresIn: "3m",
    // });
    console.log("token", token);
    // const token = setUser(user, process.env.JWT_KEY);
    res.cookie("token", token);

    return res.status(200).json({
      message: "login success",
      user: { token: token, ...user },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "internal server error" });
  }
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
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Error updating user", error: err.message });
  }
}

module.exports = {
  getAll,
  getById,
  signUp,
  login,
  uploadProfile,
  verifyToken,
  createToken,
  userActivation
};
