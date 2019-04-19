require('./db.js');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const passport = require('passport');
app.set('view engine', 'hbs');

let dbconf;
// if (process.env.NODE_ENV === 'PRODUCTION') {
	const fs = require('fs');
	const path = require('path');
	const fn = path.join(__dirname, 'config.json');
	const data = fs.readFileSync(fn);

// 	const conf = JSON.parse(data);
// 	dbconf = conf.dbconf;
// 	console.log(dbconf);
// } else {
	dbconf = 'mongodb://localhost/jc7483';
// }
app.use(express.urlencoded({ extended: false }));
mongoose.Promise = global.Promise;
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
	const vacab = new Vocabulary({
		word: rating,
		meaning: sanitize(req.body.name),
		correctness: false
	});
	book.save((err) => {
		if(err){
			res.render('dictionary', {word: word, meaning: meaning});
		}else{
			res.redirect('/dictionary');
		}
	});
});

app.get('/dictionary', (req, res)=>{
	const word = req.query.word;
	Vocabulary.find({word: word}, (err, foundBooks) => {
		if (err){
			console.log('Something Wrong!')
		}else{
			res.render('dictionary', {word: word, meaning: meaning});
		}	
	});
})

app.listen(3000);