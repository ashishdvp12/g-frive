const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  path: String,
  filename: String,
  url: String,
  
  createdAt: { type: Date, default: Date.now },
});

const File = mongoose.model('File', fileSchema);

module.exports = File;
