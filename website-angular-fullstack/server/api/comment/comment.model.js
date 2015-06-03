'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
  text: String,
  name: String
});

module.exports = mongoose.model('Comment', CommentSchema);