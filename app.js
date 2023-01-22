require('dotenv').config();
const express= require('express');
const app = express();
const bodyParser = require('body-parser');
const ejs= require('ejs');
const mongoose= require('mongoose');
const encrypt= require('mongoose-encryption');
mongoose.connect('mongodb://127.0.0.1/userDB', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.get("/", function(req, res){
	res.render('home');
});
const userSchema= new mongoose.Schema({
	email: String,
	password: String
});
const secret= process.env.SECRET;
userSchema.plugin(encrypt,{secret: secret, encryptedFields: ['password']});	
const User= new mongoose.model('User', userSchema);
app.get('/login', (req, res)=>{
	res.render('login');
});
app.get('/register', (req, res)=>{
	res.render('register');
})
app.listen(3000, function(){
	console.log("Server started on port 3000");
});

app.post('/register', (req, res)=>{
	const newUser= new User({
		email: req.body.username,
		password: req.body.password
	})
	newUser.save((err)=>{
		if (err)
		console.log('something went wrong in post request of register ->'+ err);
		else res.render('secrets');
	});
})
app.post('/login', (req, res)=>{
	let userName= req.body.username;
	let password= req.body.password;
	User.findOne({email: userName}, (err, foundUser)=>{
		if(err)console.log('something went wrong in post login: '+ err);
		else{
			if(foundUser){
				if(foundUser.password==password)res.render('secrets');
				else res.send('Your password is incorrect');
			}	
			else res.send('<h1>User not found</h1>') 
		}
	});
});
