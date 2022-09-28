require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5001;
// offline
const cors = require('cors');
const routes = require('./routes');
const path = require('path');
const cookieParser = require('cookie-parser');
// offline
// const CONNECTION_STRING = "mongodb://localhost:27017/africequip";
// online
const CONNECTION_STRING = "mongodb+srv://meedoMontana:MontanaMongo01@myafricequipdb.rsxoiac.mongodb.net/africequip";

mongoose.connect(CONNECTION_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.connection.on('open', () => console.log('Mongo Running'));
mongoose.connection.on('error', (err) => console.log(err));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// offline
app.use(cors());
app.use(cookieParser());

app.use(routes);
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
	res.send("this is index route for endpoints, welcome to your africequip project endpoints");
});

// app.all('*', (req, res, next) => {
// 	next(new ExpressError('Page Not Found!!!', 404))
// });

app.listen(PORT);
console.log('App is running on port:' + PORT);