const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
let path = require("path");

// Here is the storage for the uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

// Here is the file filter, that filters the formats
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

// import all of the middleware
const {
  signUp,
  getUsers,
  checkJWTToken,
  checkContentType,
  login,
  addOrderedBook,
  removeOrderedBook,
  changePasswordVerification,
  changePassword,
  editDetails,
} = require("../controllers/users.controllers");

// Here are all of the users routes
router.post("/login", checkContentType, login);
router.post("/signUp", upload.single("photo"), signUp);
router.get("/:username", checkContentType, checkJWTToken, getUsers);
router.put("/order", checkContentType, addOrderedBook);
router.patch(
  "/changeDetails",
  upload.single("photo"),
  checkJWTToken,
  editDetails
);
router.put(
  "/changePassword",
  checkJWTToken,
  changePasswordVerification,
  changePassword
);
router.delete("/removeOrder", checkContentType, removeOrderedBook);

module.exports = router;
