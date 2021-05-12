const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

tokenSchema.index({ expireAfterSeconds: 1000000 });

const tokenModel = mongoose.model("token", tokenSchema);

module.exports = tokenModel;
