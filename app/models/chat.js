var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

// user schema
var ChatSchema = new Schema({
  message: String,
  username: {
    type: String,
    index: false,
    unique: false // Unique index. If you specify `unique: true`
    // specifying `index: true` is optional if you do `unique: true`
  }
});


module.exports = mongoose.model('Chat', ChatSchema);
