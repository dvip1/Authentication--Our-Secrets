/* Section 1: Importing modules and setting up important constants */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const port = 3000;
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

/* Section 2: Initialization */
mongoose.connect('mongodb://127.0.0.1/userDB', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(session({
	secret: 'Our little secret',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
const userSchema = new mongoose.Schema({
	email: String,
	password: String
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model('User', userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
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
app.get('/secrets', (req, res) => {
	if (req.isAuthenticated()) {
		res.render('secrets');
	} else {
		res.redirect('/login');
	}
});
app.get('/logout', (req, res) => {
	req.logout((err) => {
		if (err) {
			console.log(err);
		}
		else console.log('logged out');
	});
	res.redirect('/');
});
/* Section 3(ii): Routes(post requests) */
app.post('/register', (req, res) => {
	User.register({ username: req.body.username }, req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			res.redirect('/register');
		} else {
			passport.authenticate('local')(req, res, function () {
				res.redirect('/secrets');
			});
		}
	});

})
app.post('/login', (req, res) => {
	let userName = req.body.username;
	let password = req.body.password;
	const user = new User({
		username: userName,
		password: password
	});
	req.login(user, (err) => {
		if (err) {
			console.log(err);
		} else {
			passport.authenticate('local')(req, res, function () {
				res.redirect('/secrets');
			});
		}
	});
});

/* Listining on port 3000 */
app.listen(port, function () {
	console.log("Server started on port 3000");
});