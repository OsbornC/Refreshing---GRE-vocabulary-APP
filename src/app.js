require('./db.js');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const passport = require('passport');
const Handlebars = require('hbs');
app.set('view engine', 'hbs');
const path = require('path');

// let dbconf;
// if (process.env.NODE_ENV === 'PRODUCTION') {
	const fs = require('fs');
<<<<<<< HEAD
	
=======
>>>>>>> b433aad0d39f282a0de39d3480415279e1abe201
	const fn = path.join(__dirname, 'config.json');
	const data = fs.readFileSync(fn);
	const conf = JSON.parse(data);
	dbconf = conf.dbconf;
	console.log(dbconf);
// } else {
	dbconf = 'mongodb://localhost/jc7483';
<<<<<<< HEAD
// }
app.use(express.urlencoded({ extended: false }));
=======
}
>>>>>>> b433aad0d39f282a0de39d3480415279e1abe201
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, "..", "public")));
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

Handlebars.registerHelper("counter", function (index){
    return index + 1;
});

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
});

function sampleTwo(array) {
	const first = array[Math.floor(Math.random() * array.length )];
	let second = array[Math.floor(Math.random() * array.length )];
	while (first === second)
		second = array[Math.floor(Math.random() * array.length )];
	return [first, second];
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array;
}

app.post('/dictionary', (req, res)=>{
	const word = req.body.word;
	const meaning = req.body.meaning;
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
	let confusion = sampleTwo(confusionList);
	while (confusion[0] === req.body.meaning || confusion[1] === req.body.meaning){
		if (confusion[0] === req.body.meaning)
			confusion[0] = array[Math.floor(Math.random() * confusionList.length )];
		else
			confusion[1] = array[Math.floor(Math.random() * confusionList.length )];
	}
	confusion.push(req.body.meaning);

	Vocabulary.count({}, function(err, c){
		if (c < 15){
			const voc = new Vocabulary({
				word: word,
				meaning: meaning,
				correctness: false,
				moduleID: 'module1',
				confusion: shuffle(confusion)
			});
			Modules.findOneAndUpdate(
				{moduleID: 'module1'},
				{$push: {vocabulary: voc}},   
				{upsert: true },
				function(err){
					if (err)
						console.log(err);
				} 
			);
			voc.save((err, foundVocab) => {
				if(err){
					res.render('dictionary', {word: word, meaning: meaning, breakAndMeaning: 'Meaning:'});
				}else{
					res.render('dictionary', {word: word, meaning: meaning, breakAndMeaning: 'Meaning:'});
				}
			});
		}else{
			let pickedConfusion = result.map((ele)=>ele.meaning);
			pickedConfusion.push(req.body.meaning);
			console.log(shuffle(pickedConfusion));
			const voc = new Vocabulary({
				word: word,
				meaning: meaning,
				correctness: false,
				moduleID: 'module1',
				confusion: shuffle(pickedConfusion)
			});
			Modules.findOneAndUpdate(
				{moduleID: 'module1'},
				{$push: {vocabulary: voc}},   
				{upsert: true },
				function(err){
					if (err)
						console.log(err);
				}
			);
			voc.save((err, foundVocab) => {
				if(err){
					res.render('dictionary', {word: word, meaning: meaning, breakAndMeaning: 'Meaning:'});
				}else{
					res.render('dictionary', {word: word, meaning: meaning, breakAndMeaning: 'Meaning:'});
				}
			});
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
});

app.get('/quiz', (req, res)=>{
	res.render('quiz');
})

<<<<<<< HEAD
app.post('/quiz', (req, res)=>{
	Modules.find({moduleID: 'module1'}).exec((err, result) =>{
		if (err){
			console.log(err);
		}else{
			let countTrue = 0;
			const answers = new Object();
			const quizWords = result[0].vocabulary.map(ele => ele.word);
			const quizMeanings = result[0].vocabulary.map(ele => ele.meaning);
			for (let i = 0; i < quizWords.length; i++){
				answers[quizWords[i]] = quizMeanings[i];
				if (quizMeanings[i] === req.body[quizWords[i]]){
					countTrue += 1;
				}
			}
			const total = quizWords.length;
			res.render('quiz', {score: 'Accuracy: ' + countTrue/total*100 + '%'});
		}
	});
});	

app.get('/module1', (req, res)=>{
	Vocabulary.find().exec((err, result) => {
		if (err){
			console.log('Something Wrong!');
		}else{
			res.render('module1', {vocabulary: result});
		}
	});
});

app.listen(3000);
// app.listen(process.env.PORT || 3000);
=======
app.listen(process.env.PORT || 3000);
>>>>>>> b433aad0d39f282a0de39d3480415279e1abe201
