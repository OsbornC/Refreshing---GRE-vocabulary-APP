require('./db.js');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const Handlebars = require('hbs');
const bcrypt = require('bcryptjs');
app.set('view engine', 'hbs');
const sanitize = require('mongo-sanitize');

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
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "public")));
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({
  secret: 'secret for signing session id',
  resave: true,
  saveUninitialized: true
}));


Handlebars.registerHelper("counter", function (index){
    return index + 1;
});

const Vocabulary = mongoose.model('Vocabulary');
const User = mongoose.model('User');

const checkRedirect = (req, res, next) => {
	if (!req.session.user)
		{res.redirect('login');}
	else
		{next();}
};

mongoose.connect(dbconf);

app.get('/', (req, res)=>{
	res.redirect('/login');
});

app.get('/login', function(req, res){
	res.render('login');
});

app.post('/login', function(req, res){
	const password = sanitize(req.body.password);
	User.findOne({username: sanitize(req.body.username)}, (err, user) => {
		if(err){
			console.log(err);
		}
		else if(!err && user){
			if (user.validPassword(password)){
				req.session.user = user;
				res.render('dictionary');
			}else{
				res.render('login', {wrong: 'Password does not match'});
			}
		}else{
			res.render('login', {wrong: "USER NOT FOUND"});
		}
	});
});

app.get('/register', function(req, res){
	res.render('register');
});

app.post('/register', function(req, res){
	User.findOne({username: sanitize(req.body.username)}, (err, result) => {
		if(err){
			console.log(err);
		}
		else if(result){
			const exists = "Username Already Exists!";
			res.render('register', {userExists: exists});
		}
		else{
			bcrypt.hash(sanitize(req.body.password), 10, (err, hash) => {
				if(err){
					console.log(err);
				}
				new User({
					username: sanitize(req.body.username),
					password: hash
				}).save(err => {
					if(err){
						console.log(err);
					}else{
						res.redirect('login');
					}
				});
			});
		}
	});
});

app.get('/logout', function(req, res){
	req.session.destroy();
	res.redirect('/login');
});


function sampleTwo(array) {
	const first = array[Math.floor(Math.random() * array.length )];
	let second = array[Math.floor(Math.random() * array.length )];
	while (first === second)
		{second = array[Math.floor(Math.random() * array.length )];}
	return [first, second];
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array;
}

app.post('/dictionary', checkRedirect, (req, res)=>{
	const word = sanitize(req.body.word);
	const meaning = sanitize(req.body.meaning);
	const confusionList = [
		'about to happen',
		'unchangeable',
		'unforgiving',
		'bad judgment',
		'owing gratitude to someone or something',
		'to conclude from implicit evidence (as opposed to explicit facts)',
		'naïve or innocent',
		'harmful or hostile',
		'tight-knit and isolated; uninterested in matters outside one’s immediate sphere',
		'concentrated and in-depth',
		'a go-between',
		'indestructible, impervious to harm',
		'irritable, testy, touchy',
		'wishy-washy, hesitant',
		'taciturn, reserved, succinct'
	];
	const confusion = sampleTwo(confusionList);
	while (confusion[0] === req.body.meaning || confusion[1] === req.body.meaning){
		if (confusion[0] === req.body.meaning)
			{confusion[0] = confusionList[Math.floor(Math.random() * confusionList.length )];}
		else
			{confusion[1] = confusionList[Math.floor(Math.random() * confusionList.length )];}
	}
	confusion.push(req.body.meaning);

	Vocabulary.countDocuments({}, function(err, c){
		if (c < 15){
			const voca = new Vocabulary({
				word: word,
				meaning: meaning,
				correctness: false,
				moduleID: 'module1',
				confusion: shuffle(confusion)
			});
			User.findOneAndUpdate({username: req.session.user.username}, {$push: {voc: voca._id}}, {upsert: true});
			voca.save((err) => {
				if(err){
					res.render('dictionary', {word: word, meaning: meaning, breakAndMeaning: 'Meaning:'});
				}else{
					res.render('dictionary', {word: word, meaning: meaning, breakAndMeaning: 'Meaning:'});
				}
			});
		}else{
			Vocabulary.find({}, function(err, result){
				const pickedConfusion = result.map((ele)=>ele.meaning);
				const pickedTwo = sampleTwo(pickedConfusion);
				let pickedThree = pickedTwo.push(req.body.meaning);
				pickedThree = shuffle(pickedThree);
				const voca = new Vocabulary({
					word: word,
					meaning: meaning,
					correctness: false,
					moduleID: 'module1',
					confusion: pickedThree
				});
				User.findOneAndUpdate({username: req.session.user.username}, {$push: {voc: voca._id}}, {upsert: true});
				voca.save((err) => {
					if(err){
						res.render('dictionary', {word: word, meaning: meaning, breakAndMeaning: 'Meaning:'});
					}else{
						res.render('dictionary', {word: word, meaning: meaning, breakAndMeaning: 'Meaning:'});
					}
				});
			});
		}
	});
});

