const jwt = require("jsonwebtoken");
const User = require("../models/mongoose");
const bcrypt = require("bcrypt");

// This middleware will find the user in the database and send it as a response
async function getUsers(req, res) {
  try {
    const user = await User.findOne({ username: req.params.username });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Invalid user" });
    console.log(error);
  }
}

// Login middleware
// Checks the user's name and password with the ones from the database and if they match it creates a JWT token
const login = async (req, res) => {
  try {
    const { password, username } = req.body;
    const userInformation = await User.findOne({ username });
    if (userInformation) {
      const auth = await bcrypt.compare(password, userInformation.password);
      if (auth) {
        let jwtToken = jwt.sign(
          {
            username: userInformation.username,
            password: userInformation.password,
          },
          "secretKey",
          { expiresIn: "1h" }
        );
        res.json({ token: jwtToken });
      } else {
        res.json({ message: "Invalid password" });
      }
    } else {
      res.json({ message: "Invalid username" });
    }
  } catch (error) {
    console.error(error);
  }
};

// Check JWT middleware will check the given token
function checkJWTToken(req, res, next) {
  if (req.headers.token) {
    let token = req.headers.token;
    jwt.verify(token, "secretKey", function (error, data) {
      if (error) {
        res.send({ message: "Invalid Token" });
        next();
      } else {
        req.username = data.username;
        req.password = data.password;
        next();
      }
    });
  } else {
    res.send({ message: "No token attached to the request" });
  }
}

// Sign up middleware
// It will check  if the user doesn't exist, if the password is greater than 6 and if the password matches
// It will create a new user document with username and password
// If something doesn't it will send an error message
async function signUp(req, res, next) {
  const { name, password, username, photo } = req.body;
  const userExists = await User.findOne({ username: username });
  if (
    !userExists &&
    password.length >= 6 &&
    password == req.body.confirmPassword
  ) {
    const newUser = new User({
      name: name,
      username,
      password,
      borrowed: [],
      ordered: [],
      photo,
      type: "Regular user",
    });
    try {
      await newUser.save();
      res.json({ message: "Account successfully created" });
      next();
    } catch (error) {
      console.error(error);
    }
  } else if (userExists) {
    res.json({
      status: 403,
      message: `The username already exists, try again.`,
    });
  } else if (password.length < 6) {
    res.json({
      message: "The password has to be a minimum of six characters.",
    });
  } else {
    res.json({
      message: `Password and Confirmation Password does not match.`,
    });
  }
}

// This middleware will check if the content is a JSON type
function checkContentType(req, res, next) {
  if (req.headers["content-type"] == "application/json") {
    next();
  } else {
    res.send({ status: 406, message: "We only accept JSON content type." });
  }
}

// this middleware will find the user in the database and add a book in the ordered array
async function addOrderedBook(req, res) {
  const { author, title, image, id, username, quantity, price } = req.body;
  const user = await User.findOne({ username: username });
  if (user) {
    try {
      await User.updateOne(
        { username: username },
        {
          $push: {
            ordered: {
              _id: id,
              title,
              author,
              image,
              quantity,
              price,
            },
          },
        }
      );
      res.json({ message: "Order successfully added!" });
    } catch (error) {
      console.log(error);
    }
  }
}

// this middleware will find the user in the database and remove a book in the ordered array
async function removeOrderedBook(req, res) {
  try {
    const { username, id } = req.body;
    await User.updateOne(
      { username: username },
      {
        $pull: {
          ordered: {
            _id: id,
          },
        },
      }
    );
    res.send({ message: "Success" });
  } catch (error) {
    console.error(error);
  }
}

// this middleware will verify the passwords
function changePasswordVerification(req, res, next) {
  if (
    req.body.password == req.body.confirmPassword &&
    req.body.password.length >= 6
  ) {
    req.newUserPassword = req.body.password;
    next();
  } else if (req.body.password.length < 6) {
    res.send({
      message: "The new password needs to be longer than six characters.",
    });
    next();
  } else {
    res.send({
      message: "Confirmation Password and New Password does not match.",
    });
    next();
  }
}

// this middleware will change the password of the user
async function changePassword(req, res) {
  let { username, password } = req.body;
  const salt = await bcrypt.genSalt();
  password = await bcrypt.hash(password, salt);
  const user = await User.findOne({ username: username });
  if (user) {
    try {
      await User.updateOne(
        { username: username },
        {
          $set: {
            password,
          },
        }
      );
      res.send({ message: "Success" });
    } catch (error) {
      console.error(error);
    }
  } else {
    res.send({ message: `User doesn't exists` });
  }
}

// this middleware will edit the details of the user
async function editDetails(req, res) {
  const { username, newUsername, name, photo } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    try {
      await User.updateOne(
        { username },
        {
          $set: {
            name,
            username: newUsername,
            photo,
          },
        }
      );
      res.json({ message: "Success" });
    } catch (error) {
      console.error(error);
    }
  } else {
    res.json({ message: `User doesn't exists` });
  }
}

// Export all of the middleware
module.exports = {
  addOrderedBook,
  checkJWTToken,
  signUp,
  getUsers,
  checkContentType,
  login,
  removeOrderedBook,
  changePasswordVerification,
  changePassword,
  editDetails,
};
