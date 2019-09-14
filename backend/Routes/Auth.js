const express = require("express");
const auth = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { db, TABLES } = require("../db");
const { findUserOrInsert } = require("../Models/users");

auth.get("/facebook", passport.authenticate("facebook", { scope: ["email"], session: false }));

// REFACT THE Login PROCESSS
auth.get("/facebook/callback", function(req, res, next) {
  passport.authenticate(
    "facebook",
    { scope: ["email"], session: false },

    (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({ msg: "something went wrong", user });
      }

      req.logIn(user, { session: false }, err => {
        if (err) return res.send(err);
        const token = jwt.sign(user, process.env.JWT_SECRET);
        return res.json({ user, token });
      });
    }
  )(req, res, next);
});

auth.get("/google", function(req, res, next) {
  passport.authenticate(
    "google",
    { scope: ["email", "profile"], session: false },

    (err, user, info) => {
      if (err || !user) {
        return res.status(400).json({ msg: "something went wrong", user });
      }

      req.logIn(user, { session: false }, err => {
        if (err) return res.send(err);
        const token = jwt.sign(user, process.env.JWT_SECRET);
        return res.json({ user, token });
      });
    }
  )(req, res, next);
});

auth.get("/google/callback", function(req, res, next) {
  passport.authenticate("google", { session: false }, (err, user, info) => {
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

auth.post("/local", function(req, res, next) {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      console.log(user);
      return res.status(400).json({ msg: "something went wrong", user });
    }

    req.logIn(user, { session: false }, err => {
      if (err) return res.send(err);
      const token = jwt.sign(user, process.env.JWT_SECRET);
      return res.json({ user, token });
    });
  })(req, res, next);
});

auth.post("/register", async (req, res) => {
  const { identifier, password } = req.body;

  // try {
  //   const hash = await bcrypt.hash(password, 10);
  //   await findUserOrInsert(identifier, { identifier, password_hash: hash, provider: "local" }, (error, user) => {
  //     if (error) return res.status(400).send({ msg: "something went wrong" });
  //   });
  // } catch (err) {
  //   console.error(err.message);
  //   res.staus(400).send({});
  // }

  try {
    const existingUser = await db(TABLES.USERS)
      .where("identifier", identifier)
      .first();

    if (existingUser) return res.status(400).send({ message: "User with that username already exists" });

    const hash = await bcrypt.hash(password, 10);

    user = {
      identifier,
      password_hash: hash,
      provider: "local"
    };

    let newUser = await db(TABLES.USERS)
      .returning(["id", "identifier"])
      .insert(user);

    return res.status(200).send({ message: "sucessfully added user", newUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "something went wrong" });
  }
});
module.exports = auth;
