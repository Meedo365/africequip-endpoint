const User = require('../../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('./sendMail');
const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const { auth } = require("../../middleware");

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID);

const { CLIENT_URL } = process.env;

let routes = (app) => {

	app.post("/register", async (req, res) => {
		try {
			const { name, email, password, phone, role } = req.body;
			if (!name || !email || !password)
				return res.status(400).json({ msg: "Please fill in all fields, one or more fileds are empty!" })

			if (!validateEmail(email))
				return res.status(400).json({ msg: "Please enter a valid email address!" })

			const user = await User.findOne({ email })
			if (user) return res.status(400).json({ msg: "This email already exists, please use another email address!" })

			if (password.length < 8)
				return res.status(400).json({ msg: "Password must be atleaast 8 characters long!" })

			const passwordHash = await bcrypt.hash(password, 12)

			const newUser = {
				name, email, password: passwordHash, phone, role
			}

			const activation_token = createActivationToken(newUser)

			const url = `${CLIENT_URL}/user/activate/${activation_token}`

			sendMail(email, url, "Verify your email address")

			res.json({ msg: "Registration Successful, Please check you email for verification mail to activate your account!" })

		}
		catch (err) {
			console.log('error o')
			return res.status(500).json({ msg: err.message });
		}

	});

	app.post("/register/admin", async (req, res) => {
		try {
			const { name, email, password, phone, role } = req.body;
			if (!name || !email || !password)
				return res.status(400).json({ msg: "Please fill in all fields, one or more fileds are empty!" })

			if (!validateEmail(email))
				return res.status(400).json({ msg: "Please enter a valid email address!" })

			const user = await User.findOne({ email })
			if (user) return res.status(400).json({ msg: "This email already exists, please use another email address!" })

			if (password.length < 8)
				return res.status(400).json({ msg: "Password must be atleaast 8 characters long!" })

			const passwordHash = await bcrypt.hash(password, 12)

			const newUser = {
				name, email, password: passwordHash, phone, role: "admin"
			}

			const activation_token = createActivationToken(newUser)

			const url = `${CLIENT_URL}/user/activate/${activation_token}`

			sendMail(email, url, "Verify your email address")

			res.json({ msg: "Registration Successful, Please check you email for verification mail to activate your account!" })

		}
		catch (err) {
			console.log('error o')
			return res.status(500).json({ msg: err.message });
		}

	});

	app.post("/activate", async (req, res) => {
		try {
			const { activation_token } = req.body
			const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

			const { name, email, password, phone, role } = user

			const check = await User.findOne({ email })
			if (check) return res.status(400).json({ msg: "This email already exists." })

			const newUser = new User({
				name, email, password, phone, role
			})

			await newUser.save()

			res.json({ msg: "Account has been activated!" })
		}
		catch (err) {
			res.status(500).send(err);
		}
	});

	app.post("/login", async (req, res) => {
		try {
			const { email, password } = req.body
			const user = await User.findOne({ email })
			if (!user) return res.status(400).json({ msg: "This email does not exist." })

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." })

			const access_token = createAccessToken({ id: user._id })

			const refresh_token = createRefreshToken({ id: user._id })
			res.cookie('refreshtoken', refresh_token, {
				httpOnly: true,
				path: '/user/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
			})

			res.json({
				msg: "Login success!",
				user
			})
		}
		catch (err) {
			res.status(500).send(err);
		}
	});

	app.post("/user/refresh_token", (req, res) => {
		try {
			const rf_token = req.cookies.refreshtoken

			if (!rf_token) return res.status(400).json({ msg: "Please login now!" })

			jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
				if (err) return res.status(400).json({ msg: "Please login now!" })

				const access_token = createAccessToken({ id: user.id })
				res.json({ access_token })
			})
		}
		catch (err) {
			res.status(500).send(err);
		}
	});

	app.post("/forgetPassword", async (req, res) => {
		try {
			const { email } = req.body
			const user = await User.findOne({ email })
			if (!user) return res.status(400).json({ msg: "This email does not exist." })

			const access_token = createAccessToken({ id: user._id })
			const url = `${CLIENT_URL}/user/reset/${access_token}`

			sendMail(email, url, "Reset your password")
			res.json({ msg: "Re-send the password, please check your email." })
		}
		catch (err) {
			res.status(500).send(err);
		}
	});

	app.post("/resetPassword", auth, async (req, res) => {
		try {
			const { password } = req.body

			const passwordHash = await bcrypt.hash(password, 12)

			await User.findOneAndUpdate({ _id: req.user.id }, {
				password: passwordHash
			})

			res.json({ msg: "Password successfully changed!" })
		}
		catch (err) {
			res.status(500).send(err);
		}
	});

	app.get("/infor", auth, async (req, res) => {
		try {
			const user = await User.findById(req.user.id).select('-password')
			res.json(user)
		}
		catch (err) {
			res.status(500).send(err);
		}
	});

	app.post("/logout", async (req, res) => {
		try {
			res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
			return res.json({ msg: "Logged out." })
		}
		catch (err) {
			res.status(500).send(err);
		}
	});

};


function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

function createActivationToken(payload) {
	return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '10m' })
};

function createAccessToken(payload) {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
};

function createRefreshToken(payload) {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10m' })
};

module.exports = routes;
