require('./db.js');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');
app.set('view engine', 'hbs');

let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
	const fs = require('fs');
	const fn = path.join(__dirname, 'config.json');
	const data = fs.readFileSync(fn);
	const conf = JSON.parse(data);
	dbconf = conf.dbconf;
	console.log(dbconf);
} else {
	dbconf = 'mongodb://localhost/jc7483';
}
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, "..", "public")));
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const Modules = mongoose.model('Modules');
const Vocabulary = mongoose.model('Vocabulary');
const User = mongoose.model('User');

mongoose.connect(dbconf);

app.get('/', (req, res)=>{
	res.render('login');
});

app.post('/', (req, res)=>{
	const username = req.body.username;
	const password = req.body.password;
})

app.post('/dictionary', (req, res)=>{
	const word = req.body.word;
	const meaning = req.body.meaning;
	const vocab = new Vocabulary({
		word: word,
		meaning: meaning,
		correctness: false
	});
	vocab.save((err, foundVocab) => {
		if(err){
			res.render('dictionary', {word: word, meaning: meaning, breakAndMeaning: 'Meaning:'});
		}else{
			res.render('dictionary', {word: word, meaning: meaning, breakAndMeaning: 'Meaning:'});
		}
	});
});

app.get('/dictionary', (req, res)=>{
	const word = req.query.word;
	Vocabulary.findOne({word: word}, (err, foundVocab) => {
		if (err){
			console.log('Something Wrong!');
		}else {
			console.log(foundVocab)
			res.render('dictionary', {vocabulary: foundVocab});
		}
	});
})

app.listen(process.env.PORT || 3000);
