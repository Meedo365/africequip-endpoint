const Userp = require('../../models/usersP');

let routes = (app) =>{

/**
* POST /login
* Sign in with email and password
*/
exports.loginPost = function(req, res, next) {
    /*req.assert('email', 'Email is not valid').isEmail();
    req.assert('email', 'Email cannot be blank').notEmpty();
    req.assert('password', 'Password cannot be blank').notEmpty();
    req.sanitize('email').normalizeEmail({ remove_dots: false });

    // Check for validation error
    //var errors = req.validationErrors();
    //if (errors) return res.status(400).send(errors);
	*/

    Userp.findOne({ email: req.body.email }, function(err, user) {
        if (!user) return res.status(401).send({ msg: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});

        user.comparePassword(req.body.password, function (err, isMatch) {
            if (!isMatch) return res.status(401).send({ msg: 'Invalid email or password' });

            // Make sure the user has been verified
            if (!user.isVerified) return res.status(401).send({ type: 'not-verified', msg: 'Your account has not been verified.' }); 

            // Login successful, write token, and send back user
            //res.send({ token: generateToken(user), user: user.toJSON() });
		res.send({ token: '1234', user: user.toJSON() });
        });
    });
};
}

module.exports = routes;
