const passport = require("passport");
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const db = require("./Database/db");
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const Passport = require("./Passport");
app.use(Passport);

//Set up Routes
const auth = require("./Routes/Auth");
const profile = require("./Routes/Profile");
app.use("/profile", passport.authenticate("jwt", { session: false }), profile);
app.use("/auth", auth);

app.post("/register", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const existingUser = await db("login")
      .where("identifier", identifier)
      .first();

    if (existingUser) return res.status(400).send({ message: "User with that username already exists" });

    const hash = await bcrypt.hash(password, 10);

    user = {
      identifier,
      hash
    };

    let newUser = await db("login")
      .returning(["id", "identifier"])
      .insert(user);

    return res.status(200).send({ message: "sucessfully added user", newUser });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "something went wrong" });
  }
});

//SET UP DATABASE

app.get("/", async (req, res) => res.send("hello workld"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, (res, req) => console.log(`App listening on PORT ${PORT}`));
