const Userp = require('../../models/usersP');
const Token = require('../../models/token');

let routes = (app) => {

    app.post("/confirmation", async (req, res) => {
        try {
            /*		req.assert('email', 'Email is not valid').isEmail();
                req.assert('email', 'Email cannot be blank').notEmpty();
                req.assert('token', 'Token cannot be blank').notEmpty();
                req.sanitize('email').normalizeEmail({ remove_dots: false });
            
                // Check for validation errors    
                var errors = req.validationErrors();
                if (errors) return res.status(400).send(errors);
              */
            // Find a matching token
            Token.findOne({ token: req.body.token }, function (err, token) {
                if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token may have expired.' });

                // If we found a token, find a matching user
                Userp.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
                    if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
                    if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });

                    // Verify and save the user
                    user.isVerified = true;
                    user.save(function (err) {
                        if (err) { return res.status(500).send({ msg: err.message }); }
                        res.status(200).send("The account has been verified. Please log in.");
                    });
                });
            });
        }
        catch (err) {
            res.status(500).send(err)
        }

    });

}

module.exports = routes;
