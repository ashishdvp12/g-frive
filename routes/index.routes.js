const express = require('express');
const router = express.Router();
const upload = require('../config/multer'); // multer setup with cloudinary storage
const  authMiddleware = require('../middlewares/auth'); // Assuming you have an auth middleware
const fileModel = require('../models/file.model'); // Assuming you have a file model
// GET home page

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/home', authMiddleware,async(req, res) => {
    const userfiles= await fileModel.find({user:req.user._id});
    console.log(userfiles);

  res.render('home', {
    files: userfiles,
  });
});

// POST upload route
router.post('/upload-file', authMiddleware, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

 const file = await fileModel.create({
  url: req.file.path,              // <-- this is the Cloudinary URL
  filename: req.file.originalname, // or req.file.filename
  user: req.user._id,
});



  res.redirect('/home')
});
router.get('/download/:filename', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const filename = decodeURIComponent(req.params.filename);

    const file = await fileModel.findOne({ filename, user: userId });

    if (!file || !file.url) {
      return res.status(404).json({ message: "File not found or missing URL" });
    }

    // Modify the URL for download
    const downloadUrl = file.url.replace('/upload/', '/upload/fl_attachment/');

    // Redirect to download URL
    return res.redirect(downloadUrl);

  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




module.exports = router;
