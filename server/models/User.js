const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Token = require("./Token");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    maxLength: 20,
    minLength: 4,
  },
  password: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  media: {
    type: String,
    default: "default.jpg",
  },
});

userSchema.methods = {
  createAccessToken: async function () {
    try {
      const { _id, username } = this;
      const accessToken = jwt.sign(
        { user: { _id, username } },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1000m",
        }
      );
      return accessToken;
    } catch (err) {
      console.log(err);
      return;
    }
  },
  createRefreshToken: async function () {
    try {
      const { _id, username } = this;
      const refreshToken = jwt.sign(
        { user: { _id, username } },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "50000m",
        }
      );

      await new Token({ token: refreshToken }).save();
      return refreshToken;
    } catch (err) {
      console.log(err);
      return;
    }
  },
};

// pre save hook to hash the password before saving it to db
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  } catch (err) {
    console.log(err);
  }
  next();
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
