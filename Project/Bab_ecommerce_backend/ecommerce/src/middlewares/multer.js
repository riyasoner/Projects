const multer = require("multer");
const path = require("path");
const fs = require("fs");

//  Allowed extensions
const allowedImageTypes =
  /\.(png|jpg|jpeg|doc|docx|pdf|txt|xls|xlsx|ppt|pptx)$/;

//  Disk storage configuration
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "";

    // Handle fieldnames dynamically
    if (file.fieldname === "profileImage") {
      uploadPath = path.join(__dirname, "../../public/profileImage");
    } else if (file.fieldname === "businessDocs") {
      uploadPath = path.join(__dirname, "../../public/businessDocs");
    } else if (file.fieldname === "productImages") {
      uploadPath = path.join(__dirname, "../../public/productImages");
    } else if (/^variantImages(\[\d+\])?$/.test(file.fieldname)) {
      uploadPath = path.join(__dirname, "../../public/variantImages");
    } else if (file.fieldname === "reviewImage") {
      uploadPath = path.join(__dirname, "../../public/reviewImage");
    } else if (file.fieldname === "mainImage") {
      uploadPath = path.join(__dirname, "../../public/mainImage");
    } else if (file.fieldname === "image") {
      uploadPath = path.join(__dirname, "../../public/image");
    } else if (file.fieldname === "blogImages") {
      uploadPath = path.join(__dirname, "../../public/blogImages");
    } else if (file.fieldname === "bannerImage") {
      uploadPath = path.join(__dirname, "../../public/bannerImage");
    } else {
      console.log(` Multer fieldname issue: ${file.fieldname}`);
      return cb(new Error("Invalid fieldname"));
    }

    // Ensure folder exists
    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error creating folder:", err);
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },

  filename: (req, file, cb) => {
    const uniqueName = `${file.fieldname}_${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

// 👇 Multer config
const uploads = multer({
  storage: fileStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(allowedImageTypes)) {
      return cb(new Error("Please upload a valid image or document file."));
    }
    cb(null, true);
  },
});

module.exports = {
  uploads,
};
