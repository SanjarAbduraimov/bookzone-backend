import Users from "../models/users.js";
import Joi from "joi";
import * as utils from "../utils/index.js";
import Author from "../models/authors.js";
import User from "../models/users.js";
import emailService from "../lib/nodemailer/index.js";
import MyError from "../utils/error.js";
import sendSms from "../lib/sayqal/index.js";
import { customAlphabet } from "nanoid";
import passport from "passport";

export const signUp = async (req, res) => {
  // #swagger.tags = ['Auth']
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Login params',
        required: true,
        type: 'obj',
        schema: { $ref: '#/definitions/SIGN_UP' }
} */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/AUTH_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Something went wrong or Error object',
         schema: {
            success: false,
            msg: 'Email or password is wrong'
        }
  } */

  let { error } = validateSignUp(req.body);
  if (error) throw new MyError(error.message, 400)
  let user = await Users.create({ ...req.body });
  if (req.body.role === "author") {
    await Author.create({ ...user._doc });
  }

  let token = utils.createToken({ id: user._id, role: user.role });
  const { password, ...docs } = user._doc;
  res.status(201).json({ token, user: docs, success: true });
};

export const forgotPassword = async (req, res) => {
  // #swagger.tags = ['Auth']
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Forgot Password params',
        required: true,
        type: 'obj',
        schema: { $ref: '#/definitions/LOG_IN' }
} */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/AUTH_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Password or Email is wrong',
         schema: {
            success: false,
            msg: 'Email or password is wrong'
        }
  } */

  const { error } = validateForgotPassword(req.body);
  if (error) throw new MyError(error.message, 400);
  const user = await User.findOne({ email: req.body.email });
  // Generate a reset token and store it in the database
  if (req.body.otp) {
    if (user.otp.createdAt) {
      const isExpired = user.otp.createdAt.getTime() + 2 * 60 * 1000 < Date.now()
      if (!isExpired) {
        throw new MyError("Too many OTP attempts. Please try again later.", 429)
      }
    }

    const otp = customAlphabet("0123456789")(6)

    await sendSms({
      message: {
        smsid: user._id,
        phone: user.phone,
        text: `Reset password: ${otp}`
      }
    })
    user.otp = {
      code: otp,
      createdAt: new Date(),
      attempts: 0,
      verified: false
    }
    await user.save();
    return res.status(201).json({ success: true, msg: `OTP sent to your phone number` });
  } else {
    const resetToken = utils.createToken({ _id: user._id, email: user.email, role: user.role }, { expiresIn: "15m" });
    const fullUrl = req.get("Referer") ? `${new URL(req.url, req.get("Referer"))}` : `${req.protocol}://${req.get('host')}${req.originalUrl}`
    const mail = await emailService.send({
      to: user.email, //auth/verify/forget-password/:token
      html: `<a style="padding:7px 15px; display:inline-block; background: blue; text-decoration: none;color:#fff" href='${fullUrl}/?token=${resetToken}'><b>Reset Password</b></a>`,
    });
    user.resetToken = resetToken;
    await user.save();
    return res.status(201).json({ success: true, msg: `Verification link sended to your email` });
  }
}
export const changePassword = async (req, res) => {
  // #swagger.tags = ['Auth']
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Forgot Password params',
        required: true,
        type: 'obj',
        schema: { $ref: '#/definitions/LOG_IN' }
} */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/AUTH_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Password or Email is wrong',
         schema: {
            success: false,
            msg: 'Email or password is wrong'
        }
  } */

  const { error } = validateEmail({ email: req.body.email });
  if (error) throw new MyError(error.message, 400);
  const user = await User.findOne({ email: req.body.email });
  // Generate a reset token and store it in the database
  const resetToken = utils.createToken({ _id: user._id, email: user.email, role: user.role }, { expiresIn: "15m" });
  const fullUrl = req.get("Referer") ? `${new URL(req.url, req.get("Referer"))}` : `${req.protocol}://${req.get('host')}${req.originalUrl}`

  const mail = await emailService.send({
    to: user.email, //auth/verify/forget-password/:token
    html: `<a style="padding:7px 15px; display:inline-block; background: blue; text-decoration: none;color:#fff" href='${fullUrl}/?token=${resetToken}'><b>Reset Password</b></a>`,
  });
  user.resetToken = resetToken;
  await user.save();
  return res.status(201).json({ success: true, msg: `Verification link sended to your email` });
}

