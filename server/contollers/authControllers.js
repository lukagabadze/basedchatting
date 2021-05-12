const User = require("../models/User");
const Token = require("../models/Token");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user)
      return res
        .status(400)
        .json({ error: { username: "Username already exists" } });

    const newUser = await new User({ username, password }).save();

    const accessToken = await newUser.createAccessToken();
    const refreshToken = await newUser.createRefreshToken();
    return res.status(201).json({ accessToken, refreshToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: { password2: "Internal server error" } });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if username exists
    const user = await User.findOne({ username });
    if (!user)
      return res
        .status(404)
        .json({ error: { username: "Username does not exist", password: "" } });

    // check if password is valid
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res
        .status(401)
        .json({ error: { username: "", password: "Password is incorrect" } });

    // user is valid! generate tokens
    const accessToken = await user.createAccessToken();
    const refreshToken = await user.createRefreshToken();
    return res.status(201).json({ accessToken, refreshToken });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: { username: "", password: "Internal server error" } });
  }
};

const generateAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(403).json({ error: "Authentication token missing" });

    const token = await Token.findOne({ token: refreshToken });
    if (!token)
      return res.status(401).json({ error: "Authentication token expired" });

    // all good, generate new access token
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = jwt.sign(
      { user: payload.user },
      process.env.ACCESS_TOKEN_SECRET
    );

    return res.status(200).json({ accessToken });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await Token.findOneAndDelete({ token: refreshToken });
    return res.status(200).json({ success: "User logged out" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUser = async (req, res) => {
  const userId = req.user;
  try {
    const user = await User.findById(userId);
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  signup,
  login,
  logout,
  generateAccessToken,
  getUser,
};
