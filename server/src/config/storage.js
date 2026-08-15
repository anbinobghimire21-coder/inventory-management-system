const path = require("path");
const fs = require("fs");

const serverRoot = path.join(__dirname, "../..");

// Railway automatically provides this when a volume is attached.
// Locally it will be undefined, so we keep using our normal folders.
const volumeRoot =
  process.env.RAILWAY_VOLUME_MOUNT_PATH || null;

const dataDirectory =
  volumeRoot ||
  path.join(serverRoot, "data");

const uploadsDirectory =
  volumeRoot
    ? path.join(volumeRoot, "uploads")
    : path.join(serverRoot, "uploads");

const productUploadsDirectory =
  path.join(uploadsDirectory, "products");

// Make sure required folders exist
[
  dataDirectory,
  uploadsDirectory,
  productUploadsDirectory,
].forEach((directory) => {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, {
      recursive: true,
    });
  }
});

module.exports = {
  dataDirectory,
  uploadsDirectory,
  productUploadsDirectory,
}; 