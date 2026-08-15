const multer = require("multer");
const path = require("path");

const {
  productUploadsDirectory,
} = require("../config/storage");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productUploadsDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error(
        "Only JPG, PNG and WEBP image files are allowed."
      )
    );
  }

  cb(null, true);
};

const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = uploadProductImage;