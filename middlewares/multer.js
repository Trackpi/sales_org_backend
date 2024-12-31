const multer = require("multer");
const path = require("path");
const fs = require("fs"); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder;
    if (req.baseUrl.includes("projects")) {
      folder = "uploads/projects";
    } else if (req.baseUrl.includes("videos")) {
      folder = "uploads/videos";
    }
    else if(req.baseUrl.includes("images")){
      folder = "uploads/images";
    } 
    else if (req.baseUrl.includes("partners")){
      folder = "uploads/partners";
     } else if (req.baseUrl.includes("posters")){
        folder = "uploads/posters";
      }else {

      folder = "uploads/";
    }

    // Create folder if it doesn't exist
    const fullPath = path.join(__dirname, "..", folder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|mp4|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only images, PDFs, and video files are allowed"));
  }
});

module.exports = upload;
