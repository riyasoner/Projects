const multer = require("multer");
const path = require("path");
const fs = require("fs");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = ""; // Define the upload path

    switch (file.fieldname) {
      case "upload_image":
        uploadPath = path.join(__dirname, "../../public/upload_image");
        break;
      case "customer_image":
        uploadPath = path.join(__dirname, "../../public/customer_image");
        break;
      // Add more cases as needed
      default:
        console.error(`Multer error: Unrecognized field name '${file.fieldname}'`);
        return cb(new Error("Invalid field name"));
    }

    // Use fs module to create the folder
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating folder:", err);
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const allowedFileTypes = /\.(png|jpg|jpeg|doc|docx|pdf|txt|xls|xlsx|ppt|pptx|mp4|mkv)$/;

const uploads = multer({
  storage: fileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(allowedFileTypes)) {
      return cb(new Error("Please upload a file with a valid format (image, document, or video)."));
    }
    cb(null, true);
  },
});

module.exports = { uploads };
