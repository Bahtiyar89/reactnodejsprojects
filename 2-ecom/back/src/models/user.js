const mongoose = require("mongoose");
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, maxlength: 16 },
    email: { type: String, trim: true, required: true, unique: 32 },
    hashed_password: { type: String, required: true },
    about: { type: String, trim: true },
    salt: String,
    role: { type: Number, default: 0 },
    history: { type: Array, default: [] }
  },
  { timestamps: true }
);

//virtual field password coms from client side
userSchema
  .virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.hashed_password = this.encryptedPassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  //authonticate and encriptedPassword is methods is a method
  authonticate: function(plainText) {
    return this.encryptedPassword(plainText) === this.hashed_password;
  },

  encryptedPassword: function(password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.model("User", userSchema);
