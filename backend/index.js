const passport = require("passport");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieSession = require("cookie-session");
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
  })
);

const { Passport, PassportSession } = require("./Passport");
app.use(Passport);
app.use(PassportSession);

//Set up cors
app.use(cors({ origin: "*" }));

//Set up Routes
const auth = require("./Routes/Auth");
const profile = require("./Routes/Profile");
app.use("/profile", passport.authenticate("jwt", { session: false }), profile);
app.use("/auth", auth);

//SET UP DATABASE

app.get("/", async (req, res) => res.send("hello workld"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, (res, req) => console.log(`App listening on PORT ${PORT}`));
