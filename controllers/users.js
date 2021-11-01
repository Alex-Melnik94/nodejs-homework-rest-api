const Users = require("../repository/users");
const jwt = require("jsonwebtoken");
const path = require('path')
const mkdirp = require('mkdirp')
const UploadService = require('../service/file-upload')
require("dotenv").config();
const SECRET_KEY = process.env.JWT_SECRET_KEY;

const registration = async (req, res, next) => {
  const { password, email, subscription } = req.body;
  const user = await Users.findByEmail(req.body.email);
  if (user) {
    return res
      .status(409)
      .json({ status: "Conflict", code: 409, message: "Email in use" });
  }
  try {
    const newUser = await Users.create({ password, email, subscription });
    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findByEmail(email);

  const isValidPassword = await user.isValidPassword(password);
  if (!user || !isValidPassword) {
    return res
      .status(401)
      .json({
        status: "Unauthorized",
        code: 401,
        message: "Email or password is wrong",
      });
  }

  const id = user._id;
  const payload = { id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await Users.updateToken(id, token);

  return res.status(200).json({
    status: "success",
    code: 200,
    data: {
      token: token,
      user: {
        email: email,
        subscription: user.subscription,
      },
    },
  });
};

const logout = async (req, res, next) => {
  const id = req.user._id;
  const user = await Users.findById(id);
  if (!user) {
    return res
      .status(401)
      .json({ status: "Unauthorized", code: 401, message: "Not authorized" });
  }
  await Users.updateToken(id, null);
  return res.status(204).json({ status: "No Content" });
};

const getCurrent = async (req, res, next) => {
  const id = req.user._id;
  const user = await Users.findById(id);
  if (!user) {
    return res
      .status(401)
      .json({ status: "Unauthorized", code: 401, message: "Not authorized" });
  }
  
  return res
    .status(200)
    .json({
      status: "OK",
      code: 200,
      data: { email: user.email, subscription: user.subscription },
    });
};

const uploadAvatar = async (req, res, next) => {
  const id = String(req.user._id);
  const file = req.file
  const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS;
  const dest = path.join(AVATAR_OF_USERS, id)
  await mkdirp(dest)
  const uploadService = new UploadService(dest)
  const avatarUrl = await uploadService.save(file, id)
  await Users.updateAvatar(id, avatarUrl)
  return res.status(200).json({status: 'success', code: 200, data: {avatar: avatarUrl}})
}

module.exports = {
  registration,
  login,
  logout,
  getCurrent,
  uploadAvatar,
};
