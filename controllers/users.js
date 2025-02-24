const Users = require("../repository/users");
const jwt = require("jsonwebtoken");
const path = require('path')
const mkdirp = require('mkdirp')
const UploadService = require('../service/file-upload')
const EmailService = require('../service/email/service')
const {CreateSenderSendGrid, CreateSenderNodmailer} = require('../service/email/sender')
const { v4: uuidv4 } = require('uuid')
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
    const newUser = await Users.create({ password, email, subscription, verifyToken: uuidv4()});
    const emailService = new EmailService(process.env.NODE_ENV, new CreateSenderSendGrid())
    const statusEmail = await emailService.sendVerifyEmail(newUser.email, newUser.verifyToken)
    return res.status(201).json({
      status: "success",
      code: 201,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
        successEmail: statusEmail
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
  if (!user || !isValidPassword || !user?.verify) {
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

const verifyUser = async (req, res, next) => {
 
    const user = await Users.findUserByVerifyToken(req.params.verificationToken)
    if (user) {
      await Users.updateTokenVerify(user._id, true, null)
      return res.status(200).json({status: 'success', code: 200, message: 'Verification successful'})
    }
    return res.status(404).json({status: 'error', code: 404, message: 'Not found'})
} 


const repeatEmailForVerifyUser = async (req, res, next) => {
  const { email } = req.body
  const user = await Users.findByEmail(email)
  if (user && user.verify === false) {
    const {email, verifyToken} = user
    const emailService = new EmailService(process.env.NODE_ENV, new CreateSenderNodmailer())
    await emailService.sendVerifyEmail(email, verifyToken)
    return res.status(200).json({status: 'success', code: 200, message: 'Verification email sent'})
  }
  if (user && user.verify) {
     return res.status(400).json({status: 'Bad request', code: 400, message: 'Verification has already been passed'})
  }
}

module.exports = {
  registration,
  login,
  logout,
  getCurrent,
  uploadAvatar,
  verifyUser,
  repeatEmailForVerifyUser
};