app.get('/dictionary', checkRedirect, (req, res)=>{
	User.findOne({username: req.session.user.username}).populate('voc').exec((err, result) => {
		let fail = true;
		let theWord;
		result.voc.forEach(ele => {
			if (ele.word === req.query.word){
				fail = false;
				theWord = ele;
			}
		});
		if (fail)
			res.render('dictionary');
		else
			res.render('dictionary', {vocabulary: theWord});
	});

});

app.get('/quiz', checkRedirect, (req, res)=>{
	User.findOne({username: req.session.user.username}).populate('voc').exec((err, result) => {
		const countCorrect = result.voc.filter(ele => ele.correctness).length;
		const total = result.voc.length;
		const accuracy = countCorrect / total * 100;
		res.render('quiz', {score: 'Accuracy: ' + accuracy + '%'});
	});		
});

app.post('/quiz', checkRedirect, (req, res)=>{
	User.findOne({username: req.session.user.username}).populate('voc').exec((err, result) => {
		if (err){
			console.log(err);
		}else{
			let countTrue = 0;
			const answers = new Object();
			const quizWords = result.voc.map(ele => ele.word);
			const quizMeanings = result.voc.map(ele => ele.meaning);
			for (let i = 0; i < quizWords.length; i++){
				answers[quizWords[i]] = quizMeanings[i];
				if (quizMeanings[i] === req.body[quizWords[i]]){
					Vocabulary.findOneAndUpdate({
						word: quizWords[i], 
						meaning: quizMeanings[i],
						moduleID: 'module1'
					}, {
						correctness: true
					}, function(err){
						if (err){
							console.log(err);
						}
					});
					countTrue += 1;
				}
			}
			const total = quizWords.length;
			res.render('quiz', {score: 'Accuracy: ' + countTrue/total*100 + '%'});
		}
	});
});	

app.get('/module1', checkRedirect, (req, res)=>{
	User.findOne({username: req.session.user.username}).populate('voc').exec((err, result) => {
		if (err){
			console.log('Something Wrong!');
		}else{
			res.render('module1', {vocabulary: result.voc});
		}
	});
});

app.get('/lists', (req, res)=>{
	User.findOne({username: req.session.user.username}).populate('voc').exec((err, result) => {
		const word = result.voc.map(ele=>ele.word);
		const wordMeaning = [];
		result.voc.map(function(curr, index){
			if (index !== result.voc.length - 1)
				{wordMeaning.push(word[index] + ': ' + curr.meaning + 'SPLITSIGN');}
			else
				{wordMeaning.push(word[index] + ': ' + curr.meaning);}
		});
		res.render('lists', {voc: wordMeaning});
	});
});

app.get('/account', checkRedirect, (req, res)=>{
	User.findOne({username: req.session.user.username}).populate('voc').exec((err, result) => {
		if (err){
			console.log(err);
		}else{
			const countCorrect = result.voc.filter(ele => ele.correctness).length;
			const total = result.voc.length;
			const left = total - countCorrect;
			let accuracy;
			if (total === 0)
				{accuracy = 'Not applicable. Please add some words into the dictionary.';}
			else
				{accuracy = countCorrect / total * 100 + '%';}
			res.render('account', {countCorrect: countCorrect, left: left, accuracy: accuracy});
		}
	});
});

app.listen(process.env.PORT || 3000);
