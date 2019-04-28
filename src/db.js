const mongoose = require('mongoose'), Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const mongooseUniqueValidator = require('mongoose-unique-validator');


const User = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  voc: [{type: Schema.Types.ObjectId, ref: 'Vocabulary'}]
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

Vocabulary.plugin(mongooseUniqueValidator);


mongoose.model('User', User);

mongoose.model('Vocabulary', Vocabulary);

