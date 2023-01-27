/* Section 1: Importing modules and setting up important constants */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 3;
const port = 3000;

/* Section 2: Initialization */
mongoose.connect('mongodb://127.0.0.1/userDB', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));
const userSchema = new mongoose.Schema({
	email: String,
	password: String
});
const User = new mongoose.model('User', userSchema);

/* Section 3(i): Routes (get request)*/
app.get("/", function (req, res) {
	res.render('home');
});
app.get('/login', (req, res) => {
	res.render('login');
});
app.get('/register', (req, res) => {
	res.render('register');
})

/* Section 3(ii): Routes(post requests) */
app.post('/register', (req, res) => {
	bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
		const newUser = new User({
			email: req.body.username,
			password: hash
		});
		newUser.save((err) => {
			if (err)
				console.log('something went wrong in post request of register ->' + err);
			else res.render('secrets');
		});
	});

})
app.post('/login', (req, res) => {


	let userName = req.body.username;
	let password = req.body.password;

	User.findOne({ email: userName }, (err, foundUser) => {
		if (err) console.log('something went wrong in post login: ' + err);
		else {
			if (foundUser) {
				bcrypt.compare(password, foundUser.password, (err, result)=> {
					if (result==true) res.render('secrets');
					else res.send('Your password is incorrect');
				});
			}
			else res.send('<h1>User not found</h1>')
		}
	});

});

/* Listining on port 3000 */
app.listen(port, function () {
	console.log("Server started on port 3000");
});