const mongoose = require('mongoose');
const User = new mongoose.Schema({
  // username provided by authentication plugin
  // password hash provided by authentication plugin
  lists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Modules' }]
});

const Vocabulary = new mongoose.Schema({
  word: {type: String, required: true},
  meaning: {type: String, required: true},
  correctness: {type: Boolean, default: false, required: true},
  sentence: {type: String, default: false, required: true}
}, {
  _id: true
});

const Modules = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
  name: {type: String, required: true},
  portion: {type: Number, required: true, default: 0, min: 0, max: 1},
  vocabulary: [Vocabulary]
});