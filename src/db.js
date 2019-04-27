const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const User = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true}
});
User.methods.validPassword = function( password ) {
    return bcrypt.compareSync(password, this.password);
};

const Vocabulary = new mongoose.Schema({
  word: {type: String, required: true},
  meaning: {type: String, required: true},
  correctness: {type: Boolean, default: false, required: true},
  confusion: [String],
  moduleID: String
});

const Modules = new mongoose.Schema({
  portion: {type: Number, default: 0, min: 0, max: 1},
  moduleID: String,
  vocabulary: [{type: Vocabulary}]
});

// Vocabulary.plugin(URLSlugs('word meaning'));

mongoose.model('User', User);

mongoose.model('Vocabulary', Vocabulary);

mongoose.model('Modules', Modules);

module.exports = {
    'db':'mongodb://localhost/jc7483'
};
