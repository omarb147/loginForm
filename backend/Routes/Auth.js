const express = require("express");
const auth = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

auth.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
auth.get("/facebook/callback", passport.authenticate("facebook", { successRedirect: "/", failureRedirect: "/login" }));
auth.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));
auth.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), function(req, res) {
  res.redirect("/");
});

auth.post("/local", function(req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ msg: "something went wrong", user });
    }

    req.logIn(user, { session: false }, err => {
      if (err) return res.send(err);
      const token = jwt.sign(user, process.env.JWT_SECRET);
      return res.json({ user, token });
    });
  })(req, res, next);
});

module.exports = auth;
