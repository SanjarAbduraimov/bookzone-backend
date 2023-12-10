import Users from "../models/users.js";
import Joi from "joi";
import * as utils from "../utils/index.js";
import Author from "../models/authors.js";
import User from "../models/users.js";
import emailService from "../lib/nodemailer/index.js";
import MyError from "../utils/error.js";

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

  let token = utils.createToken({ userId: user._id, role: user.role });
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
  await user.save()
  return res.status(201).json({ success: true, msg: 'Password resettled successfully' });
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
    console.log(token, "token");
    const mail = await emailService.send({
      to: user.email,
      html: `<a href='${fullUrl}/?token=${token}'><b>Bos Jails</b></a>`,
    })
    console.log(fullUrl, `/?token=${token}`);
    return res.status(201).json({ success: true, msg: `Verification link sended to your email` });
  }

  return res.status(400).json({ success: true, msg: 'Email already verified' });

}
export const login = async (req, res) => {
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
  let { email, password } = req.body;
  let { error } = validateLogin(req.body);
  if (error) throw new MyError(error.message, 400)

  // try {
  let user = await Users.findOne({ email }, { password: { select: false } });
  if (!user) throw new MyError("Email or password is incorrect", 400)

  const isPasswordCorrect = await user.comparePassword(password);
  if (isPasswordCorrect) {
    let token = utils.createToken({ _id: user._id, role: user.role });
    let { password, ...docs } = user._doc;
    return res.status(200).json({ token, user: docs, success: true });
  }
  throw new MyError("Email or password is incorrect", 400)
};

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