export const resetPassword = async (req, res) => {
  const token = req.params.token
  const { error } = validatePassword(req.body)
  if (error) throw new MyError(error.message, 400)
  const validatedToken = utils.validateToken(token, "Invalid verification link")
  const user = await User.findOne({ email: validatedToken.email, resetToken: token })
  if (!user) throw new MyError("Invalid verification link", 400);
  user.password = req.body.password
  user.resetToken = undefined;
  user.otp = undefined
  await user.save()
  return res.status(201).json({ success: true, msg: 'Password resettled successfully' });
}
export const verifyResetPasswordByOTP = async (req, res) => {

  const { error } = validateVerifyForgotPassword(req.body);
  if (error) throw new MyError(error.message, 400)

  const { email, otp } = req.body;
  const user = await User.findOne({ email })
  if (!user) throw new MyError("User not found", 400);

  if (user.otp.code === otp) {
    if (!user.otp.code || !user.otp.createdAt || Date.now() - user.otp.createdAt.getTime() > 2 * 60 * 1000) {
      throw new MyError("OTP expired", 400);
    }
    // Check if the user has reached the maximum OTP verification attempts
    if (user.otp.attempts >= 3) {
      return res.status(429).json({ success: false, message: 'Too many OTP attempts. Please try again later.' });
    }

    // Allow the user to reset their password
    const token = utils.createToken({ _id: user._id, email: user.email, role: user.role }, { expiresIn: "15m" })
    user.otp = {
      ...user.otp,
      verified: true
    }
    user.resetToken = token;
    await user.save();
    return res.status(200).json({ success: true, token, message: 'OTP verified successfully. Proceed to reset password.' });
  } else {
    // Increment the attempts if OTP verification fails
    user.otp.attempts += 1;
    await user.save();

    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
}
export const verifyResetPassword = async (req, res) => {
  const token = req.params.token
  const validatedToken = utils.validateToken(token, "Invalid verification link")
  const user = await User.findOne({ email: validatedToken.email, resetToken: token })
  if (!user) throw new MyError("Invalid verification link", 400);
  return res.status(200).json({ success: true });
}

export const verifyEmail = async (req, res) => {

  const { token } = req.params
  let validToken = utils.validateToken(token, "Invalid verification link")
  let user = await User.findById(validToken._id)
  if (!user) throw new MyError("Invalid verification link", 400)
  user.verified = true;
  await user.save();

  return res.status(201).json({ success: true, msg: 'Email has verified' });

}

export const generateEmailVerificationToken = async (req, res) => {

  const { error } = validateEmail(req.body);
  if (error) throw new MyError(error.message, 400);

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(201).json({ success: true, msg: 'Email not found. Please register to continue.' });
  }

  if (user && !user.verified) {
    let token = utils.createToken({ _id: user._id, email: user.email, role: user.role }, { expiresIn: "15m" });

    const fullUrl = req.get("Referer") ? `${new URL(req.url, req.get("Referer"))}` : `${req.protocol}://${req.get('host')}${req.originalUrl}`
    const mail = await emailService.send({
      to: user.email,
      html: `<a href='${fullUrl}/?token=${token}'><b>Bos Jails</b></a>`,
    })
    return res.status(201).json({ success: true, msg: `Verification link sended to your email` });
  }

  return res.status(400).json({ success: true, msg: 'Email already verified' });

}
export const login = async (req, res, next) => {
  // #swagger.tags = ['Auth']
  /* #swagger.parameters['body'] = {
        in: 'body',
        description: 'Login params',
        required: true,
        type: 'obj',
        schema: { $ref: '#/definitions/LOG_IN' }
} */
  /* #swagger.responses[200] = {
          description: 'Response body',
          schema: {$ref: '#/definitions/AUTH_RESPONSE'}
  } */
  /* #swagger.responses[400] = {
          description: 'Password or Email is wrong',
         schema: {
            success: false,
            msg: 'Email or password is wrong'
        }
  } */
  // let { error } = validateLogin(req.body);
  // if (error) throw new MyError(error.message, 400)
  // passport.authenticate("local", (err, user, info) => {
  // if (err) return res.status(500).json({ success: false, message: 'Internal Server Error' })
  // if (!user) return res.status(401).json({ success: false, message: info.message || 'Invalid credentials' })
  // let token = utils.createToken({ _id: user._id, role: user.role });
  // return res.status(200).json({ token, user, success: true });
  // })(req, res, next)
  res.status(201).json({success: true, message: "Hey"})
};
function validateForgotPassword(formData) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    otp: Joi.boolean().required(),
  });
  return schema.validate(formData, { abortEarly: false });
}

function validateVerifyForgotPassword(formData) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    otp: Joi.number().required()
  });
  return schema.validate(formData, { abortEarly: false });
}

function validateEmail(formData) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
  });
  return schema.validate(formData, { abortEarly: false });
}
function validatePassword(formData) {
  const orderSchema = Joi.object({
    password: Joi.string().required(),
  });

  return orderSchema.validate(formData, { abortEarly: false });
}
function validateLogin(formData) {
  const orderSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  return orderSchema.validate(formData, { abortEarly: false });
}
function validateSignUp(formData) {
  const orderSchema = Joi.object({
    firstName: Joi.string().min(3),
    lastName: Joi.string().min(3),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(6),
    phone: Joi.string().regex(/^\+?\d{9,12}$/),
    role: Joi.string().required().valid("author", "reader"),
    date_of_birth: Joi.date(),
    date_od_death: Joi.date(),
    lang: Joi.string(),
  });

  return orderSchema.validate(formData, { abortEarly: false });
}
