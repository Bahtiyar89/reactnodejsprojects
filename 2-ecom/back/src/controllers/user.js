const User = require("../models/user");

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }
    //req object add to profile
    req.profile = user;
    next();
  });
};

exports.read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

exports.update = (req, res) => {
  console.log("user update", req.body);
  req.body.role = 0; // role will always be 0
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true },
    (error, user) => {
      if (error) {
        return res.status(400).json({
          error: "You are not authorized to perform this action"
        });
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    }
  );
};
/*
exports.update = (req, res) => {
  // console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
  const { name, password } = req.body;

  User.findOne({ _id: req.profile._id }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }
    if (!name) {
      return res.status(400).json({
        error: "Name is required"
      });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: "Password should be min 6 characters long"
        });
      } else {
        user.password = password;
      }
    }

    user.save((err, updatedUser) => {
      if (err) {
        console.log("USER UPDATE ERROR", err);
        return res.status(400).json({
          error: "User update failed"
        });
      }
      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;
      res.json(updatedUser);
    });
  });
};
*/
