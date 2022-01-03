const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../middleware/authCheck");

router.get("/users", checkAuth, async (req, res, next) => {
  try {
    const userList = await User.find().select("email");
    res.status(200).json(userList);
  } catch (error) {
    next(error);
  }
});

router.get("/users/:id", checkAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) res.status(200).json(user);
    else res.status(404).json({ message: "User not found." });
  } catch (error) {
    next(error);
  }
});

router.post("/signup", async (req, res, next) => {
  try {
    const user = await User.find({ email: req.body.email });
    if (user.length > 0) {
      res.status(201).json({ message: "User email already exist!" });
    } else {
      const password = await bcrypt.hashSync(req.body.password, 10);
      let newUser = new User({
        email: req.body.email,
        password: password,
      });
      await newUser.save();
      res.status(201).json({ message: "User Created!" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).json({
        message: "login successfully",
        token,
      });
    } else {
      res.status(201).json({ message: "invalid email or password." });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/users", checkAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.body.id);
    if (user) {
      await user.delete();
      res.status(200).json({ message: "User deleted." });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    next(error);
  }
});
module.exports = router;
