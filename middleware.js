const jwt = require('jsonwebtoken')

const isLoggedIn = (req, res, next) => {
	if (!req.body.user_id) {
		res.json({ msg: "You have to Login !!!" })
	}
	next();
};

const auth = (req, res, next) => {
	try {
		const token = req.header("Authorization")
		if (!token) return res.status(400).json({ msg: "Invalid Authentication." })

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) return res.status(400).json({ msg: "Invalid Authentication." })
			req.user = user
			next()
		})
	} catch (err) {
		return res.status(500).json({ msg: err.message })
	}
}

module.exports = { isLoggedIn, auth };