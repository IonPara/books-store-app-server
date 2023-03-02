const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// Create a schema for users documents
let UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },
  borrowed: [
    {
      _id: {
        type: String,
      },
      title: {
        type: String,
      },
      borrowed: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  ordered: [
    {
      _id: {
        type: String,
        required: true,
      },
      quantity: {
        type: String,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      author: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: String,
        required: true,
      },
      ordered: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  type: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt the passwords
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// module.exports makes the model available outside of your module
const User = mongoose.model("User", UserSchema);
module.exports = User;
