// import router
const router = require("express").Router();
// import models
const { User } = require("../../models");

// create a new user
router.post("/", async (req, res) => {
  try {
    const userData = await User.create({
      username: req.body.username,
      password: req.body.password
    });

    // set up sessions with a 'loggedIn' variable set to `true`
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      // return the response with a status of `200` and end the connection
      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Handles user login
router.post("/login", async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { username: req.body.username }
    });

    if (!userData) {
      res
        .status(400)
        .json({ message: "Incorrect username or password, please try again" });
      return;
    }

    const validPassword = userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: "Incorrect username or password, please try again" });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: "You are logged in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Handles signup
router.post("/signup", async (req, res) => {
  try {
    const userData = await User.create({
      username: req.body.username,
      password: req.body.password
    });

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({
        message: "Password must be at least 8 characters long, please try again"
      });
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: "You are now signed in!" });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// Handles user logout
router.post("/logout", async (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
