const jwt = require('jsonwebtoken')

const isLoggedIn = (req, res, next) => {
	console.log("REQ.USER" + ':' + req.user, "     ", req.originalUrl)
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl
		req.flash('error', 'You must be logged in first!');
		return res.redirect('http://localhost:3000/login');
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

// const isUser = async (req, res, next) => {
// 	const { id } = req.params;
// 	const comment = await Comment.findById(id);
// 	if (req.user === undefined || !comment.user_id.equals(req.user._id)) {
// 		return res.status(401).send('You do not have permission!!!');
// 	}
// 	next();
// }

module.exports = { isLoggedIn, auth };