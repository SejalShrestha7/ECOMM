import User from "../model/user.js";
import bcrypt from "bcryptjs";
import { response } from "express";
import jwt from "jsonwebtoken";

export const addUser = async (request, response) => {
  try {
    const user = request.body;
    const newUser = await new User(user);
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    newUser.save();
    response.json({
      status: 201,
      message: "User Created Sucessfully",
      data: newUser,
    });
  } catch (error) {
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const updateUserDetails = async (request, response) => {
  try {
    const {
      user_id,
      firstname,
      lastname,
      username,
      phone,
      district,
      state,
      location,
    } = request.body;

    const user = await User.findOne({ _id: user_id });
    console.log(request.body);
    if (!user) {
      response.json({ status: 401, message: "User cannot be found" });
    }

    const userDetails = {
      firstName: firstname || user.firstName,
      lastName: lastname || user.lastName,
      userName: username || user.userName,
      phone: phone || user.phone,
      district: district || user.district,
      state: state || user.state,
      location: location || user.location,
    };
    const updatedUser = await User.findByIdAndUpdate(
      { _id: user_id },
      userDetails,
      {
        new: true,
      }
    );
    response.json({
      status: 200,
      message: "User Created Sucessfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const logIn = async (request, response, next) => {
  try {
    const user = await User.findOne({ email: request.body.email });

    if (!user) {
      response.json({ status: 401, message: "Invalid Email or Password ." });
      next();
    }
    const validPassword = await bcrypt.compare(
      request.body.password,
      user.password
    );
    if (!validPassword) {
      response.json({
        status: 401,
        message: "Invalid Email or Password .",
      });
      return next();
    }
    response.json({
      status: 201,
      message: "Login Sucessfull",
      token: jwt.sign({ _id: user?._id }, process.env.SECRET),
      role: user?.role,
    });
  } catch (error) {
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const getUserByID = async (request, response) => {
  try {
    const user = await User.findById(request.user._id);
    if (!user) {
      return res.status(404).json({ message: "No Profile Found" });
    }
    response.json({
      status: 200,
      message: "User fetch Sucessfully",
      data: user,
    });
  } catch (error) {
    response.json({ status: 500, message: "Internal Server error" });
  }
};

export const getAllUser = async (request, response) => {
  try {
    const user = await User.find();

    let newUser = user.map(
      ({ _id, firstName, lastName, userName, email, phone, role }) => ({
        _id,
        firstName,
        lastName,
        userName,
        email,
        phone,
        role,
      })
    );

    response.json({
      status: 201,
      message: "Users fetch sucessfully",
      data: newUser,
    });
  } catch (error) {
    response.json({ status: 500, message: "Internal Server error" });
  }
};
